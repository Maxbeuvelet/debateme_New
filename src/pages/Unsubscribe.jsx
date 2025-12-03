import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User } from "@/entities/User";
import { CheckCircle, Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Unsubscribe() {
  const navigate = useNavigate();
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        if (currentUser?.unsubscribed) {
          setIsUnsubscribed(true);
        }
      } catch (error) {
        // User not logged in
      }
    };
    loadUser();
  }, []);

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      await User.updateMyUserData({ unsubscribed: true });
      setIsUnsubscribed(true);
    } catch (error) {
      console.error("Error unsubscribing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        {isUnsubscribed ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">You've Been Unsubscribed</h1>
            <p className="text-slate-600 mb-6">
              You will no longer receive promotional emails from DebateMe. 
              You'll still receive important account-related notifications.
            </p>
            <Button
              onClick={() => navigate(createPageUrl("Home"))}
              className="bg-slate-900 hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-slate-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Unsubscribe from Emails</h1>
            <p className="text-slate-600 mb-6">
              Are you sure you want to unsubscribe from promotional emails? 
              You'll miss out on updates about new features and debates.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleUnsubscribe}
                disabled={isLoading}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                {isLoading ? "Processing..." : "Yes, Unsubscribe Me"}
              </Button>
              <Button
                onClick={() => navigate(createPageUrl("Home"))}
                className="bg-slate-900 hover:bg-slate-800"
              >
                No, Keep Me Subscribed
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}