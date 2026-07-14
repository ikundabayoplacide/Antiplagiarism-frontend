import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate, FaBookOpen, FaFileShield, FaTriangleExclamation,
  FaArrowTrendUp, FaArrowTrendDown,
} from "react-icons/fa6";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiGetLecturerScans, apiGetLecturerStudents, type ApiScan, type ApiUser } from "@/lib/api";
import { safeFormat } from "@/lib/utils";

const getLevel = (p: number) => p <= 20 ? "Low" : p <= 49 ? "Medium" : "High";
const levelBadge = (p: number) => {
  if (p <= 20) return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold rounded-lg">Low</Badge>;
  if (p <= 49) return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-semibold rounded-lg">Medium</Badge>;
  return <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 font-semibold rounded-lg animate-pulse">High</Badge>;
};

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

const LecturerDashboardPage = () => {
  const [scans, setScans] = useState<ApiScan[]>([]);
  const [students, setStudents] = useState<ApiUser[]>([]);
  const [viewScan, setViewScan] = useState<ApiScan | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiGetLecturerScans().then(setScans).catch(() => {});
    apiGetLecturerStudents().then(setStudents).catch(() => {});
  }, []);

  const highAlerts = scans.filter((s) => s.plagiarismPercent >= 50);
  const recentScans = scans.slice(0, 4);
  const topScans = [...scans].sort((a, b) => b.plagiarismPercent - a.plagiarismPercent).slice(0, 4);
  const avgSimilarity = scans.length ? Math.round(scans.reduce((s, r) => s + r.plagiarismPercent, 0) / scans.length) : 0;

  const low = scans.filter((s) => s.plagiarismPercent <= 20).length;
  const medium = scans.filter((s) => s.plagiarismPercent > 20 && s.plagiarismPercent <= 49).length;
  const high = scans.filter((s) => s.plagiarismPercent >= 50).length;
  const pieData = [
    { name: "Low (0–20%)", value: low, color: COLORS[0] },
    { name: "Medium (21–49%)", value: medium, color: COLORS[1] },
    { name: "High (50%+)", value: high, color: COLORS[2] },
  ];

  // Build monthly submissions from real scan data
  const monthlyMap: Record<string, number> = {};
  scans.forEach((s) => {
    if (!s.createdAt) return;
    const d = new Date(s.createdAt);
    if (isNaN(d.getTime())) return;
    const m = safeFormat(s.createdAt, "MMM");
    monthlyMap[m] = (monthlyMap[m] ?? 0) + 1;
  });
  const monthlyData = Object.entries(monthlyMap).map(([month, submissions]) => ({ month, submissions }));

  return (
    <div className="space-y-8 pb-10">
      {/* Greeting Banner */}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Supervised Students", value: students.length, icon: FaUserGraduate, color: "blue", to: "/lecturer/students" },
          { label: "Submitted Projects", value: scans.length, icon: FaBookOpen, color: "indigo", to: "/lecturer/projects" },
          { label: "Reports Generated", value: scans.length, icon: FaFileShield, color: "purple", to: "/lecturer/reports" },
          { label: "High Similarity", value: highAlerts.length, icon: FaTriangleExclamation, color: "rose", to: "/lecturer/alerts" },
        ].map(({ label, value, icon: Icon, color, to }) => (
          <Card key={label} onClick={() => navigate(to)} className="border-border/60 shadow-sm rounded-2xl overflow-hidden relative group transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
            <div className={`absolute inset-x-0 bottom-0 h-1 bg-${color}-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{label}</CardTitle>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${color}-500/10 text-${color}-600`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-extrabold text-foreground">{value}</div>
              <div className={`flex items-center gap-1 text-xs font-semibold text-${color === "rose" ? "rose" : "emerald"}-600`}>
                {color === "rose" ? <FaArrowTrendDown className="h-3 w-3" /> : <FaArrowTrendUp className="h-3 w-3" />}
                <span>Avg similarity: {avgSimilarity}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* High Alerts */}
      {highAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FaTriangleExclamation className="h-5 w-5 text-rose-500 animate-bounce" />
            <h3 className="font-heading text-lg font-bold text-foreground">Critical High Similarity Alerts</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {highAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 shadow-xs transition-shadow hover:shadow-sm">
                <div className="rounded-xl bg-rose-500/10 p-2.5 text-rose-600 shrink-0">
                  <FaTriangleExclamation className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-sm font-extrabold text-foreground truncate">{alert.fileName}</span>
                    <Badge variant="outline" className="bg-rose-500/20 text-rose-700 font-bold shrink-0">{alert.plagiarismPercent}% similarity</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.matchedSections.length} matched sections</p>
                  <Button variant="link" size="sm" className="h-auto p-0 text-rose-600 font-bold hover:text-rose-700" onClick={() => setViewScan(alert)}>
                    Investigate Matches
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base font-bold">Monthly Submissions</CardTitle>
            <CardDescription className="text-xs">Submissions tracked over active months</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(37,99,235)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="rgb(37,99,235)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="submissions" stroke="rgb(37,99,235)" strokeWidth={2.5} fillOpacity={1} fill="url(#subGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base font-bold">Plagiarism Distribution</CardTitle>
            <CardDescription className="text-xs">Similarity level breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] w-full flex items-center justify-center pt-4">
            <div className="relative w-full h-full">
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute bottom-0 flex justify-center gap-4 w-full text-[10px] font-semibold text-muted-foreground">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span>{d.name.split(" ")[0]} ({d.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base font-bold">Similarity by Document</CardTitle>
            <CardDescription className="text-xs">Plagiarism % per recent scan</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scans.slice(0, 6).map((s) => ({ name: s.fileName.slice(0, 12), pct: s.plagiarismPercent }))} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} unit="%" />
                <Tooltip />
                <Bar dataKey="pct" fill="rgb(124,58,237)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/10">
            <div>
              <CardTitle className="font-heading text-base font-bold">Recent Submissions</CardTitle>
              <CardDescription className="text-xs">Lately uploaded documents</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6 text-xs font-bold">File</TableHead>
                  <TableHead className="text-xs font-bold">Date</TableHead>
                  <TableHead className="text-xs font-bold">Similarity</TableHead>
                  <TableHead className="text-xs font-bold">Status</TableHead>
                  <TableHead className="text-xs font-bold text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentScans.map((s) => (
                  <TableRow key={s.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6 max-w-[150px] truncate font-semibold text-xs">{s.fileName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{safeFormat(s.createdAt)}</TableCell>
                    <TableCell className="font-bold text-xs">{s.plagiarismPercent}%</TableCell>
                    <TableCell>{levelBadge(s.plagiarismPercent)}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs px-2.5" onClick={() => setViewScan(s)}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/10">
            <div>
              <CardTitle className="font-heading text-base font-bold">Top Plagiarism Reports</CardTitle>
              <CardDescription className="text-xs">Highest similarity documents</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6 text-xs font-bold">File</TableHead>
                  <TableHead className="text-xs font-bold">Similarity</TableHead>
                  <TableHead className="text-xs font-bold">Level</TableHead>
                  <TableHead className="text-xs font-bold text-right pr-6">Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topScans.map((s) => (
                  <TableRow key={s.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6 max-w-[160px] truncate font-semibold text-xs">{s.fileName}</TableCell>
                    <TableCell className={`font-bold text-xs ${s.plagiarismPercent >= 50 ? "text-rose-600" : s.plagiarismPercent >= 21 ? "text-amber-500" : "text-emerald-600"}`}>
                      {s.plagiarismPercent}%
                    </TableCell>
                    <TableCell>{levelBadge(s.plagiarismPercent)}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs px-2.5 text-blue-600 border-blue-500/20 hover:bg-blue-500/5" onClick={() => setViewScan(s)}>
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Scan detail dialog */}
      <Dialog open={!!viewScan} onOpenChange={(o) => !o && setViewScan(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          {viewScan && (
            <>
              <DialogHeader><DialogTitle>{viewScan.fileName}</DialogTitle></DialogHeader>
              <div className="space-y-3 text-sm">
                <p><strong>Plagiarism:</strong> {viewScan.plagiarismPercent}% &nbsp;|&nbsp; <strong>Original:</strong> {viewScan.originalPercent}%</p>
                <p><strong>Words:</strong> {viewScan.wordCount.toLocaleString()} &nbsp;|&nbsp; <strong>Level:</strong> {getLevel(viewScan.plagiarismPercent)}</p>
                {viewScan.matchedSections.length > 0 ? (
                  <div className="space-y-2">
                    <p className="font-medium">Matched sections:</p>
                    {viewScan.matchedSections.map((m, i) => (
                      <div key={i} className="rounded-lg border bg-muted/30 p-3 text-xs">
                        <p className="font-semibold text-destructive">{m.similarity}% — {m.source}</p>
                        <p className="mt-1 italic text-muted-foreground">{m.text}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-muted-foreground">No significant matches found.</p>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LecturerDashboardPage;
