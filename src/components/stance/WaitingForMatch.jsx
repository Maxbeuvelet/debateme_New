import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { matchDebater } from "@/functions/matchDebater";
import { Lock, Users, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function WaitingForMatch({ stance, debate, participantCounts, onBack }) {
  const navigate = useNavigate();

  const [statusText, setStatusText] = useState("Waiting for opponent");
  const [errorText, setErrorText] = useState("");

  const pollingRef = useRef(false);
  const inFlightRef = useRef(false);
  const intervalRef = useRef(null);

  const goToSession = (sessionId, userName) => {
    navigate(
      createPageUrl(
        `VoiceDebate?id=${sessionId}&user=${encodeURIComponent(userName || "Guest")}`
      )
    );
  };

  const pollOnce = async () => {
    if (!debate?.id) return;
    if (!stance?.id) return;

    const s = stance.status;
    if (s !== "waiting" && s !== "matching") return;

    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      const resp = await matchDebater({ debateId: debate.id, stanceId: stance.id });
      const data = resp?.data;

      if (data?.stanceDeleted) {
        setErrorText("Your queue entry expired. Please rejoin.");
        if (typeof onBack === "function") onBack();
        return;
      }

      if (data?.matched && data?.sessionId) {
        goToSession(data.sessionId, data.userName);
        return;
      }

      setErrorText("");
      setStatusText("Waiting for opponent");
    } catch (err) {
      setErrorText("Having trouble checking… retrying.");
    } finally {
      inFlightRef.current = false;
    }
  };

  useEffect(() => {
    if (!debate?.id) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!stance?.id) {
      setStatusText("Setting up your debate…");
      setErrorText("");
      return;
    }

    pollingRef.current = true;
    setStatusText("Waiting for opponent");
    setErrorText("");

    pollOnce();

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

  const aCount = participantCounts?.position_a ?? 0;
  const bCount = participantCounts?.position_b ?? 0;

  const isPrivate = !!debate?.is_private;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
    >
      {/* subtle gradient glow */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative p-6 sm:p-7">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {/* animated dot */}
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white/70" />
              </span>

              <h2 className="text-xl font-semibold tracking-tight text-white">
                {statusText}
                <span className="text-white/60">…</span>
              </h2>
            </div>

            <p className="text-sm text-white/65">
              Hang tight — as soon as someone joins, we'll drop you into the debate automatically.
            </p>
          </div>

          {isPrivate ? (
            <Badge variant="secondary" className="bg-white/10 text-white border border-white/10">
              <Lock className="mr-1.5 h-3.5 w-3.5" />
              Private
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-white/10 text-white border border-white/10">
              Live
            </Badge>
          )}
        </div>

        {/* Stats row */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
            <Users className="h-4 w-4 text-white/70" />
            <span className="text-sm text-white/70">
              Position A <span className="text-white/90 font-medium">{aCount}</span>
            </span>
            <span className="text-white/30">•</span>
            <span className="text-sm text-white/70">
              Position B <span className="text-white/90 font-medium">{bCount}</span>
            </span>
          </div>

          {/* tiny "syncing" hint (purely cosmetic) */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-1.5">
            <Loader2 className="h-4 w-4 animate-spin text-white/60" />
            <span className="text-sm text-white/60">Syncing</span>
          </div>
        </div>

        {/* Error */}
        {errorText ? (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorText}
          </div>
        ) : null}

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => (typeof onBack === "function" ? onBack() : null)}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Leave queue
          </Button>

          {/* Optional: tiny hint, no action */}
          <span className="text-xs text-white/45">
            Tip: keep this tab open for the fastest match
          </span>
        </div>
      </div>
    </motion.div>
  );
}