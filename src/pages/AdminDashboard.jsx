import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { UserStance } from "@/entities/UserStance";
import { DebateSession } from "@/entities/DebateSession";
import { Debate } from "@/entities/Debate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Activity, 
  Video, 
  Clock, 
  RefreshCw,
  UserCheck,
  TrendingUp
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDebates: 0,
    waitingUsers: 0,
    recentUsers: []
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      
      if (!currentUser || currentUser.role !== 'admin') {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      setIsAuthorized(true);

      // Load all data
      const [users, stances, sessions, debates] = await Promise.all([
        User.list('-updated_date', 500),
        UserStance.list('-updated_date', 200),
        DebateSession.list('-updated_date', 100),
        Debate.list()
      ]);

      // Calculate active debates
      const activeSessions = sessions.filter(s => s.status === 'active');
      
      // Calculate waiting users
      const waitingStances = stances.filter(s => s.status === 'waiting');
      
      // Get recent users (updated in last 30 minutes)
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const recentUsers = users
        .filter(u => new Date(u.updated_date) > thirtyMinutesAgo)
        .slice(0, 20)
        .map(u => {
          // Check if user is in active debate
          const userStance = stances.find(s => s.user_id === u.id);
          const inDebate = userStance && activeSessions.some(sess => 
            sess.participant_a_id === userStance.id || 
            sess.participant_b_id === userStance.id
          );
          
          // Check if user is waiting
          const isWaiting = waitingStances.some(s => s.user_id === u.id);
          
          return {
            ...u,
            status: inDebate ? 'in_debate' : isWaiting ? 'waiting' : 'browsing',
            lastActive: new Date(u.updated_date)
          };
        });

      setStats({
        totalUsers: users.length,
        activeDebates: activeSessions.length,
        waitingUsers: waitingStances.length,
        recentUsers
      });

    } catch (error) {
      console.error("Error loading admin data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_debate':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'browsing':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in_debate':
        return 'In Debate';
      case 'waiting':
        return 'Waiting';
      case 'browsing':
        return 'Browsing';
      default:
        return 'Unknown';
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h1>
          <p className="text-slate-600 mb-6">You need admin access to view this page</p>
          <Button onClick={() => navigate(createPageUrl("Home"))}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Real-time user activity monitoring</p>
          </div>
          <Button 
            onClick={loadData}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Users
              </CardTitle>
              <Users className="w-4 h-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Active Debates
              </CardTitle>
              <Video className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.activeDebates}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Waiting for Match
              </CardTitle>
              <Clock className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.waitingUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Active (30m)
              </CardTitle>
              <Activity className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.recentUsers.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Recent User Activity (Last 30 Minutes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentUsers.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No recent activity</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Username</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Level</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUsers.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm font-medium text-slate-900">
                          {user.username || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(user.status)} text-xs`}
                          >
                            {getStatusLabel(user.status)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          Lvl {user.level || 1}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {formatTimeAgo(user.lastActive)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}