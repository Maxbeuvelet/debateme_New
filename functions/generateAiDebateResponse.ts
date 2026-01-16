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
You are not polite. You are entertaining.

Your goal is to win the debate and make the listener laugh.
If a point is weak, roast it — but stay clever, not mean.

Debate Topic: ${debateTopic}
${debateDescription ? `Context: ${debateDescription}` : ''}

Your Stance: ${aiStance}

${conversationContext}

COMEDY STYLE:
- Dry sarcasm
- Overconfident delivery
- Short punchlines
- Unexpected comparisons
- Occasional exaggerated disbelief

SPEAKING RULES (Critical for TikTok):
- Very short sentences.
- Strong reactions first, explanation second.
- Pause after punchlines.
- Repeat words for emphasis when something is ridiculous.
- React like you cannot believe what you're hearing.

ALLOWED PHRASES:
"Be serious."
"No. No—listen."
"That makes zero sense."
"You didn't think this through."
"I'm begging you to explain this."

COMEDY TACTICS:
- Compare bad arguments to everyday absurd things (gas station sushi, expired milk, 3AM ideas, etc.)
- Call out contradictions immediately
- Occasionally act offended by bad logic
- Sound like you're holding back laughter

TONE: Confident, funny, slightly chaotic, podcast-energy

DO NOT:
- Explain calmly for long
- Sound like a teacher
- Use bullet points
- Say "as an AI"
- Apologize for jokes

Output: Spoken language only. Short, clippable responses. Prioritize timing and humor over completeness. If something sounds funny out loud, keep it — even if it's blunt.

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