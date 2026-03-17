import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCPS } from '@/contexts/CPSContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  FileText, ClipboardCheck, Clock, TrendingUp, BookOpen, Briefcase,
  Users, FlaskConical, CheckCircle2, XCircle, Eye, Award, Building2,
  GraduationCap, AlertCircle, ArrowRight, BarChart3, Mail, Shield, Calendar, Star, Pencil,
} from 'lucide-react';
import { ROLE_LABELS } from '@/types/auth';
import {
  CPS_CATEGORY_LABELS, CPSEntry, APPROVAL_STATUS_LABELS,
  ApprovalStatus, CPSCategory,
} from '@/types/cps';
import { format } from 'date-fns';
import { toast } from 'sonner';
import CpsScoreWidget from '@/components/cps/CpsScoreWidget';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/* ── helpers ────────────────────────────────────────────────── */
const statusStyles: Record<ApprovalStatus, string> = {
  draft: 'bg-secondary text-secondary-foreground',
  pending_hod: 'bg-amber-100 text-amber-800 border-amber-200',
  pending_principal: 'bg-blue-100 text-blue-800 border-blue-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const categoryMeta: Record<CPSCategory, { label: string; color: string; bg: string; bar: string; icon: React.ComponentType<{ className?: string }> }> = {
  research: { label: 'Research', color: 'text-purple-600', bg: 'bg-purple-100', bar: 'bg-purple-500', icon: FlaskConical },
  academics: { label: 'Academics', color: 'text-cyan-600', bg: 'bg-cyan-100', bar: 'bg-cyan-500', icon: BookOpen },
  industry: { label: 'Industry', color: 'text-orange-600', bg: 'bg-orange-100', bar: 'bg-orange-500', icon: Briefcase },
  placement: { label: 'Placement', color: 'text-green-600', bg: 'bg-green-100', bar: 'bg-green-500', icon: Users },
};

