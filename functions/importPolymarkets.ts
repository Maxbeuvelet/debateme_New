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

    // Fetch markets from Polymarket - using simpler endpoint
    const response = await fetch(
      'https://gamma-api.polymarket.com/markets?limit=100&closed=false',
      { signal: AbortSignal.timeout(10000) }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Polymarket API error ${response.status}: ${errorText}`);
    }

    const markets = await response.json();
    
    // Filter for high-volume markets
    const highVolumeMarkets = markets.filter(m => (m.volume || 0) >= 50000);
    
    // Separate GTA markets and others
    const gtaMarkets = highVolumeMarkets.filter(m => 
      /gta\s*(?:6|vi|six)/i.test(m.question)
    );
    const nonGtaMarkets = highVolumeMarkets.filter(m => 
      !/gta\s*(?:6|vi|six)/i.test(m.question)
    );
    
    // Add only highest volume GTA market (if any)
    const uniqueMarkets = [];
    if (gtaMarkets.length > 0) {
      gtaMarkets.sort((a, b) => (b.volume || 0) - (a.volume || 0));
      uniqueMarkets.push(gtaMarkets[0]);
    }
    
    // Deduplicate non-GTA markets by extracting key entities
    const seenEntities = new Set();
    
    for (const market of nonGtaMarkets) {
      const question = market.question.toLowerCase();
      
      // Extract key entities (brands, names, specific terms)
      const entities = [];
      
      // Common entities to look for
      const patterns = [
        /trump/i,
        /biden/i,
        /bitcoin/i,
        /ethereum/i,
        /tesla/i,
        /ai\b/i,
        /election/i,
        /ukraine/i,
        /russia/i,
        /china/i,
        /nfl|super bowl/i,
        /\b[A-Z][a-z]+ [A-Z][a-z]+\b/, // Proper names like "Donald Trump"
      ];
      
      for (const pattern of patterns) {
        const match = question.match(pattern);
        if (match) {
          entities.push(match[0].toLowerCase().replace(/\s+/g, '_'));
        }
      }
      
      // If no specific entities found, use first meaningful words
      if (entities.length === 0) {
        const cleaned = question
          .replace(/will |won't |does |doesn't |can |can't |should |before |after |by \d{4}/g, '')
          .trim()
          .split(/[?.,\s]+/)
          .filter(w => w.length > 3)
          .slice(0, 2)
          .join('_');
        entities.push(cleaned);
      }
      
      const entityKey = entities.join('_');
      
      if (!seenEntities.has(entityKey)) {
        seenEntities.add(entityKey);
        uniqueMarkets.push(market);
      }
      
      if (uniqueMarkets.length >= 15) break;
    }
    
    const filteredMarkets = uniqueMarkets;
    stats.fetched = filteredMarkets.length || 0;

    // Process each market
    for (const market of filteredMarkets) {
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

      // Auto-categorize based on keywords
      let category = 'politics';
      const title = market.question.toLowerCase();
      if (title.includes('tech') || title.includes('ai') || title.includes('crypto')) {
        category = 'technology';
      } else if (title.includes('climate') || title.includes('environment')) {
        category = 'environment';
      } else if (title.includes('health') || title.includes('medical')) {
        category = 'healthcare';
      } else if (title.includes('economy') || title.includes('market') || title.includes('price')) {
        category = 'economics';
      } else if (title.includes('social') || title.includes('culture')) {
        category = 'social_issues';
      }

      // Simple tags extraction
      const tags = [];
      if (market.tags && Array.isArray(market.tags)) {
        tags.push(...market.tags.slice(0, 3));
      }

      // Generate topic-specific bullets
      const titleLower = debateTitle.toLowerCase();
      let bulletsA = [];
      let bulletsB = [];
      
      // Create contextual bullets based on debate type
      if (titleLower.includes('trump') || titleLower.includes('election')) {
        bulletsA = [
          "Strong polling momentum and historical precedents support this",
          "Key demographic shifts favor this electoral outcome",
          "Campaign strategy and messaging resonating with voters"
        ];
        bulletsB = [
          "Electoral college math presents significant challenges",
          "Recent polling volatility suggests unpredictable results",
          "Historical upsets show predictions can be wrong"
        ];
      } else if (titleLower.includes('bitcoin') || titleLower.includes('crypto') || titleLower.includes('eth')) {
        bulletsA = [
          "Institutional adoption and regulatory clarity driving growth",
          "Technical indicators and market sentiment bullish",
          "Historical price patterns suggest upward momentum"
        ];
        bulletsB = [
          "Regulatory uncertainty could trigger market correction",
          "Macroeconomic headwinds may pressure crypto assets",
          "Historical volatility suggests caution needed"
        ];
      } else if (titleLower.includes('ai') || titleLower.includes('tech')) {
        bulletsA = [
          "Rapid technological advancement accelerating timeline",
          "Major tech companies investing heavily in development",
          "Recent breakthroughs demonstrate feasibility"
        ];
        bulletsB = [
          "Technical challenges remain significant obstacles",
          "Regulatory and ethical concerns may slow progress",
          "Historical tech predictions often overestimate pace"
        ];
      } else if (titleLower.includes('war') || titleLower.includes('conflict') || titleLower.includes('ukraine') || titleLower.includes('russia')) {
        bulletsA = [
          "Current military dynamics favor this outcome",
          "Diplomatic pressure and international support building",
          "Historical conflict patterns suggest this trajectory"
        ];
        bulletsB = [
          "Geopolitical complexity makes predictions unreliable",
          "Multiple stakeholders with conflicting interests involved",
          "Unforeseen events could dramatically shift situation"
        ];
      } else if (titleLower.includes('economy') || titleLower.includes('recession') || titleLower.includes('market')) {
        bulletsA = [
          "Economic indicators and data trends support this view",
          "Federal Reserve policy aligning with this outcome",
          "Market sentiment and expert forecasts pointing here"
        ];
        bulletsB = [
          "Economic predictions historically unreliable",
          "Multiple variables could shift outlook dramatically",
          "Recent data shows mixed signals and uncertainty"
        ];
      } else {
        // Generic but still better than before
        bulletsA = [
          "Available data and trends support this outcome",
          "Expert analysis leans toward this position",
          "Historical patterns suggest this is more likely"
        ];
        bulletsB = [
          "Significant uncertainty factors remain in play",
          "Alternative scenarios are still plausible",
          "Historical precedents show different results possible"
        ];
      }

      const debateContent = {
        category,
        tags,
        bulletsA,
        bulletsB
      };

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