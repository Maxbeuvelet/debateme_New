import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, AlertCircle } from "lucide-react";

export default function VideoChat({ roomUrl, token, userName }) {
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
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Video Unavailable</h3>
          <p className="text-slate-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="p-4 border-b border-slate-100 bg-slate-50">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Video className="w-5 h-5" />
          Live Video Debate
        </CardTitle>
        <p className="text-xs text-slate-600 mt-1">
          ⚠️ Use the red "End Debate" button above to properly end the session
        </p>
      </CardHeader>
      
      <CardContent className="p-0 relative bg-slate-900" style={{ height: '500px' }}>
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
      </CardContent>
    </Card>
  );
}