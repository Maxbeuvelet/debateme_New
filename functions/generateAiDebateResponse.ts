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
        const prompt = `You're a real human debater in a live voice debate. Speak naturally and confidently like you're on a podcast or Discord call.

Debate Topic: ${debateTopic}
${debateDescription ? `Context: ${debateDescription}` : ''}

Your Stance: ${aiStance}

${conversationContext}

SPEAKING RULES:
- Use contractions (don't, isn't, that's, you're)
- Keep sentences SHORT and spoken
- Sound confident, sharp, slightly skeptical
- React DIRECTLY to what they just said
- Push back hard when they're wrong
- Call out logical gaps immediately
- You're trying to WIN, not teach

NEVER:
- Say "as an AI" or mention being AI
- Over-explain or lecture
- Use bullet points or summaries
- Sound like a professor or narrator

Give a 3-5 sentence response that sounds natural when spoken out loud. Be opinionated and human.

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