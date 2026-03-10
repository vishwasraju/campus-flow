import { useMemo, useState } from 'react';
import { useCPS } from '@/contexts/CPSContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    Award, TrendingUp, CheckCircle2, Clock, XCircle, FileText,
    FlaskConical, BookOpen, Briefcase, Users, BarChart3, Download, Printer,
} from 'lucide-react';
import { CPS_CATEGORY_LABELS, CPSCategory, ApprovalStatus, APPROVAL_STATUS_LABELS } from '@/types/cps';
import { DEPARTMENTS } from '@/types/auth';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { downloadCSV, printReport } from '@/utils/reportUtils';
import { toast } from 'sonner';

const CATEGORY_META: Record<CPSCategory, { color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
    research: { color: 'text-purple-600', bg: 'bg-purple-100', icon: FlaskConical },
    academics: { color: 'text-cyan-600', bg: 'bg-cyan-100', icon: BookOpen },
    industry: { color: 'text-orange-600', bg: 'bg-orange-100', icon: Briefcase },
    placement: { color: 'text-green-600', bg: 'bg-green-100', icon: Users },
};

const STATUS_META: Record<ApprovalStatus, { label: string; color: string; dot: string }> = {
    approved: { label: 'Approved', color: 'text-green-600', dot: 'bg-green-500' },
    pending_hod: { label: 'Pending HOD', color: 'text-amber-600', dot: 'bg-amber-400' },
    pending_principal: { label: 'Pending Principal', color: 'text-blue-600', dot: 'bg-blue-400' },
    rejected: { label: 'Rejected', color: 'text-red-600', dot: 'bg-red-500' },
    draft: { label: 'Draft', color: 'text-gray-500', dot: 'bg-gray-400' },
};

