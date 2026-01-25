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
} from 'lucide-react';
import { ROLE_LABELS } from '@/types/auth';
import { CPS_CATEGORY_LABELS, CPSEntry } from '@/types/cps';
import { format } from 'date-fns';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, currentRole } = useAuth();
  const { getPendingHODApprovals, updateEntry } = useCPS();
  
  const [selectedEntry, setSelectedEntry] = useState<CPSEntry | null>(null);
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
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your {currentRole && ROLE_LABELS[currentRole].toLowerCase()} dashboard
        </p>
      </div>

      {/* Role-specific Stats */}
      {currentRole === 'faculty' && (
        <>
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total CPS Credits</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{facultyStats.totalCredits}</div>
                <p className="text-xs text-muted-foreground">This academic year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{facultyStats.pendingSubmissions}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Entries</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{facultyStats.approvedThisYear}</div>
                <p className="text-xs text-muted-foreground">This year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Department Rank</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#3</div>
                <p className="text-xs text-muted-foreground">Among 12 faculty</p>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>CPS Category Breakdown</CardTitle>
              <CardDescription>Credits earned across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <div className="p-2 rounded-md bg-cps-research/20">
                    <FlaskConical className="h-5 w-5 text-cps-research" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Research & Development</p>
                    <p className="text-2xl font-bold">{facultyStats.categoryBreakdown.research}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="p-2 rounded-md bg-cps-academics/20">
                    <BookOpen className="h-5 w-5 text-cps-academics" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Academics & Teaching</p>
                    <p className="text-2xl font-bold">{facultyStats.categoryBreakdown.academics}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                  <div className="p-2 rounded-md bg-cps-industry/20">
                    <Briefcase className="h-5 w-5 text-cps-industry" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Industry Interaction</p>
                    <p className="text-2xl font-bold">{facultyStats.categoryBreakdown.industry}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <div className="p-2 rounded-md bg-cps-placement/20">
                    <Users className="h-5 w-5 text-cps-placement" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Placement Activities</p>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-status-pending">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Clock className="h-4 w-4 text-status-pending" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingEntries.length}</div>
                <p className="text-xs text-muted-foreground">Require your review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hodStats.approvedThisMonth}</div>
                <p className="text-xs text-muted-foreground">Entries processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Department Credits</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hodStats.departmentCredits}</div>
                <p className="text-xs text-muted-foreground">Total this year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faculty Count</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hodStats.facultyCount}</div>
                <p className="text-xs text-muted-foreground">In your department</p>
              </CardContent>
            </Card>
          </div>

          {/* HOD Approvals Section */}
          <Card>
            <CardHeader>
              <CardTitle>Faculty CPS Approvals</CardTitle>
              <CardDescription>Pending entries from your department faculty</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingEntries.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No pending approvals</p>
                  <p className="text-sm">All entries have been reviewed</p>
                </div>
              ) : (
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
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="font-medium">{entry.facultyName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{entry.activityType}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {entry.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {CPS_CATEGORY_LABELS[entry.category].split(' ')[0]}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(entry.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                          <span className="font-semibold">{entry.credits}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
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
                              className="text-destructive hover:text-destructive"
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
              )}
            </CardContent>
          </Card>
        </>
      )}

      {currentRole === 'principal' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-status-pending">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Final Approvals</CardTitle>
              <Clock className="h-4 w-4 text-status-pending" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{principalStats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">HOD entries pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">College-wide Credits</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{principalStats.totalCreditsCollege}</div>
              <p className="text-xs text-muted-foreground">This academic year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{principalStats.departmentsCount}</div>
              <p className="text-xs text-muted-foreground">Active departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{principalStats.approvedThisMonth}</div>
              <p className="text-xs text-muted-foreground">Final approvals given</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for your role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {currentRole === 'faculty' && (
              <>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">
                  <FileText className="w-4 h-4 mr-2" />
                  New CPS Entry
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">
                  <Clock className="w-4 h-4 mr-2" />
                  Apply for Leave
                </Badge>
              </>
            )}
            {currentRole === 'hod' && (
              <>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Review Pending ({pendingEntries.length})
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">
                  <FileText className="w-4 h-4 mr-2" />
                  Department Report
                </Badge>
              </>
            )}
            {currentRole === 'principal' && (
              <>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Final Approvals ({principalStats.pendingApprovals})
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">
                  <FileText className="w-4 h-4 mr-2" />
                  College Report
                </Badge>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* HOD Approval Confirmation Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
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
              <div className="p-4 rounded-lg bg-muted">
                <div className="font-medium">{selectedEntry.activityType}</div>
                <div className="text-sm text-muted-foreground">{selectedEntry.description}</div>
                <div className="mt-2 flex gap-2">
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
