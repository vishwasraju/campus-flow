import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCPS } from '@/contexts/CPSContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  FileText, 
  ClipboardCheck, 
  Clock, 
  TrendingUp,
  BookOpen,
  Briefcase,
  Users,
  FlaskConical,
  CheckCircle2,
  XCircle,
  Eye,
  Award,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { ROLE_LABELS } from '@/types/auth';
import { CPS_CATEGORY_LABELS, CPSEntry, APPROVAL_STATUS_LABELS, ApprovalStatus } from '@/types/cps';
import { format } from 'date-fns';
import { toast } from 'sonner';

const statusStyles: Record<ApprovalStatus, string> = {
  draft: 'bg-secondary text-secondary-foreground',
  pending_hod: 'bg-amber-100 text-amber-800 border-amber-200',
  pending_principal: 'bg-blue-100 text-blue-800 border-blue-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

// Stat Card Component with colored icon
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
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

const Dashboard = () => {
  const { user, currentRole } = useAuth();
  const { getPendingHODApprovals, updateEntry } = useCPS();
  
  const [selectedEntry, setSelectedEntry] = useState<CPSEntry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<CPSEntry | null>(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const pendingEntries = user ? getPendingHODApprovals(user.department) : [];

  // Mock data for dashboard stats
  const facultyStats = {
    totalCredits: 68,
    pendingSubmissions: 2,
    approvedThisYear: 12,
    categoryBreakdown: {
      research: 25,
      academics: 18,
      industry: 15,
      placement: 10,
    },
  };

  const hodStats = {
    pendingApprovals: 8,
    approvedThisMonth: 15,
    departmentCredits: 450,
    facultyCount: 12,
  };

  const principalStats = {
    pendingApprovals: 5,
    totalCreditsCollege: 2850,
    departmentsCount: 6,
    approvedThisMonth: 45,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome to CPS
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.name} • {currentRole && ROLE_LABELS[currentRole]} • {user?.department}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="py-1.5 px-3">
            Academic Year 2024-25
          </Badge>
        </div>
      </div>

      {/* Role-specific Stats */}
      {currentRole === 'faculty' && (
        <>
          {/* Quick Stats - Colored Icon Style */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Credits"
              value={facultyStats.totalCredits}
              subtitle="This academic year"
              icon={Award}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <StatCard
              title="Pending Approvals"
              value={facultyStats.pendingSubmissions}
              subtitle="Awaiting review"
              icon={Clock}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
            />
            <StatCard
              title="Approved Entries"
              value={facultyStats.approvedThisYear}
              subtitle="This year"
              icon={CheckCircle2}
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard
              title="Department Rank"
              value="#3"
              subtitle="Among 12 faculty"
              icon={TrendingUp}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">CPS Category Breakdown</CardTitle>
              <CardDescription>Credits earned across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <div className="p-3 rounded-xl bg-purple-100">
                    <FlaskConical className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Research</p>
                    <p className="text-2xl font-bold">{facultyStats.categoryBreakdown.research}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-cyan-50 border border-cyan-100">
                  <div className="p-3 rounded-xl bg-cyan-100">
                    <BookOpen className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Academics</p>
                    <p className="text-2xl font-bold">{facultyStats.categoryBreakdown.academics}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 border border-orange-100">
                  <div className="p-3 rounded-xl bg-orange-100">
                    <Briefcase className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Industry</p>
                    <p className="text-2xl font-bold">{facultyStats.categoryBreakdown.industry}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-100">
                  <div className="p-3 rounded-xl bg-green-100">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Placement</p>
                    <p className="text-2xl font-bold">{facultyStats.categoryBreakdown.placement}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {currentRole === 'hod' && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Pending Approvals"
              value={pendingEntries.length}
              subtitle="Require your review"
              icon={Clock}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
            />
            <StatCard
              title="Approved This Month"
              value={hodStats.approvedThisMonth}
              subtitle="Entries processed"
              icon={CheckCircle2}
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard
              title="Department Credits"
              value={hodStats.departmentCredits}
              subtitle="Total this year"
              icon={Award}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <StatCard
              title="Faculty Count"
              value={hodStats.facultyCount}
              subtitle="In your department"
              icon={Users}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />
          </div>

          {/* HOD Approvals Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">Faculty CPS Approvals</CardTitle>
                <CardDescription>Pending entries from your department faculty</CardDescription>
              </div>
              {pendingEntries.length > 0 && (
                <Badge className="bg-amber-100 text-amber-800">
                  {pendingEntries.length} pending
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              {pendingEntries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="font-medium">All caught up!</p>
                  <p className="text-sm text-muted-foreground">No pending approvals</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Faculty</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingEntries.map((entry) => (
                        <TableRow
                          key={entry.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setViewingEntry(entry)}
                        >
                          <TableCell>
                            <div className="font-medium">{entry.facultyName}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{entry.activityType}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {entry.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {CPS_CATEGORY_LABELS[entry.category].split(' ')[0]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(entry.date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">{entry.credits}</span>
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewingEntry(entry)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  setSelectedEntry(entry);
                                  setActionType('approve');
                                  setRemarks('');
                                }}
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => {
                                  setSelectedEntry(entry);
                                  setActionType('reject');
                                  setRemarks('');
                                }}
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {currentRole === 'principal' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Pending Approvals"
            value={principalStats.pendingApprovals}
            subtitle="HOD entries pending"
            icon={Clock}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />
          <StatCard
            title="College Credits"
            value={principalStats.totalCreditsCollege}
            subtitle="This academic year"
            icon={Award}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Departments"
            value={principalStats.departmentsCount}
            subtitle="Active departments"
            icon={Building2}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCard
            title="Approved This Month"
            value={principalStats.approvedThisMonth}
            subtitle="Final approvals"
            icon={CheckCircle2}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks for your role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {currentRole === 'faculty' && (
              <>
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  New CPS Entry
                </Button>
                <Button variant="outline" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Apply for Leave
                </Button>
              </>
            )}
            {currentRole === 'hod' && (
              <>
                <Button variant="outline" className="gap-2">
                  <ClipboardCheck className="w-4 h-4" />
                  Review Pending ({pendingEntries.length})
                </Button>
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Department Report
                </Button>
              </>
            )}
            {currentRole === 'principal' && (
              <>
                <Button variant="outline" className="gap-2">
                  <ClipboardCheck className="w-4 h-4" />
                  Final Approvals ({principalStats.pendingApprovals})
                </Button>
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  College Report
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View activity details dialog (HOD) */}
      <Dialog open={!!viewingEntry} onOpenChange={(open) => !open && setViewingEntry(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
            <DialogDescription>View full details of this CPS entry</DialogDescription>
          </DialogHeader>
          {viewingEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Faculty</p>
                  <p className="text-sm font-medium">{viewingEntry.facultyName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p className="text-sm">{viewingEntry.department}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p className="text-sm">{CPS_CATEGORY_LABELS[viewingEntry.category]}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Credits</p>
                  <p className="text-sm font-semibold">{viewingEntry.credits}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Activity</p>
                <p className="text-sm font-medium">{viewingEntry.activityType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm">{viewingEntry.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="text-sm">{format(new Date(viewingEntry.date), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={statusStyles[viewingEntry.status]}>
                    {APPROVAL_STATUS_LABELS[viewingEntry.status]}
                  </Badge>
                </div>
              </div>
              {viewingEntry.evidence && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Evidence</p>
                  <p className="text-sm">
                    {viewingEntry.evidence?.startsWith('file:')
                      ? `File: ${viewingEntry.evidence.slice(5)}`
                      : (
                          <a
                            href={viewingEntry.evidence}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline hover:no-underline"
                          >
                            View Link
                          </a>
                        )}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingEntry(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* HOD Approval Confirmation Dialog */}
      <Dialog
        open={!!selectedEntry}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEntry(null);
            setActionType(null);
            setRemarks('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Entry' : 'Reject Entry'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'This entry will be approved.'
                : 'This entry will be rejected and the faculty will be notified.'}
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
                <label className="text-sm font-medium">
                  Remarks (Optional)
                </label>
                <Textarea
                  placeholder="Add any comments or feedback..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEntry(null)}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'reject' ? 'destructive' : 'default'}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
              onClick={() => {
                if (!selectedEntry || !actionType) return;

                if (actionType === 'approve') {
                  updateEntry(selectedEntry.id, {
                    status: 'approved',
                    hodRemarks: remarks,
                    hodApprovedAt: new Date().toISOString(),
                  });
                  toast.success('Entry approved');
                } else {
                  updateEntry(selectedEntry.id, {
                    status: 'rejected',
                    hodRemarks: remarks,
                    rejectedAt: new Date().toISOString(),
                    rejectedBy: 'hod',
                  });
                  toast.success('Entry rejected');
                }

                setSelectedEntry(null);
                setActionType(null);
                setRemarks('');
              }}
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
