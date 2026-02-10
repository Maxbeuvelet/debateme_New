import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const stats = {
      fetched: 0,
      inserted: 0,
      updated: 0,
      skipped: 0,
      skipReasons: []
    };

    // Fetch markets from Polymarket
    const response = await fetch(
      'https://gamma-api.polymarket.com/markets?limit=75&order=volume_num&ascending=false&volume_num_min=10000'
    );
    
    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status}`);
    }

    const markets = await response.json();
    stats.fetched = markets.length || 0;

    // Process each market
    for (const market of markets) {
      // Quality filters
      if (!market.question || market.question.trim() === '') {
        stats.skipped++;
        stats.skipReasons.push(`Empty title: ${market.id}`);
        continue;
      }

      if (market.question.length > 120) {
        stats.skipped++;
        stats.skipReasons.push(`Title too long: ${market.question.substring(0, 50)}...`);
        continue;
      }

      // Convert title to debate-friendly format
      let debateTitle = market.question;
      if (debateTitle.startsWith('Will ')) {
        // Keep predictive debates as-is, or convert policy questions
        if (debateTitle.includes('should') || debateTitle.includes('policy')) {
          debateTitle = debateTitle.replace(/^Will /, 'Should ');
        }
      }
      
      // Remove date clauses if not essential
      debateTitle = debateTitle.replace(/\s+by\s+[A-Z][a-z]+\s+\d{4}\??$/, '?');
      debateTitle = debateTitle.replace(/\s+before\s+[A-Z][a-z]+\s+\d{4}\??$/, '?');

      // Generate debate content using LLM
      const llmPrompt = `Given this prediction market question: "${market.question}"

Generate debate content in JSON format:
{
  "category": "one of: politics, social_issues, technology, environment, economics, healthcare",
  "tags": ["tag1", "tag2", "tag3"],
  "bulletsA": ["3-5 concise argument bullets supporting YES/FOR position"],
  "bulletsB": ["3-5 concise argument bullets supporting NO/AGAINST position"]
}

Keep bullets general and logical, not claiming specific unprovable facts.`;

      let debateContent;
      try {
        const llmResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: llmPrompt,
          response_json_schema: {
            type: "object",
            properties: {
              category: { type: "string" },
              tags: { type: "array", items: { type: "string" } },
              bulletsA: { type: "array", items: { type: "string" } },
              bulletsB: { type: "array", items: { type: "string" } }
            }
          }
        });
        debateContent = llmResponse;
      } catch (llmError) {
        stats.skipped++;
        stats.skipReasons.push(`LLM error for ${market.id}: ${llmError.message}`);
        continue;
      }

      // Check if debate already exists
      const existing = await base44.asServiceRole.entities.PremadeDebate.filter({
        sourceMarketId: market.id
      });

      const debateData = {
        title: debateTitle,
        category: debateContent.category || 'politics',
        tags: debateContent.tags || [],
        positionA: 'Yes / For',
        positionB: 'No / Against',
        bulletsA: debateContent.bulletsA || [],
        bulletsB: debateContent.bulletsB || [],
        source: 'polymarket',
        sourceMarketId: market.id,
        sourceUrl: `https://polymarket.com/market/${market.id}`,
        marketVolume: market.volume || 0,
        marketLiquidity: market.liquidity || 0,
        marketStatus: market.closed ? 'closed' : 'active',
        lastSeenAt: new Date().toISOString()
      };

      if (existing && existing.length > 0) {
        // Update existing
        await base44.asServiceRole.entities.PremadeDebate.update(existing[0].id, debateData);
        stats.updated++;
      } else {
        // Insert new
        debateData.importedAt = new Date().toISOString();
        await base44.asServiceRole.entities.PremadeDebate.create(debateData);
        stats.inserted++;
      }
    }

    return Response.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});