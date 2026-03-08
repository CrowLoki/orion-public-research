#!/bin/bash
# Deploy Orion Public Research site to Vercel
cd "$(dirname "$0")"
echo "Deploying to Vercel..."
vercel --prod --yes 2>&1
echo ""
echo "Site: https://orion-public-research-site.vercel.app"
