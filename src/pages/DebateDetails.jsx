import React, { useState, useEffect } from "react";
import { Debate, Argument } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

import DebateHeader from "../components/debate/DebateHeader";
import ArgumentsList from "../components/debate/ArgumentsList";
import AddArgumentForm from "../components/debate/AddArgumentForm";

export default function DebateDetails() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const debateId = urlParams.get('id');
  
  const [debate, setDebate] = useState(null);
  const [debateArguments, setDebateArguments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (debateId) {
      loadDebateData();
    }
  }, [debateId]);

  const loadDebateData = async () => {
    setIsLoading(true);
    try {
      const [debateData, argumentsData] = await Promise.all([
        Debate.list().then(debates => debates.find(d => d.id === debateId)),
        Argument.filter({ debate_id: debateId }, "-created_date")
      ]);
      setDebate(debateData);
      setDebateArguments(argumentsData);
    } catch (error) {
      console.error("Error loading debate:", error);
    }
    setIsLoading(false);
  };

  const handleAddArgument = async (argumentData) => {
    await Argument.create({ ...argumentData, debate_id: debateId });
    loadDebateData();
    setShowAddForm(false);
  };

  if (!debateId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Debate not found</h1>
          <Button onClick={() => navigate(createPageUrl("Home"))}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("Home"))}
              className="rounded-full border-slate-300 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Back to Debates
              </h1>
            </div>
          </div>

          {debate && (
            <DebateHeader 
              debate={debate}
              argumentsCount={debateArguments.length}
            />
          )}

          <div className="grid lg:grid-cols-3 gap-8 mt-12">
            <div className="lg:col-span-2">
              <ArgumentsList 
                debateArguments={debateArguments}
                isLoading={isLoading}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {!showAddForm ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Join the Discussion
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Share your perspective on this debate
                    </p>
                    <Button 
                      onClick={() => setShowAddForm(true)}
                      className="w-full bg-slate-900 hover:bg-slate-800"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Your Argument
                    </Button>
                  </div>
                ) : (
                  <AddArgumentForm 
                    onSubmit={handleAddArgument}
                    onCancel={() => setShowAddForm(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}