const Reports = () => {
    const { entries } = useCPS();
    const { currentRole, user } = useAuth();
    const [deptFilter, setDeptFilter] = useState<string>('all');

    // Scope entries based on role
    const scopedEntries = useMemo(() => {
        let base = entries;
        if (currentRole === 'hod' && user) base = entries.filter(e => e.department === user.department);
        if (deptFilter !== 'all') base = base.filter(e => e.department === deptFilter);
        return base;
    }, [entries, currentRole, user, deptFilter]);

    const approvedEntries = scopedEntries.filter(e => e.status === 'approved');
    const totalCredits = approvedEntries.reduce((s, e) => s + e.credits, 0);
    const pendingCount = scopedEntries.filter(e => e.status === 'pending_hod' || e.status === 'pending_principal').length;
    const rejectedCount = scopedEntries.filter(e => e.status === 'rejected').length;

    // Category breakdown (approved only)
    const categoryTotals = useMemo(() => {
        const cats: Record<string, number> = { research: 0, academics: 0, industry: 0, placement: 0 };
        approvedEntries.forEach(e => { cats[e.category] = (cats[e.category] || 0) + e.credits; });
        return cats;
    }, [approvedEntries]);

    // Status distribution
    const statusCounts = useMemo(() => {
        const counts: Partial<Record<ApprovalStatus, number>> = {};
        scopedEntries.forEach(e => { counts[e.status] = (counts[e.status] || 0) + 1; });
        return counts;
    }, [scopedEntries]);

    // Per-department table (only for principal & admin)
    const deptStats = useMemo(() => {
        const map: Record<string, { total: number; approved: number; pending: number; entries: number }> = {};
        entries.forEach(e => {
            if (!map[e.department]) map[e.department] = { total: 0, approved: 0, pending: 0, entries: 0 };
            map[e.department].entries++;
            if (e.status === 'approved') { map[e.department].approved++; map[e.department].total += e.credits; }
            if (e.status === 'pending_hod' || e.status === 'pending_principal') map[e.department].pending++;
        });
        return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
    }, [entries]);

    // Activity stats for Top Activities
    const activityStatsList = useMemo(() => {
        const map: Record<string, number> = {};
        approvedEntries.forEach(e => {
            map[e.activityType] = (map[e.activityType] || 0) + 1;
        });
        return Object.entries(map)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);
    }, [approvedEntries]);

    const showDeptFilter = currentRole === 'principal' || (currentRole as string) === 'admin';
    const showDeptTable = currentRole === 'principal' || (currentRole as string) === 'admin';

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-emerald-500" /> Analytics & Reports
                    </h1>
                    <p className="text-muted-foreground mt-1">CPS credit statistics and performance insights</p>
                </div>
                {showDeptFilter && (
                    <Select value={deptFilter} onValueChange={setDeptFilter}>
                        <SelectTrigger className="w-[220px]">
                            <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {DEPARTMENTS.map(d => (
                                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6 flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Approved Credits</p>
                            <p className="text-3xl font-bold">{totalCredits.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground text-emerald-600 font-medium">{approvedEntries.length} items</p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-100/50"><Award className="h-6 w-6 text-emerald-600" /></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
                            <p className="text-3xl font-bold">{scopedEntries.length}</p>
                            <p className="text-xs text-muted-foreground">All statuses included</p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-100/50"><FileText className="h-6 w-6 text-blue-600" /></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Awaiting Review</p>
                            <p className="text-3xl font-bold">{pendingCount}</p>
                            <p className="text-xs text-muted-foreground text-amber-600 font-medium">Action required</p>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-100/50"><Clock className="h-6 w-6 text-amber-600" /></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                            <p className="text-3xl font-bold">{rejectedCount}</p>
                            <p className="text-xs text-muted-foreground">Requires revision</p>
                        </div>
                        <div className="p-3 rounded-xl bg-red-100/50"><XCircle className="h-6 w-6 text-red-600" /></div>
                    </CardContent>
                </Card>
            </div>

            {/* Category Bar Chart + Status Donut */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Credits by Category</CardTitle>
                        <CardDescription>Approved credits per domain</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart
                                data={(Object.keys(CPS_CATEGORY_LABELS) as CPSCategory[]).map(cat => ({
                                    name: CPS_CATEGORY_LABELS[cat].split(' ')[0],
                                    credits: Number((categoryTotals[cat] || 0).toFixed(2)),
                                }))}
                                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(v: number) => [`${v} pts`, 'Credits']}
                                    contentStyle={{ borderRadius: 8, fontSize: 12 }}
                                />
                                <Bar dataKey="credits" radius={[6, 6, 0, 0]}>
                                    {(Object.keys(CATEGORY_META) as CPSCategory[]).map(cat => (
                                        <Cell
                                            key={cat}
                                            fill={{
                                                research: '#a855f7',
                                                academics: '#06b6d4',
                                                industry: '#f97316',
                                                placement: '#22c55e',
                                            }[cat]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Status Distribution</CardTitle>
                        <CardDescription>Breakdown of entry statuses</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        {(() => {
                            const pieData = (Object.keys(STATUS_META) as ApprovalStatus[])
                                .map(s => ({ name: STATUS_META[s].label, value: statusCounts[s] || 0, status: s }))
                                .filter(d => d.value > 0);
                            const PIE_COLORS: Record<ApprovalStatus, string> = {
                                approved: '#22c55e',
                                pending_hod: '#f59e0b',
                                pending_principal: '#3b82f6',
                                rejected: '#ef4444',
                                draft: '#94a3b8',
                            };
                            if (pieData.length === 0) return <p className="py-16 text-sm text-muted-foreground">No data yet</p>;
                            return (
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%" cy="50%"
                                            innerRadius={55} outerRadius={85}
                                            paddingAngle={3}
                                            dataKey="value"
                                            animationBegin={0}
                                            animationDuration={700}
                                        >
                                            {pieData.map(entry => (
                                                <Cell key={entry.status} fill={PIE_COLORS[entry.status as ApprovalStatus]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(v: number, name: string) => [v, name]}
                                            contentStyle={{ borderRadius: 8, fontSize: 12 }}
                                        />
                                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            );
                        })()}
                    </CardContent>
                </Card>
            </div>

            {/* Department Table */}
            {showDeptTable && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Department Performance</CardTitle>
                        <CardDescription>Metrics aggregated by department</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="text-right">Entries</TableHead>
                                    <TableHead className="text-right text-emerald-600 font-semibold">Approved Credits</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deptStats.map(([dept, stats]) => (
                                    <TableRow key={dept}>
                                        <TableCell className="font-medium text-sm">{dept}</TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">{stats.entries}</TableCell>
                                        <TableCell className="text-right font-bold">{stats.total.toFixed(2)} pts</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Top Activities */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" /> Top Activities
                    </CardTitle>
                    <CardDescription>Most frequent CPS contributions</CardDescription>
                </CardHeader>
                <CardContent>
                    {activityStatsList.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground text-sm">No activities logged yet</p>
                    ) : (
                        <div className="space-y-4">
                            {activityStatsList.map((a) => (
                                <div key={a.name} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium truncate max-w-[400px]">{a.name}</span>
                                        <span className="text-muted-foreground">{a.count} times</span>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(a.count / Math.max(...activityStatsList.map(x => x.count))) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Data Export Section */}
            <Card className="border-emerald-100 bg-emerald-50/20">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-emerald-700">
                        <Download className="w-4 h-4" /> Data Export & Downloads
                    </CardTitle>
                    <CardDescription>
                        Generate comprehensive reports of all entries based on the current filters.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => {
                                if (scopedEntries.length === 0) return toast.error('No data available to export');
                                downloadCSV(scopedEntries, `CPS_Data_${user?.name?.replace(/\s+/g, '_') || 'Report'}`);
                                toast.success('CSV Downloaded successfully');
                            }}
                        >
                            <FileText className="w-4 h-4" /> Export All as CSV
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2 border-emerald-200"
                            onClick={() => {
                                if (scopedEntries.length === 0) return toast.error('No data available to export');
                                const title = `CPS Analytics Report - ${user?.name || 'College'}`;
                                const metadata = [
                                    { label: 'Department', value: deptFilter === 'all' ? (user?.department || 'All') : deptFilter },
                                    { label: 'Role', value: currentRole?.toUpperCase() || '' },
                                ];
                                const summary = [
                                    { label: 'Total Credits', value: totalCredits.toFixed(2), color: '#16a34a' },
                                    { label: 'Pending', value: pendingCount, color: '#d97706' },
                                    { label: 'Rejected', value: rejectedCount, color: '#dc2626' },
                                ];
                                printReport(scopedEntries, title, metadata, summary);
                            }}
                        >
                            <Printer className="w-4 h-4" /> Download Printable PDF
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Reports;
