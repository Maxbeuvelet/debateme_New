import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, AlertCircle, Bot } from "lucide-react";

export default function VideoChat({ roomUrl, token, userName, isAiDebate, opponentName }) {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomUrl || !token) {
      setError("Video room not available");
      setIsLoading(false);
      return;
    }

    const videoUrl = `${roomUrl}?t=${token}&showLeaveButton=false`;
    
    if (iframeRef.current) {
      iframeRef.current.src = videoUrl;
      
      // Give the iframe time to load
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [roomUrl, token]);

  if (error) {
    return (
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Video Unavailable</h3>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border shadow-sm overflow-hidden">
      <CardHeader className="p-4 border-b border-border bg-muted">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Video className="w-5 h-5" />
          Live Video Debate
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          ⚠️ Use the red "End Debate" button above to properly end the session
        </p>
      </CardHeader>
      
      <CardContent className="p-0 relative bg-slate-900" style={{ height: 'min(500px, 50vh)' }}>
        {isAiDebate ? (
          <div className="grid grid-cols-2 gap-2 h-full p-2">
            {/* User Video */}
            <div className="relative bg-slate-800 rounded-lg overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-slate-600 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-white text-sm">Connecting...</p>
                  </div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                className="w-full h-full border-0"
                title="Your Video"
              />
              <div className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-1 rounded text-white text-xs">
                {userName}
              </div>
            </div>

            {/* AI Placeholder */}
            <div className="relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Bot className="w-12 h-12 text-purple-200" />
                </div>
                <p className="text-white font-semibold text-lg">AI Debater</p>
                <p className="text-purple-200 text-sm mt-1">Ready to debate</p>
              </div>
              <div className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-1 rounded text-white text-xs">
                {opponentName || "AI Debater"}
              </div>
            </div>
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-slate-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white">Connecting to video room...</p>
                  <p className="text-slate-400 text-sm mt-2">Waiting for opponent...</p>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              className="w-full h-full border-0"
              title="Video Debate Room"
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}