/* ── stat card ──────────────────────────────────────────────── */
interface StatCardProps {
  title: string; value: string | number; subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string; iconColor: string;
}
const StatCard = ({ title, value, subtitle, icon: Icon, iconBg, iconColor }: StatCardProps) => (
  <Card className="overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-xl ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

/* ══════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, currentRole } = useAuth();
  const { entries, getPendingHODApprovals, getPendingPrincipalApprovals, updateEntry } = useCPS();

  const [selectedEntry, setSelectedEntry] = useState<CPSEntry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<CPSEntry | null>(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Update user avatar in localStorage
      const USERS_KEY = 'cps_users';
      const stored = localStorage.getItem(USERS_KEY);
      if (stored) {
        const users = JSON.parse(stored);
        const idx = users.findIndex((u: any) => u.id === user.id);
        if (idx !== -1) {
          users[idx].avatarUrl = dataUrl;
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
      }
      // Update auth state
      const AUTH_KEY = 'cps_auth';
      const authStored = localStorage.getItem(AUTH_KEY);
      if (authStored) {
        const auth = JSON.parse(authStored);
        if (auth.user) {
          auth.user.avatarUrl = dataUrl;
          localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
        }
      }
      toast.success('Profile picture updated! Refresh to see changes.');
      window.location.reload();
    };
    reader.readAsDataURL(file);
  };

  /* ── faculty data ── */
  const myEntries = useMemo(
    () => user ? entries.filter(e => e.facultyId === user.id) : [],
    [entries, user]
  );
  const myApproved = myEntries.filter(e => e.status === 'approved');
  const myTotalCredits = myApproved.reduce((s, e) => s + e.credits, 0);
  const myPending = myEntries.filter(e => e.status === 'pending_hod' || e.status === 'pending_principal').length;
  const myRejected = myEntries.filter(e => e.status === 'rejected').length;
  const recentEntries = [...myEntries].sort((a, b) =>
    new Date(b.submittedAt || b.date).getTime() - new Date(a.submittedAt || a.date).getTime()
  ).slice(0, 5);

  // Category breakdown
  const categoryCredits = useMemo(() => {
    const map: Record<string, number> = { research: 0, academics: 0, industry: 0, placement: 0 };
    myApproved.forEach(e => { map[e.category] = (map[e.category] || 0) + e.credits; });
    return map;
  }, [myApproved]);
  const maxCatCredits = Math.max(...Object.values(categoryCredits), 1);

  // Eligibility (assume 100 credits needed)
  const ELIGIBILITY_TARGET = 100;
  const eligibilityPct = Math.min(100, Math.round((myTotalCredits / ELIGIBILITY_TARGET) * 100));

  /* ── HOD data ── */
  const pendingEntries = user ? getPendingHODApprovals(user.department) : [];

  // Dept category breakdown (approved)
  const deptCategoryCredits = useMemo(() => {
    const deptApproved = entries.filter(e => e.department === user?.department && e.status === 'approved');
    const map: Record<string, number> = { research: 0, academics: 0, industry: 0, placement: 0 };
    deptApproved.forEach(e => { map[e.category] = (map[e.category] || 0) + e.credits; });
    return map;
  }, [entries, user]);
  const deptMaxCat = Math.max(...Object.values(deptCategoryCredits), 1);

  /* ── Principal data ── */
  const principalPending = getPendingPrincipalApprovals();

  const deptStats = useMemo(() => {
    const map: Record<string, { total: number; entries: number; pending: number }> = {};
    entries.forEach(e => {
      if (!map[e.department]) map[e.department] = { total: 0, entries: 0, pending: 0 };
      map[e.department].entries++;
      if (e.status === 'approved') map[e.department].total += e.credits;
      if (e.status === 'pending_principal') map[e.department].pending++;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [entries]);

  /* ── helpers ── */
  const handleApproveReject = (entry: CPSEntry, type: 'approve' | 'reject') => {
    setSelectedEntry(entry); setActionType(type); setRemarks('');
  };
  const confirmAction = () => {
    if (!selectedEntry || !actionType) return;
    if (actionType === 'approve') {
      updateEntry(selectedEntry.id, { status: 'pending_principal', hodRemarks: remarks, hodApprovedAt: new Date().toISOString() });
      toast.success('Entry approved — forwarded to Principal');
    } else {
      updateEntry(selectedEntry.id, { status: 'rejected', hodRemarks: remarks, rejectedAt: new Date().toISOString(), rejectedBy: 'hod' });
      toast.success('Entry rejected');
    }
    setSelectedEntry(null); setActionType(null); setRemarks('');
  };

  // ── RENDER ──────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in">

      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome to CPS</h1>
          <p className="text-muted-foreground mt-1">
            {user?.name} • {currentRole && ROLE_LABELS[currentRole]} • {user?.department}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="py-1.5 px-3">Academic Year 2024-25</Badge>
          <CpsScoreWidget />
        </div>
      </div>

      {/* ═══════════ FACULTY ════════════════════════════════════ */}
      {currentRole === 'faculty' && (
        <>
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Left Sidebar: Profile Overview */}
            <div className="lg:col-span-1">
              <Card className="border-none shadow-md bg-gradient-to-b from-card to-background/50 h-full">
                <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Avatar className="h-24 w-24 border-4 border-primary/10 shadow-lg">
                      <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                      <AvatarFallback className="text-2xl font-bold bg-primary/5 text-primary">
                        {user?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-md border-2 border-background group-hover:scale-110 transition-transform">
                      <Pencil className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold mt-4">{user?.name}</h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">{user?.department}</p>

                  <div className="w-full mt-6 space-y-3 text-left">
                    <div className="flex items-center gap-2 text-xs">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{user?.usn}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Joined {user?.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'N/A'}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-6 text-xs" onClick={() => navigate('/settings')}>
                    Edit Profile
                  </Button>

                  {/* Quick Actions inside profile card */}
                  <div className="w-full mt-5">
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-3">Quick Actions</p>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs" onClick={() => navigate('/cps/new')}>
                        <FileText className="w-3.5 h-3.5" /> New CPS Entry
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs" onClick={() => navigate('/cps/records')}>
                        <ClipboardCheck className="w-3.5 h-3.5" /> My CPS Records
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs" onClick={() => navigate('/leave')}>
                        <Clock className="w-3.5 h-3.5" /> Apply for Leave
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs" onClick={() => navigate('/reports')}>
                        <BarChart3 className="w-3.5 h-3.5" /> View Reports
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Content: Main Dashboard Info */}
            <div className="lg:col-span-3 space-y-6">
              {/* Eligibility Progress (Full width of the 3-col section) */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" /> Eligibility Progress
                  </CardTitle>
                  <CardDescription>Target: {ELIGIBILITY_TARGET} credits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold">{myTotalCredits.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground mb-1">/ {ELIGIBILITY_TARGET} pts</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${eligibilityPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{eligibilityPct}% complete</span>
                    {eligibilityPct >= 100
                      ? <Badge className="bg-green-100 text-green-700">✓ Eligible</Badge>
                      : <span>{(ELIGIBILITY_TARGET - myTotalCredits).toFixed(2)} pts remaining</span>}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-base">Recent Activities</CardTitle>
                    <CardDescription>Your latest CPS entries</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => navigate('/cps/records')}>
                    View all <ArrowRight className="w-3 h-3" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {recentEntries.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <FileText className="w-8 h-8 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">No entries yet</p>
                      <Button size="sm" className="mt-3" onClick={() => navigate('/cps/new')}>
                        Add your first entry
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {recentEntries.map(entry => {
                        const meta = categoryMeta[entry.category];
                        const Icon = meta.icon;
                        return (
                          <div key={entry.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                            <div className={`p-2 rounded-lg flex-shrink-0 mt-0.5 ${meta.bg}`}>
                              <Icon className={`w-4 h-4 ${meta.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{entry.activityType}</p>
                              <p className="text-xs text-muted-foreground truncate">{entry.description}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(entry.date), 'MMM d, yyyy')}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <Badge className={`text-xs ${statusStyles[entry.status]}`}>
                                {APPROVAL_STATUS_LABELS[entry.status].split(' ')[0]}
                              </Badge>
                              <span className="text-xs font-semibold">{entry.credits} pts</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>


            </div>
          </div>
        </>
      )}

      {/* ═══════════ HOD ════════════════════════════════════════ */}
      {currentRole === 'hod' && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Pending Approvals" value={pendingEntries.length} subtitle="Require your review" icon={Clock} iconBg="bg-amber-100" iconColor="text-amber-600" />
            <StatCard title="Approved This Month" value={entries.filter(e => e.department === user?.department && e.status !== 'draft' && e.status !== 'pending_hod').length} subtitle="Forwarded / Approved" icon={CheckCircle2} iconBg="bg-green-100" iconColor="text-green-600" />
            <StatCard title="Dept. Approved Credits" value={entries.filter(e => e.department === user?.department && e.status === 'approved').reduce((s, e) => s + e.credits, 0).toFixed(1)} subtitle="Total this year" icon={Award} iconBg="bg-blue-100" iconColor="text-blue-600" />
            <StatCard title="Faculty Count" value={[...new Set(entries.filter(e => e.department === user?.department).map(e => e.facultyId))].length} subtitle="Active in department" icon={Users} iconBg="bg-purple-100" iconColor="text-purple-600" />
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Profile Overview (HOD) */}
            <Card className="lg:col-span-1 border-none shadow-md bg-gradient-to-b from-card to-background/50">
              <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 border-2 border-primary/10 shadow-md mb-3">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                  <AvatarFallback className="text-xl font-bold bg-primary/5 text-primary">
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-bold">{user?.name}</h2>
                <Badge variant="secondary" className="mt-1 text-[10px]">{ROLE_LABELS['hod']}</Badge>

                <div className="w-full mt-4 space-y-2 text-left text-[11px]">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span>{user?.department} Department</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category breakdown — dept */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3 px-4">
                <CardTitle className="text-sm">Dept. Domains</CardTitle>
                <CardDescription className="text-[10px]">Approved credits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 px-4 pb-4">
                {(Object.keys(categoryMeta) as CPSCategory[]).map(cat => {
                  const meta = categoryMeta[cat];
                  const Icon = meta.icon;
                  const val = deptCategoryCredits[cat] || 0;
                  const pct = Math.round((val / deptMaxCat) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <div className={`p-1 rounded ${meta.bg}`}><Icon className={`w-3 h-3 ${meta.color}`} /></div>
                          <span className="font-medium">{meta.label}</span>
                        </div>
                        <span className="font-semibold">{val.toFixed(1)}</span>
                      </div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${meta.bar}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Pending approvals table */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-base">Faculty CPS Approvals</CardTitle>
                  <CardDescription>Pending entries from your department</CardDescription>
                </div>
                {pendingEntries.length > 0 && (
                  <Badge className="bg-amber-100 text-amber-800">{pendingEntries.length} pending</Badge>
                )}
              </CardHeader>
              <CardContent>
                {pendingEntries.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="font-medium text-sm">All caught up!</p>
                    <p className="text-xs text-muted-foreground mt-1">No pending approvals</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Faculty</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Credits</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingEntries.slice(0, 5).map(entry => (
                          <TableRow key={entry.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setViewingEntry(entry)}>
                            <TableCell className="font-medium text-sm">{entry.facultyName}</TableCell>
                            <TableCell>
                              <div className="text-sm font-medium truncate max-w-[160px]">{entry.activityType}</div>
                              <div className="text-xs text-muted-foreground">{format(new Date(entry.date), 'MMM d, yyyy')}</div>
                            </TableCell>
                            <TableCell className="font-semibold">{entry.credits}</TableCell>
                            <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="sm" onClick={() => setViewingEntry(entry)}><Eye className="w-4 h-4" /></Button>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 h-7 text-xs" onClick={() => handleApproveReject(entry, 'approve')}>
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                                </Button>
                                <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive hover:text-destructive-foreground h-7 text-xs" onClick={() => handleApproveReject(entry, 'reject')}>
                                  <XCircle className="w-3 h-3 mr-1" /> Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {pendingEntries.length > 5 && (
                      <div className="pt-3 text-center">
                        <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => navigate('/approvals/hod')}>
                          View all {pendingEntries.length} entries <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2" onClick={() => navigate('/approvals/hod')}>
                  <ClipboardCheck className="w-4 h-4" /> Review Pending ({pendingEntries.length})
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => navigate('/cps/new')}>
                  <FileText className="w-4 h-4" /> New CPS Entry
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => navigate('/reports')}>
                  <BarChart3 className="w-4 h-4" /> Department Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ═══════════ PRINCIPAL ══════════════════════════════════ */}
      {currentRole === 'principal' && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Pending Approvals" value={principalPending.length} subtitle="HOD-approved entries" icon={Clock} iconBg="bg-amber-100" iconColor="text-amber-600" />
            <StatCard title="College Credits" value={entries.filter(e => e.status === 'approved').reduce((s, e) => s + e.credits, 0).toFixed(1)} subtitle="Approved this year" icon={Award} iconBg="bg-blue-100" iconColor="text-blue-600" />
            <StatCard title="Departments" value={deptStats.length} subtitle="Active departments" icon={Building2} iconBg="bg-purple-100" iconColor="text-purple-600" />
            <StatCard title="Total Entries" value={entries.length} subtitle="College-wide" icon={FileText} iconBg="bg-green-100" iconColor="text-green-600" />
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Profile Overview (Principal) */}
            <Card className="lg:col-span-1 border-none shadow-md bg-gradient-to-b from-card to-background/50">
              <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 border-2 border-primary/10 shadow-md mb-3">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                  <AvatarFallback className="text-xl font-bold bg-primary/5 text-primary">
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-bold">{user?.name}</h2>
                <Badge variant="secondary" className="mt-1 text-[10px]">{ROLE_LABELS['principal']}</Badge>

                <div className="w-full mt-4 space-y-2 text-left text-[11px]">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 text-muted-foreground" />
                    <span>{user?.usn}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Department Leaderboard */}
            <Card className="lg:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" /> Department Leaderboard
                  </CardTitle>
                  <CardDescription>Ranked by approved credits</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => navigate('/reports')}>
                  Full report <ArrowRight className="w-3 h-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deptStats.slice(0, 6).map(([dept, s], i) => (
                    <div key={dept} className="flex items-center gap-3">
                      <span className={`w-5 text-xs font-bold text-center ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-muted-foreground'}`}>#{i + 1}</span>
                      <span className="flex-1 text-sm font-medium">{dept}</span>
                      <span className="text-xs text-muted-foreground">{s.entries} entries</span>
                      {s.pending > 0 && <Badge className="bg-amber-100 text-amber-700 text-xs">{s.pending} pending</Badge>}
                      <span className="text-sm font-bold w-16 text-right">{s.total.toFixed(1)} pts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending approvals for principal */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-base">Pending Final Approvals</CardTitle>
                  <CardDescription>HOD-approved, awaiting your decision</CardDescription>
                </div>
                {principalPending.length > 0 && (
                  <Badge className="bg-amber-100 text-amber-800">{principalPending.length}</Badge>
                )}
              </CardHeader>
              <CardContent>
                {principalPending.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="font-medium text-sm">All cleared!</p>
                    <p className="text-xs text-muted-foreground mt-1">No entries waiting for your approval</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {principalPending.slice(0, 4).map(entry => (
                      <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer" onClick={() => navigate('/approvals/principal')}>
                        <div className={`p-1.5 rounded ${categoryMeta[entry.category].bg} flex-shrink-0 mt-0.5`}>
                          {(() => { const Icon = categoryMeta[entry.category].icon; return <Icon className={`w-3.5 h-3.5 ${categoryMeta[entry.category].color}`} />; })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{entry.activityType}</p>
                          <p className="text-xs text-muted-foreground">{entry.facultyName} · {entry.department}</p>
                        </div>
                        <span className="text-sm font-bold flex-shrink-0">{entry.credits} pts</span>
                      </div>
                    ))}
                    {principalPending.length > 4 && (
                      <Button variant="ghost" size="sm" className="w-full gap-1 text-xs mt-1" onClick={() => navigate('/approvals/principal')}>
                        View all {principalPending.length} entries <ArrowRight className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2" onClick={() => navigate('/approvals/principal')}>
                  <ClipboardCheck className="w-4 h-4" /> Final Approvals ({principalPending.length})
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => navigate('/reports')}>
                  <BarChart3 className="w-4 h-4" /> College Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ── View Details Dialog ── */}
      <Dialog open={!!viewingEntry} onOpenChange={open => !open && setViewingEntry(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
            <DialogDescription>Full details of this CPS entry</DialogDescription>
          </DialogHeader>
          {viewingEntry && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="font-medium text-muted-foreground">Faculty</p><p>{viewingEntry.facultyName}</p></div>
                <div><p className="font-medium text-muted-foreground">Department</p><p>{viewingEntry.department}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="font-medium text-muted-foreground">Category</p><p>{CPS_CATEGORY_LABELS[viewingEntry.category]}</p></div>
                <div><p className="font-medium text-muted-foreground">Credits</p><p className="font-semibold">{viewingEntry.credits}</p></div>
              </div>
              <div><p className="font-medium text-muted-foreground">Activity</p><p>{viewingEntry.activityType}</p></div>
              <div><p className="font-medium text-muted-foreground">Description</p><p>{viewingEntry.description}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="font-medium text-muted-foreground">Date</p><p>{format(new Date(viewingEntry.date), 'MMM d, yyyy')}</p></div>
                <div><p className="font-medium text-muted-foreground">Status</p>
                  <Badge className={statusStyles[viewingEntry.status]}>{APPROVAL_STATUS_LABELS[viewingEntry.status]}</Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingEntry(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Approve / Reject Dialog ── */}
      <Dialog open={!!selectedEntry} onOpenChange={open => { if (!open) { setSelectedEntry(null); setActionType(null); setRemarks(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === 'approve' ? 'Approve Entry' : 'Reject Entry'}</DialogTitle>
            <DialogDescription>
              {actionType === 'approve' ? 'Entry will be forwarded to the Principal.' : 'Entry will be rejected and faculty notified.'}
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted">
                <div className="font-medium">{selectedEntry.activityType}</div>
                <div className="text-sm text-muted-foreground mt-1">{selectedEntry.description}</div>
                <div className="mt-3 flex gap-2">
                  <Badge variant="outline">{selectedEntry.credits} credits</Badge>
                  <Badge variant="outline">{selectedEntry.facultyName}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Remarks (Optional)</label>
                <Textarea placeholder="Add comments or feedback..." value={remarks} onChange={e => setRemarks(e.target.value)} rows={3} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEntry(null)}>Cancel</Button>
            <Button
              variant={actionType === 'reject' ? 'destructive' : 'default'}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
              onClick={confirmAction}
            >
              {actionType === 'approve' ? 'Approve Entry' : 'Reject Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
