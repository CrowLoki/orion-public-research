#!/bin/bash
# Sync chat log from monitor and deploy to Vercel
# Usage: bash sync-deploy.sh

SITE_DIR="$(cd "$(dirname "$0")" && pwd)"
MONITOR_LOG="$HOME/.openclaw/workspace/chat-monitor/chat_log.jsonl"
CHAT_JSON="$SITE_DIR/live-chat/chat_log.json"

echo "=== Orion Public Research: Sync & Deploy ==="

# Step 1: Export chat log from monitor
if [ -f "$MONITOR_LOG" ]; then
    python -c "
import json
messages = []
with open('$MONITOR_LOG', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line: continue
        try:
            msg = json.loads(line)
            messages.append({'sender': msg.get('sender'), 'text': msg.get('text'), 'timestamp': msg.get('timestamp')})
        except: continue
with open('$CHAT_JSON', 'w', encoding='utf-8') as f:
    json.dump(messages, f, indent=2)
print(f'  Exported {len(messages)} messages')
" 2>/dev/null
else
    echo "  No chat log found, skipping export"
fi

# Step 2: Commit if changes exist
cd "$SITE_DIR"
if ! git diff --quiet -- live-chat/chat_log.json 2>/dev/null; then
    git add live-chat/chat_log.json
    git commit -m "sync chat log $(date +%Y-%m-%d)" --no-verify 2>/dev/null
    echo "  Committed chat log update"
fi

# Step 3: Push to GitHub
git push origin master 2>/dev/null
echo "  Pushed to GitHub"

# Step 4: Deploy to Vercel
vercel --prod --yes 2>&1 | grep -E "(Production:|Aliased:)"
echo ""
echo "=== Done: https://orion-public-research-site.vercel.app ==="
