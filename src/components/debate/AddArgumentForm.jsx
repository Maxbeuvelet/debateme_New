import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageSquare, X, Send } from "lucide-react";

export default function AddArgumentForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    position: "for",
    content: "",
    author_name: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-white border-slate-200 shadow-lg">
      <CardHeader className="p-6 border-b border-slate-100">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-700" />
            <span className="text-lg font-semibold">Add Your Argument</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="rounded-full hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-900">Your Position</Label>
            <RadioGroup
              value={formData.position}
              onValueChange={(value) => handleInputChange('position', value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="for" id="for" className="border-green-500 text-green-500" />
                <Label htmlFor="for" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Arguing For
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="against" id="against" className="border-red-500 text-red-500" />
                <Label htmlFor="against" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Arguing Against
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="author_name" className="text-sm font-semibold text-slate-900">
              Your Name *
            </Label>
            <Input
              id="author_name"
              value={formData.author_name}
              onChange={(e) => handleInputChange('author_name', e.target.value)}
              placeholder="How should we identify you in this debate?"
              className="border-slate-300 focus:border-slate-500"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="content" className="text-sm font-semibold text-slate-900">
              Your Argument *
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Present your perspective with evidence, reasoning, and clear logic. Be respectful and constructive in your argument..."
              className="min-h-32 border-slate-300 focus:border-slate-500"
              required
            />
            <p className="text-xs text-slate-500">
              Share a thoughtful, well-reasoned argument that contributes to the discussion
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-slate-300 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.content.trim() || !formData.author_name.trim()}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Posting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Post Argument
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}