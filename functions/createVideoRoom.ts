import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        const { sessionId, userName } = await req.json();
        
        if (!sessionId || !userName) {
            return Response.json({ 
                error: 'Missing required parameters: sessionId and userName' 
            }, { status: 400 });
        }

        // Verify the session exists
        const sessions = await base44.asServiceRole.entities.DebateSession.list();
        const session = sessions.find(s => s.id === sessionId);
        
        if (!session) {
            return Response.json({ 
                error: 'Session not found' 
            }, { status: 404 });
        }

        const DAILY_API_KEY = Deno.env.get("DAILY_API_KEY");
        
        if (!DAILY_API_KEY) {
            return Response.json({ 
                error: 'Daily.co API key not configured' 
            }, { status: 500 });
        }

        // Create a consistent room name for this debate session
        const roomName = `debate-${sessionId}`;
        
        let roomUrl;
        
        // Check if room already exists
        try {
            const checkResponse = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${DAILY_API_KEY}`
                }
            });
            
            if (checkResponse.ok) {
                // Room exists, use it
                const existingRoom = await checkResponse.json();
                roomUrl = existingRoom.url;
                console.log(`Using existing room: ${roomUrl}`);
            } else if (checkResponse.status === 404) {
                // Room doesn't exist, create it
                console.log(`Creating new room: ${roomName}`);
                const createResponse = await fetch('https://api.daily.co/v1/rooms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${DAILY_API_KEY}`
                    },
                    body: JSON.stringify({
                        name: roomName,
                        privacy: 'private',
                        properties: {
                            max_participants: 2,
                            enable_chat: false,
                            enable_screenshare: false,
                            enable_recording: false,
                            start_video_off: false,
                            start_audio_off: false,
                            enable_prejoin_ui: false,
                            enable_network_ui: false,
                            enable_people_ui: false,
                            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3) // 3 hour expiry
                        }
                    })
                });
                
                if (!createResponse.ok) {
                    const errorText = await createResponse.text();
                    throw new Error(`Failed to create room: ${errorText}`);
                }
                
                const newRoom = await createResponse.json();
                roomUrl = newRoom.url;
                console.log(`Created new room: ${roomUrl}`);
            } else {
                const errorText = await checkResponse.text();
                throw new Error(`Failed to check room: ${errorText}`);
            }
        } catch (error) {
            console.error("Error with Daily room:", error);
            return Response.json({ 
                error: `Failed to setup video room: ${error.message}` 
            }, { status: 500 });
        }

        // Generate a meeting token for this specific user
        console.log(`Generating token for user: ${userName}`);
        const tokenResponse = await fetch('https://api.daily.co/v1/meeting-tokens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DAILY_API_KEY}`
            },
            body: JSON.stringify({
                properties: {
                    room_name: roomName,
                    user_name: userName,
                    is_owner: false,
                    enable_screenshare: false,
                    start_video_off: false,
                    start_audio_off: false,
                    enable_prejoin_ui: false,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3) // 3 hour expiry
                }
            })
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            throw new Error(`Failed to create token: ${errorText}`);
        }

        const tokenData = await tokenResponse.json();
        console.log(`Token created for ${userName}`);

        return Response.json({
            roomUrl: roomUrl,
            token: tokenData.token
        });
        
    } catch (error) {
        console.error("Error in createVideoRoom:", error);
        return Response.json({ 
            error: error.message 
        }, { status: 500 });
    }
});