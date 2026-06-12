Purpose & context
Cardapinho works at Cardápio Web (CW), a B2B SaaS platform serving the foodservice segment (restaurants, delivery operations). Their role is Coordenador de Growth, leading a Growth team (internally "GWT") of four junior-level professionals: a web designer/automation analyst, a designer, a copywriter/SEO specialist, and a paid media manager. They report to a marketing manager named Rodrigo.
The team's core mandate is demand generation across three lead types:

SQLs – restaurant leads
CQLs – agency/traffic manager partners (CW Club/Parceria program)
TQLs – recruitment leads for sales roles

Active Q2 2026 OKR targets include SQLs, CQLs, TQLs, hypotheses tested, and creatives tested. Monthly targets track leads, CPL benchmarks, and media budget split across Meta and Google Ads. Known active challenges: no-show rates from the Clara IA SDR agent, CQL CPL above target, underdeveloped testing cadence.
Key colleagues: Gabriel (needs access to ad data), Rodrigo (marketing manager), Alexandre Magno, Gabriel Santos, Jota, Antonio Carlos/Tonhão (GWT sprint team members). Sales team roles include BDRs, SDRs, and Closers.

Current state
Clara IA SDR Agent – Cardapinho's most active and complex project. Clara is an AI-powered WhatsApp SDR agent that qualifies leads and schedules meetings with Closers autonomously. Key operational context:

Runs on n8n, integrated with Kommo (WhatsApp CRM), Pipedrive, Supabase, and Google Calendar
Current prompt versions: SDR v2.8, Scheduling Subagent v2.7, CRM Analyst Agent v4
No-show rate from the Clara funnel was ~43.4% in April (healthy benchmark ~30%); C2 was worst cycle (55.3%), C4 was best (25%)
An A/B test (Claude Sonnet vs. GPT-4 as underlying model, 520 leads split evenly over 7 days) showed Claude with a 33% scheduling advantage and one closed deal vs. zero for GPT, with deeper conversation engagement

Clara follow-up flow (canonical reference):

Boas-vindas template sent immediately after lead converts on LP
Fluxo A (lead responded): up to 3 personalized follow-ups within 24h conversation window, triggered at 30min / 30min / 2h / 8h inactivity intervals
Fluxo B (lead never responded): approved Meta marketing templates, 1/day, with a 48h pause between 3rd and 4th message, ~7 messages total
Meeting reminders: 1 day before, morning of the day, 2h before, 30min before

GWT Sprint Dashboard – Python script (update_dashboard.py) triggered via GitHub Actions (weekdays, 07h Fortaleza = 10h UTC), deploying public/index.html to a private GitHub repo connected to Vercel. Layout: full-width burndown chart, team ranking by % SPs delivered with medal emojis, per-person distribution in side panel. Jira sprint SM28 (ID 5102). Last known issue: conflicting workflow files caused duplicate runs; Cardapinho decided to delete the repo and start fresh with a clean ZIP.
Meta Ads – Managing two accounts under CW umbrella; main account (ending 7938) not MCP-enabled. Secondary account (ID: 1215741206717883) is active. Account showed signs of creative fatigue (rising CPM, CTR drops); Bruno Urel Reels and Glauton creatives flagged as worst performers; Steve creatives more resilient.
Google Ads – Monitors state-level campaign performance (SP, RJ, PE, MG, BA, GO, PA) using the SW campaigns panel at ad group level. A May vs. April comparison showed improved performance but substantially higher CPL and costs alongside a significant budget increase. A "Sistema de Gestão / RP" campaign also tracked.
Marketing copy – Working on cashback/loyalty feature copy in Brazilian Portuguese. Core strategic anchor: "venda mais para o mesmo cliente" (sell more to the same customer). Iterating on headlines and subheadlines focused on repeat purchase frequency, ticket size, and revenue from already-acquired customers.

On the horizon

