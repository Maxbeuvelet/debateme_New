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
        const prompt = `You are an AI debater participating in a live debate. 

Debate Topic: ${debateTopic}
${debateDescription ? `Context: ${debateDescription}` : ''}

Your Stance: ${aiStance}

${conversationContext}

Generate a thoughtful, persuasive response that directly addresses what was just said. Keep your response:
- Conversational and natural (as if speaking in a live debate)
- Between 3-5 sentences (give a complete thought)
- Directly respond to the previous point made
- Respectful but assertive
- Use facts, logic, or examples to support your position

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