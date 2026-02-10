import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { User } from "@/entities/User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Users } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function JoinDebate() {
  const navigate = useNavigate();
  const [debate, setDebate] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const debateId = urlParams.get('id');
      const isPremade = urlParams.get('premade') === 'true';
      
      if (!debateId) {
        navigate(createPageUrl("Categories"));
        return;
      }

      const currentUser = await User.me();
      if (!currentUser) {
        await base44.auth.redirectToLogin(window.location.href);
        return;
      }
      setUser(currentUser);

      // Load debate from either PremadeDebate or Debate entity
      let debateData;
      if (isPremade) {
        debateData = await base44.entities.PremadeDebate.get(debateId);
        // Convert to standard format
        debateData = {
          ...debateData,
          position_a: debateData.positionA,
          position_b: debateData.positionB,
          description: `Trade volume: $${(debateData.marketVolume / 1000).toFixed(0)}K`
        };
      } else {
        debateData = await base44.entities.Debate.get(debateId);
      }
      
      setDebate(debateData);
    } catch (error) {
      console.error("Error loading debate:", error);
      alert("Failed to load debate");
      navigate(createPageUrl("Categories"));
    } finally {
      setLoading(false);
    }
  };

  const joinPosition = async (position) => {
    if (!user || !debate) return;

    setJoining(true);
    try {
      // Create user stance
      const stance = await base44.entities.UserStance.create({
        debate_id: debate.id,
        user_id: user.id,
        user_name: user.username || user.email,
        position: position
      });

      // Start matching
      const matchResponse = await base44.functions.invoke('matchDebater', {
        debateId: debate.id,
        stanceId: stance.id
      });

      if (matchResponse.data.matched) {
        // Navigate to debate room
        navigate(createPageUrl("DebateRoom") + `?sessionId=${matchResponse.data.sessionId}`);
      } else {
        // Navigate to waiting room
        navigate(createPageUrl("WaitingRoom") + `?stanceId=${stance.id}`);
      }
    } catch (error) {
      console.error("Error joining debate:", error);
      alert("Failed to join debate: " + error.message);
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!debate) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Categories"))}
            className="mb-4 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          <h1 className="text-3xl font-bold text-white">{debate.title}</h1>
          {debate.description && (
            <p className="text-slate-300 mt-2">{debate.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Choose Your Position</h2>
          <p className="text-slate-400">Select which side of the debate you want to argue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-600">Position A</Badge>
                <Users className="w-5 h-5 text-slate-400" />
              </div>
              <CardTitle className="text-2xl text-white mt-4">
                {debate.position_a}
              </CardTitle>
              {debate.bulletsA && debate.bulletsA.length > 0 && (
                <CardDescription className="mt-4">
                  <ul className="space-y-2 text-slate-300">
                    {debate.bulletsA.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => joinPosition("position_a")}
                disabled={joining}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {joining ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Argue For This"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-red-500 transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className="bg-red-600">Position B</Badge>
                <Users className="w-5 h-5 text-slate-400" />
              </div>
              <CardTitle className="text-2xl text-white mt-4">
                {debate.position_b}
              </CardTitle>
              {debate.bulletsB && debate.bulletsB.length > 0 && (
                <CardDescription className="mt-4">
                  <ul className="space-y-2 text-slate-300">
                    {debate.bulletsB.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => joinPosition("position_b")}
                disabled={joining}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {joining ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Argue Against This"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}