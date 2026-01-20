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

        const { text } = await req.json();
        
        if (!text) {
            return Response.json({ error: 'Missing text parameter' }, { status: 400 });
        }

        // Generate speech using OpenAI TTS with expressive voice
        const mp3 = await openai.audio.speech.create({
            model: "tts-1-hd", // High quality model
            voice: "nova", // Nova is confident, warm, and expressive - closest to the spec
            input: text,
            speed: 0.92 // Slightly slower for more natural delivery
        });

        // Convert to array buffer
        const buffer = await mp3.arrayBuffer();

        // Return audio file directly
        return new Response(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': buffer.byteLength.toString(),
                'Cache-Control': 'no-cache'
            }
        });
    } catch (error) {
        console.error('Error generating voice:', error);
        return Response.json({ 
            error: error.message,
            details: error.toString()
        }, { status: 500 });
    }
});