Resolving the GWT sprint dashboard GitHub Actions conflict and redeploying from clean repo
Creating a recurring state-level Google Ads review mechanism with a defined cadence and CPL-based cutoff criteria
May pipeline projection for Clara funnel: targeting 50 sales, with scenario modeling around improving show rates and conversion rates; identified growth levers include ~1,044 leads with no follow-up and 583 leads stuck in triagem
Continued creative refresh on Meta Ads to address fatigue signals
Strengthening CQL CPL performance and testing cadence to hit Q2 OKRs


Key learnings & principles

No-show prevention is structural, not tactical: Commit gates (scarcity trigger → shift preference → slot presentation → post-booking commitment) must be fixed scripts with non-negotiable wording; only bracketed fields like name/day/time can be substituted
Clara qualification logic: BANT-based; all decision-makers must attend the meeting; timing/priority probed with structured fallbacks; scheduling subagent uses turno (shift) prioritization with strict fallback sequence (preferred shift ≤2 days → preferred shift beyond → opposite shift as last resort); same-day slots must be ≥1h30 apart
CRM stage evaluation: Chain-of-thought must evaluate pipeline stages from most → least advanced in a single pass to avoid getting stuck at first satisfied condition; apresentacao is never a final CRM state
Meta Ads MCP limitation: Campaigns optimizing for offsite_conversion.other return "Not available" for lead counts, CPL, CTR, clicks, and landing page views — workaround is exporting directly from Ads Manager with the correct conversion event as the result column
Jira MCP: sprint in openSprints() JQL fails for this account; working alternative is project=GWT AND sprint={sprint_id} using numeric ID directly. cloudId: 68ddbbd2-8c17-4b86-b7cc-384f3a47da52 required. Story points in customfield_10016; sprint metadata in customfield_10020 (filter for state === "active")
Pipedrive API: Use v2 endpoints with cursor-based pagination (next_cursor); API token referenced as {{ $json.token_pipedrive }}; credentials pulled from node [REVOPS] Credenciais; pipeline being queried is pipeline_id=2
Growth philosophy: Upsell and referral generation should be consequences of product usage events (behavioral triggers at Aha Moments), not calendar-based or purely human-driven outreach — reduces sales headcount pressure and creates scalable loops
ClickUp time estimates: Must be in milliseconds; Gerardo's ClickUp user ID is 54917056; "Comercial" list ID is 901325023927


Approach & patterns

Communicates in Brazilian Portuguese; prefers concise, direct deliverables with minimal preamble
Works iteratively: provides brief but precise redirects rather than extensive explanations; delivers multiple options (typically five) rather than single outputs
Prefers simpler architectures when given a choice — consistently pushes back on complex multi-system solutions
For prompts: fixed scripts must be flagged as non-negotiable; copy should avoid em dashes; "slots" → "horários disponíveis"
For daily planning: CW tasks with highest time estimate get morning priority; short non-CW tasks in 12h–13h window; larger non-CW tasks in 14h–15h; pre-defined times are never modified; Google Calendar consulted before scheduling
For LLM selection in production: Claude Sonnet preferred over Opus (unnecessary cost for classification/audit tasks) and Gemini (slower first-token latency, weaker colloquial Brazilian Portuguese performance)
For LinkedIn content: strong opening hooks, short separated lines, platform-appropriate formatting; avoid exact model version names in headlines to prevent sponsored-content appearance


Tools & resources

Automation: n8n (primary workflow platform), GitHub Actions
CRM & Sales: Pipedrive, Kommo (WhatsApp CRM), ClickUp
Data & Storage: Supabase, Google Sheets
Ads: Meta Ads Manager (MCP-enabled secondary account), Google Ads (SW campaigns panel)
Communication: WhatsApp Business API, Slack
Hosting: Vercel (connected to private GitHub repo)
Project tracking: Jira (Atlassian, cloudId: 68ddbbd2-8c17-4b86-b7cc-384f3a47da52)
AI models: Claude (primary for Clara SDR), OpenAI playground (prompt testing)
Key frameworks: BANT (sales qualification), Revenue Architecture / Winning by Design (systems thinking), Sean Ellis's Hacking Growth (product-led growth), LLM-as-Judge (conversation audit)