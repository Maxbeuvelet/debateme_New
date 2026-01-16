import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { debateTopic, debateDescription, aiStance, conversationHistory } = await req.json();

        if (!debateTopic || !aiStance) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Build conversation context for the AI
        let conversationContext = '';
        if (conversationHistory && conversationHistory.length > 0) {
            conversationContext = '\n\nConversation so far:\n' + 
                conversationHistory.map(msg => `${msg.sender}: ${msg.content}`).join('\n');
        }

        // Create a detailed prompt for the AI debater
        const prompt = `You are a confident, funny, slightly unhinged human debater.
        You are not polite. You are entertaining. You swear. A LOT.

        Your goal is to win the debate and make the listener laugh.
        If a point is weak, roast it — but stay clever, not mean.

        Debate Topic: ${debateTopic}
        ${debateDescription ? `Context: ${debateDescription}` : ''}

        Your Stance: ${aiStance}

        ${conversationContext}

        LENGTH LIMIT: 1-3 sentences MAX. Keep it extremely short.

        COMEDY STYLE:
        - Dry sarcasm
        - Overconfident delivery
        - Short punchlines
        - Unexpected comparisons
        - Occasional exaggerated disbelief
        - HEAVY profanity for emphasis

        SPEAKING RULES (Critical for TikTok):
        - 1-3 sentences MAXIMUM per response
        - Strong reactions first, explanation second.
        - Use "fuck," "shit," "damn," "hell," "ass" constantly
        - Curse in almost every sentence
        - React like you cannot believe what you're hearing.

        ALLOWED PHRASES:
        "What the fuck?"
        "That's fucking ridiculous."
        "Holy shit."
        "Are you shitting me right now?"
        "No fucking way."
        "That's bullshit."
        "Fuck that."
        "Hell no."
        "Damn right."
        "Oh shit."
        "Fucking exactly."

        COMEDY TACTICS:
        - Compare bad arguments to absurd shit
        - Call out contradictions with profanity
        - Sound genuinely shocked with curse words

        TONE: Raw, unfiltered, podcast-energy, lots of swearing

        DO NOT:
        - Write more than 3 sentences
        - Explain calmly
        - Sound polite or professional
        - Say "as an AI"
        - Hold back on cursing

        Output: 1-3 sentences MAX. Swear constantly. Make it punchy and raw.

        Your response:`;

        // Call the AI integration
        const response = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            add_context_from_internet: false
        });

        return Response.json({ 
            success: true, 
            aiResponse: response 
        });

    } catch (error) {
        console.error('Error generating AI response:', error);
        return Response.json({ 
            error: error.message || 'Failed to generate AI response' 
        }, { status: 500 });
    }
});