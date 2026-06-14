import React, { useMemo } from "react"
import { Users, FileText, AlertCircle, TrendingUp, Presentation, CheckCircle, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useTheme } from "@/src/components/ThemeProvider"
import { useData } from "@/src/contexts/DataContext"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"

export function Dashboard() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { learners, assessments, recommendations, observations } = useData()
  
  const isDark = theme === "dark" || (theme === "system" && document.documentElement.classList.contains("dark"))
  const textColor = isDark ? "#e2e8f0" : "#64748b"
  const tooltipBg = isDark ? "#0f172a" : "#ffffff"
  const tooltipBorder = isDark ? "#334155" : "#e2e8f0"

  const totalLearners = learners.length;
  // Unique learners receiving interventions
  const activeInterventions = new Set(recommendations.map(r => r.learnerId)).size;
  const needingReview = recommendations.filter(r => r.teacherReviewStatus === "Pending Review").length;
  const improvingCount = learners.filter(l => l.status === "Improving").length;
  const improvingPercentage = totalLearners > 0 ? Math.round((improvingCount / totalLearners) * 100) : 0;

  const supportData = useMemo(() => {
    return [
      { name: 'Low Need', count: learners.filter(l => l.supportNeeds === 'Low Support Need').length },
      { name: 'Moderate Need', count: learners.filter(l => l.supportNeeds === 'Moderate Support Need').length },
      { name: 'High Need', count: learners.filter(l => l.supportNeeds === 'High Support Need').length }
    ];
  }, [learners]);

  const progressData = useMemo(() => {
    // Group learners statuses by grade level
    const grades = Array.from(new Set(learners.map(l => l.gradeLevel))).sort();
    return grades.map(grade => {
      const gradeLearners = learners.filter(l => l.gradeLevel === grade);
      return {
        name: grade,
        improving: gradeLearners.filter(l => l.status === 'Improving').length,
        stable: gradeLearners.filter(l => l.status === 'Stable').length,
        modified: gradeLearners.filter(l => l.status === 'Needs Modified Support').length
      };
    });
  }, [learners]);

  const recentActivities = useMemo(() => {
    const acts: Array<{ text: string, time: string, dateObj: Date, icon: any, color: string }> = [];
    
    assessments.forEach(a => {
      const learner = learners.find(l => l.id === a.learnerId);
      acts.push({
        text: `Assessment added for ${learner?.code || 'Unknown Learner'}`,
        time: format(new Date(a.date), "MMM d, yyyy"),
        dateObj: new Date(a.date),
        icon: FileText,
        color: "text-blue-500"
      });
    });

    recommendations.forEach(r => {
      const learner = learners.find(l => l.id === r.learnerId);
      acts.push({
        text: `Recommendation generated for ${learner?.code || 'Unknown Learner'}`,
        time: format(new Date(r.date), "MMM d, yyyy"),
        dateObj: new Date(r.date),
        icon: Presentation,
        color: "text-purple-500"
      });
    });

    observations.forEach(o => {
      const learner = learners.find(l => l.id === o.learnerId);
      acts.push({
        text: `Observation recorded for ${learner?.code || 'Unknown Learner'}`,
        time: format(new Date(o.date), "MMM d, yyyy"),
        dateObj: new Date(o.date),
        icon: CheckCircle,
        color: "text-green-500"
      });
    });

    return acts.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime()).slice(0, 6);
  }, [assessments, recommendations, observations, learners]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Teacher-centered view of assessments, observations, support classifications, and reviewed interventions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
            <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{totalLearners}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Receiving reading support</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Interventions</CardTitle>
            <Activity className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{activeInterventions}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Currently receiving support</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{needingReview}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Recommendations awaiting teacher action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improving Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{improvingPercentage}%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Of total learners improving</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-blue-200 dark:border-blue-900/60">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Record Assessment</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Enter adapted reading scores across the five thesis domains.</p>
            <button onClick={() => navigate("/assessments/new")} className="mt-3 text-sm font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400">Start assessment</button>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-900/60">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Add Observation</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Capture reading behavior and difficulty indicators for NLP tagging.</p>
            <button onClick={() => navigate("/observations/new")} className="mt-3 text-sm font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400">Record observation</button>
          </CardContent>
        </Card>
        <Card className="border-amber-200 dark:border-amber-900/60">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Review Recommendations</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Approve or revise advisory intervention plans before use.</p>
            <button onClick={() => navigate("/recommendations")} className="mt-3 text-sm font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400">Open review queue</button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Support Need Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supportData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textColor }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor }} />
                <Tooltip 
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6' }}
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: textColor, borderRadius: '8px' }}
                  itemStyle={{ color: textColor }} 
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Progress Monitoring Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textColor }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor }} />
                <Tooltip 
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6' }}
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: textColor, borderRadius: '8px' }}
                  itemStyle={{ color: textColor }}
                />
                <Bar dataKey="improving" stackId="a" fill="#10b981" />
                <Bar dataKey="stable" stackId="a" fill="#6b7280" />
                <Bar dataKey="modified" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mt-6">Recent Activities</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recentActivities.length > 0 ? recentActivities.map((act, i) => (
          <Card key={i} className="h-full">
            <CardContent className="flex min-h-[116px] items-center gap-4 p-5">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 ${act.color}`}>
                <act.icon size={20} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <p className="text-sm font-medium leading-snug text-slate-900 dark:text-slate-50">{act.text}</p>
                <p className="mt-2 text-xs leading-none text-slate-500 dark:text-slate-400">{act.time}</p>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full py-8 text-center text-slate-500">
            No recent activities found.
          </div>
        )}
      </div>
    </div>
  )
}
