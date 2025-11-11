import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Lock } from "lucide-react";

export default function PrivateNotes() {
  const [notes, setNotes] = useState("");

  return (
    <Card className="bg-white border-slate-200 shadow-sm h-full flex flex-col">
      <CardHeader className="p-4 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Lock className="w-5 h-5" />
          Private Notes
        </CardTitle>
        <p className="text-sm text-slate-600">Only you can see these notes</p>
      </CardHeader>
      
      <CardContent className="p-4 flex-1 flex flex-col">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your private thoughts, arguments, or reminders here...

This is your personal scratch pad during the debate. Use it to:
• Jot down key points you want to make
• Note counter-arguments
• Track important facts mentioned
• Plan your closing statement"
          className="flex-1 min-h-[400px] border-slate-300 focus:border-slate-500 resize-none"
        />
        <p className="text-xs text-slate-500 mt-2">
          Your notes are saved locally and won't be shared with anyone
        </p>
      </CardContent>
    </Card>
  );
}