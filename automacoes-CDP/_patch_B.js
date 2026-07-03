const fs = require('fs');
const DIR = 'C:/Users/alexa/Desktop/Clara IA/automacoes-CDP/';

const SQL = {};

SQL['[SDR] Tool Agendar Reuniao - CDP.json'] =
`WITH d AS (
  SELECT cd.id, cd.person_id, cd.closer_user_id
  FROM commercial_deals cd
  JOIN persons pe ON pe.id = cd.person_id
  WHERE pe.telephone = '{{ $('When Executed by Another Workflow').item.json.whatsapp }}'
    AND cd.discarded_at IS NULL
  ORDER BY cd.created_at DESC
  LIMIT 1
),
upd AS (
  UPDATE commercial_deals cd
  SET stage = 'agendado',
      status = 'open',
      scheduled_meeting_at = NULLIF('{{ $('Create an event').item.json.start.dateTime }}', '')::timestamptz,
      pipedrive_deal_id = NULLIF(NULLIF('{{ $('Duplica lead').item.json.id }}', ''), 'undefined'),
      updated_at = now()
  FROM d WHERE cd.id = d.id
  RETURNING cd.id
)
INSERT INTO commercial_activities (
  commercial_deal_id, person_id, user_id, activity_type, origin, status,
  subject, start_at, end_at, custom_properties, created_at, updated_at
)
SELECT d.id, d.person_id, d.closer_user_id,
       'meeting', 'ia', 'scheduled', 'Reunião agendada',
       NULLIF('{{ $('Create an event').item.json.start.dateTime }}', '')::timestamptz,
       NULLIF('{{ $('Create an event').item.json.end.dateTime }}', '')::timestamptz,
       jsonb_build_object(
         'id_agendamento', NULLIF('{{ $('Create an event').item.json.id }}', ''),
         'link_reuniao', NULLIF($lk${{ $('Create an event').item.json.conferenceData.entryPoints[0].uri }}$lk$, '')
       ),
       now(), now()
FROM d;`;

SQL['[SDR] Reagendamento - CDP.json'] =
`WITH d AS (
  SELECT cd.id
  FROM commercial_deals cd
  JOIN persons pe ON pe.id = cd.person_id
  WHERE pe.telephone = '{{ $('When Executed by Another Workflow').item.json.whatsapp }}'
    AND cd.discarded_at IS NULL
  ORDER BY cd.created_at DESC
  LIMIT 1
),
upd AS (
  UPDATE commercial_deals cd
  SET stage = 'agendamento',
      ai_enabled = true,
      closer_user_id = NULL,
      custom_properties = (COALESCE(cd.custom_properties, '{}'::jsonb) - 'closer' - 'closer_email' - 'slot_closer'),
      updated_at = now()
  FROM d WHERE cd.id = d.id
  RETURNING cd.id
)
UPDATE commercial_activities a
SET status = 'cancelled', updated_at = now()
FROM d
WHERE a.commercial_deal_id = d.id
  AND a.activity_type = 'meeting'
  AND a.status = 'scheduled';`;

SQL['[SDR] Tool consulta_agenda - CDP.json'] =
`WITH d AS (
  SELECT cd.id
  FROM commercial_deals cd
  JOIN persons pe ON pe.id = cd.person_id
  WHERE pe.telephone = '{{ $('When Executed by Another Workflow').first().json.whatsapp }}'
    AND cd.discarded_at IS NULL
  ORDER BY cd.created_at DESC
  LIMIT 1
)
UPDATE commercial_deals cd
SET closer_user_id = COALESCE(
      (SELECT id FROM users WHERE lower(email) = lower('{{ $('Gerar horários_2').item.json.email }}')),
      cd.closer_user_id),
    custom_properties = COALESCE(cd.custom_properties, '{}'::jsonb) || jsonb_build_object(
      'closer', $cn${{ $('Gerar horários_2').item.json.nome }}$cn$,
      'closer_email', '{{ $('Gerar horários_2').item.json.email }}',
      'slot_closer', '{{ $('Gerar horários_2').item.json.duracao_reuniao }}'
    ),
    updated_at = now()
FROM d WHERE cd.id = d.id;`;

for (const [file, sql] of Object.entries(SQL)) {
  let raw = fs.readFileSync(DIR + file, 'utf8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  const wf = JSON.parse(raw);
  const pg = wf.nodes.find(n => n.type === 'n8n-nodes-base.postgres');
  if (!pg) { console.log('!! sem PG:', file); continue; }
  pg.parameters.query = sql;
  fs.writeFileSync(DIR + file, JSON.stringify(wf, null, 2), 'utf8');
  console.log('OK patch ->', file, '| node:', pg.name);
}
