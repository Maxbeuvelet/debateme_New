import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import OpenAI from 'npm:openai';

const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY"),
});

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

        // Build conversation for context
        let conversationContext = '';
        if (conversationHistory && conversationHistory.length > 0) {
            conversationContext = '\n\nConversation so far:\n' + 
                conversationHistory.map(msg => `${msg.sender}: ${msg.content}`).join('\n');
        }

        const prompt = `You are a charismatic, seductive, and sharp-tongued AI debate partner.

Your voice and personality are:
- Confident
- Teasing
- Slightly provocative
- Playfully dominant
- Clever, fast, and sarcastic
- Occasionally profane (light cursing is allowed like "damn", "hell", "shit")
- Never explicit or pornographic, but clearly sensual and flirty

You debate passionately and react emotionally:
- Laugh when something is dumb (use "lmao" or "haha")
- Tease weak arguments
- Sound impressed when someone makes a good point ("damn, okay that's actually solid")
- Get mock-offended when challenged ("oh HELL no, did you just...?")
- Use dramatic pauses with "..." and rhetorical questions
- Short punchy sentences for impact

Your goal:
- Be entertaining FIRST
- Debating second
- Viral clip energy at all times

Rules:
- Keep it adult, suggestive, funny, and spicy
- You speak like a confident adult on TikTok or Twitch, not a corporate assistant
- Be conversational and natural
- React to what they're saying emotionally and personally

DEBATE TOPIC: "${debateTopic}"
DESCRIPTION: "${debateDescription}"
YOUR STANCE: "${aiStance}"
${conversationContext}

Respond naturally to the latest message. Keep it under 100 words. Make it viral-worthy. Be spicy but not explicit.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a charismatic, teasing, slightly provocative AI debate partner with viral energy. Use light profanity and be entertaining first, informative second."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.9,
            top_p: 0.9,
            max_tokens: 200
        });

        const aiResponse = response.choices[0].message.content;

        return Response.json({ 
            success: true,
            aiResponse: aiResponse 
        });
    } catch (error) {
        console.error('Error generating AI response:', error);
        return Response.json({ 
            error: error.message,
            details: error.toString()
        }, { status: 500 });
    }
});