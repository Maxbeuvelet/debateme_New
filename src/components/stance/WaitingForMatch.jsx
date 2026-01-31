import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { matchDebater } from "@/functions/matchDebater";

/**
 * Props expected (based on your usage):
 * - stance: currentUserStance (object or null)
 * - debate: debate object (must include id)
 * - participantCounts: { position_a: number, position_b: number }
 * - onBack: function
 */
export default function WaitingForMatch({ stance, debate, participantCounts, onBack }) {
  const navigate = useNavigate();

  const [statusText, setStatusText] = useState("Waiting for an opponent...");
  const [errorText, setErrorText] = useState("");

  const pollingRef = useRef(false);
  const inFlightRef = useRef(false);
  const intervalRef = useRef(null);

  // Helper: navigate to session
  const goToSession = (sessionId, userName) => {
    navigate(
      createPageUrl(
        `VoiceDebate?id=${sessionId}&user=${encodeURIComponent(userName || "Guest")}`
      )
    );
  };

  // Main polling function
  const pollOnce = async () => {
    if (!debate?.id) return;
    if (!stance?.id) return;

    // Only poll if we're in a waiting-like state
    const s = stance.status;
    if (s !== "waiting" && s !== "matching") return;

    // Prevent overlapping calls
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      const resp = await matchDebater({
        debateId: debate.id,
        stanceId: stance.id,
      });

      const data = resp?.data;

      if (data?.stanceDeleted) {
        // Server says your stance is gone — let parent decide what to do
        setErrorText("Your queue entry expired. Please rejoin the debate.");
        if (typeof onBack === "function") onBack();
        return;
      }

      if (data?.matched && data?.sessionId) {
        goToSession(data.sessionId, data.userName);
        return;
      }

      // Not matched yet — update UI hint
      setErrorText("");
      setStatusText("Waiting for an opponent...");
    } catch (err) {
      // Keep polling, but show a lightweight error
      setErrorText("Having trouble checking for matches… retrying.");
    } finally {
      inFlightRef.current = false;
    }
  };

  // Start/stop polling when stance/debate changes
  useEffect(() => {
    // If stance isn't ready yet (private debate creator sometimes creates stance async)
    if (!debate?.id) return;

    // Stop previous interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // If no stance, don't poll—just show setup state
    if (!stance?.id) {
      setStatusText("Setting up your debate…");
      setErrorText("");
      return;
    }

    // Begin polling
    pollingRef.current = true;
    setStatusText("Waiting for an opponent...");
    setErrorText("");

    // Poll immediately once (so we don't wait 2s)
    pollOnce();

    // Then poll on an interval
    intervalRef.current = setInterval(() => {
      if (!pollingRef.current) return;
      pollOnce();
    }, 2000);

    return () => {
      pollingRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      inFlightRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debate?.id, stance?.id, stance?.status]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold">{statusText}</div>
          <div className="text-white/70 mt-2">
            Position A: {participantCounts?.position_a ?? 0} waiting • Position B:{" "}
            {participantCounts?.position_b ?? 0} waiting
          </div>

          {errorText ? (
            <div className="text-sm text-red-300 mt-3">{errorText}</div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            onClick={() => pollOnce()}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            Check now
          </Button>

          <Button
            variant="ghost"
            onClick={() => (typeof onBack === "function" ? onBack() : null)}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            Leave queue
          </Button>
        </div>
      </div>
    </div>
  );
}