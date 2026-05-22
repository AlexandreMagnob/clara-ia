import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\alexa\Desktop\Clara IA\analises\_pipeline\workflow_sdr.json','r',encoding='utf-8-sig') as f:
    wf = json.load(f)

target_names = ['consultar_base_info', 'Embeddings', 'Reranker Cohere', 'AI Agent', 'Think', 'Simple Memory', 'Postgres Chat Memory1']

for node in wf.get('nodes', []):
    if node.get('name') in target_names:
        print(f"\n{'='*60}")
        print(f"NODE: {node['name']}  [{node['type']}]")
        print('='*60)
        params = node.get('parameters', {})
        print(json.dumps(params, indent=2, ensure_ascii=False)[:4000])
