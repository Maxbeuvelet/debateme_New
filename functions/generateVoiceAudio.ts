import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import OpenAI from 'npm:openai@4.73.1';

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

        const { text } = await req.json();

        if (!text) {
            return Response.json({ error: 'Missing text parameter' }, { status: 400 });
        }

        // Generate speech using OpenAI TTS
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "onyx", // Deep, confident male voice - good for debates
            input: text,
            speed: 1.0
        });

        // Convert to array buffer
        const buffer = await mp3.arrayBuffer();

        // Return audio file
        return new Response(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': buffer.byteLength.toString(),
            }
        });

    } catch (error) {
        console.error('Error generating voice:', error);
        return Response.json({ 
            error: error.message || 'Failed to generate voice audio' 
        }, { status: 500 });
    }
});