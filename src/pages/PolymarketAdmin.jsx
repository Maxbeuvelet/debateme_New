import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, RefreshCw, TrendingUp, Clock, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { User } from "@/entities/User";

export default function PolymarketAdmin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [lastRun, setLastRun] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser?.role !== 'admin') {
        window.location.href = '/';
      }
    } catch (error) {
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const runImport = async () => {
    setImporting(true);
    setStats(null);
    try {
      const response = await base44.functions.invoke('importPolymarkets');
      setStats(response.data);
      setLastRun(new Date().toLocaleString());
    } catch (error) {
      console.error("Import error:", error);
      alert("Import failed: " + (error.response?.data?.error || error.message));
    } finally {
      setImporting(false);
    }
  };

  const clearAllDebates = async () => {
    if (!confirm("Are you sure you want to delete all imported debates? This cannot be undone.")) {
      return;
    }
    
    setClearing(true);
    try {
      const allDebates = await base44.entities.PremadeDebate.list();
      for (const debate of allDebates) {
        await base44.entities.PremadeDebate.delete(debate.id);
      }
      alert(`Successfully deleted ${allDebates.length} debates`);
      setStats(null);
    } catch (error) {
      console.error("Clear error:", error);
      alert("Failed to clear debates: " + error.message);
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">Polymarket Importer</h1>
          <p className="text-slate-300 mt-2">Automated debate generation from prediction markets</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Last Run</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-2xl font-bold text-white">
                  {lastRun || 'Never'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Markets Fetched</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-2xl font-bold text-white">
                  {stats?.stats?.fetched || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Inserted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-2xl font-bold text-white">
                  {stats?.stats?.inserted || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Skipped</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-2xl font-bold text-white">
                  {stats?.stats?.skipped || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Manual Import</CardTitle>
            <CardDescription className="text-slate-400">
              Trigger an immediate import from Polymarket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                onClick={runImport}
                disabled={importing || clearing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Run Import Now
                  </>
                )}
              </Button>
              <Button
                onClick={clearAllDebates}
                disabled={importing || clearing}
                variant="destructive"
              >
                {clearing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Debates
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {stats?.stats?.updated > 0 && (
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Updated Debates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">{stats.stats.updated} debates were updated with fresh data</p>
            </CardContent>
          </Card>
        )}

        {stats?.stats?.skipReasons && stats.stats.skipReasons.length > 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Skip Reasons</CardTitle>
              <CardDescription className="text-slate-400">
                Markets that were filtered out
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {stats.stats.skipReasons.slice(0, 20).map((reason, idx) => (
                  <p key={idx} className="text-sm text-slate-400">{reason}</p>
                ))}
                {stats.stats.skipReasons.length > 20 && (
                  <p className="text-sm text-slate-500 italic">
                    ... and {stats.stats.skipReasons.length - 20} more
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}