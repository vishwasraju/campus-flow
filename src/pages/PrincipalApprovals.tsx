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
  CheckCircle2, 
  XCircle,
  Clock,
  FileText,
  Building2,
  Eye,
} from 'lucide-react';
import { CPSEntry, CPS_CATEGORY_LABELS, APPROVAL_STATUS_LABELS, ApprovalStatus } from '@/types/cps';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

const statusStyles: Record<ApprovalStatus, string> = {
  draft: 'bg-secondary text-secondary-foreground',
  pending_hod: 'bg-amber-100 text-amber-800 border-amber-200',
  pending_principal: 'bg-blue-100 text-blue-800 border-blue-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const PrincipalApprovals = () => {
  const { getPendingPrincipalApprovals, updateEntry, entries } = useCPS();
  
  const [selectedEntry, setSelectedEntry] = useState<CPSEntry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<CPSEntry | null>(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const pendingEntries = getPendingPrincipalApprovals();
  
  // Get recently approved entries
  const recentlyApproved = entries
    .filter((e) => e.status === 'approved' && e.principalApprovedAt)
    .slice(0, 5);

  // Get department-wise pending count
  const departmentCounts = pendingEntries.reduce((acc, entry) => {
    acc[entry.department] = (acc[entry.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleAction = (entry: CPSEntry, action: 'approve' | 'reject') => {
    setSelectedEntry(entry);
    setActionType(action);
    setRemarks('');
  };

  const confirmAction = () => {
    if (!selectedEntry || !actionType) return;

    if (actionType === 'approve') {
      updateEntry(selectedEntry.id, {
        status: 'approved',
        principalRemarks: remarks,
        principalApprovedAt: new Date().toISOString(),
      });
      toast.success('Entry approved successfully');
    } else {
      updateEntry(selectedEntry.id, {
        status: 'rejected',
        principalRemarks: remarks,
        rejectedAt: new Date().toISOString(),
        rejectedBy: 'principal',
      });
      toast.success('Entry rejected');
    }

    setSelectedEntry(null);
    setActionType(null);
    setRemarks('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Principal Approvals</h1>
        <p className="text-muted-foreground">
          Final approval for CPS entries from all departments
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Final Approval</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingEntries.length}</div>
            <p className="text-xs text-muted-foreground">From all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {Object.entries(departmentCounts).map(([dept, count]) => (
                <Badge key={dept} variant="outline">
                  {dept}: {count}
                </Badge>
              ))}
              {Object.keys(departmentCounts).length === 0 && (
                <span className="text-sm text-muted-foreground">No pending</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recently Approved</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentlyApproved.length}</div>
            <p className="text-xs text-muted-foreground">Last 5 approved entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Final Approvals</CardTitle>
          <CardDescription>CPS entries approved by HODs awaiting your final approval</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingEntries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pending approvals</p>
              <p className="text-sm">All entries have been processed</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>HOD Approved</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingEntries.map((entry) => (
                  <TableRow
                    key={entry.id}
                    className="cursor-pointer"
                    onClick={() => setViewingEntry(entry)}
                  >
                    <TableCell>
                      <div className="font-medium">{entry.facultyName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{entry.department}</Badge>
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
                    <TableCell>
                      <span className="font-semibold">{entry.credits}</span>
                    </TableCell>
                    <TableCell>
                      {entry.hodApprovedAt && format(new Date(entry.hodApprovedAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingEntry(entry)}
                          aria-label="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(entry, 'approve')}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleAction(entry, 'reject')}
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

      {/* View activity details dialog */}
      <Dialog open={!!viewingEntry} onOpenChange={(open) => !open && setViewingEntry(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
            <DialogDescription>View full details of this CPS entry</DialogDescription>
          </DialogHeader>
          {viewingEntry && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Faculty</span>
                <p className="text-sm">{viewingEntry.facultyName}</p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Department</span>
                <p className="text-sm">{viewingEntry.department}</p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Activity</span>
                <p className="text-sm">{viewingEntry.activityType}</p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Category</span>
                <p className="text-sm">{CPS_CATEGORY_LABELS[viewingEntry.category]}</p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Date</span>
                <p className="text-sm">{format(new Date(viewingEntry.date), 'MMM d, yyyy')}</p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Credits</span>
                <p className="text-sm font-semibold">{viewingEntry.credits}</p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Description</span>
                <p className="text-sm">{viewingEntry.description}</p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Supporting document / file</span>
                <p className="text-sm">
                  {viewingEntry.evidence?.startsWith('file:')
                    ? `File: ${viewingEntry.evidence.slice(5)}`
                    : viewingEntry.evidence
                      ? (
                          <a
                            href={viewingEntry.evidence}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline hover:no-underline"
                          >
                            {viewingEntry.evidence}
                          </a>
                        )
                      : 'None'}
                </p>
              </div>
              {viewingEntry.hodRemarks && (
                <div className="grid gap-2">
                  <span className="text-sm font-medium text-muted-foreground">HOD Remarks</span>
                  <p className="text-sm p-2 rounded-md bg-muted">{viewingEntry.hodRemarks}</p>
                </div>
              )}
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">HOD Approved</span>
                <p className="text-sm">
                  {viewingEntry.hodApprovedAt
                    ? format(new Date(viewingEntry.hodApprovedAt), 'MMM d, yyyy')
                    : '—'}
                </p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <Badge className={statusStyles[viewingEntry.status]}>
                  {APPROVAL_STATUS_LABELS[viewingEntry.status]}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingEntry(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
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
              {actionType === 'approve' ? 'Final Approval' : 'Reject Entry'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'This will grant final approval and the credits will be awarded.'
                : 'This entry will be rejected and both HOD and faculty will be notified.'}
            </DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="font-medium">{selectedEntry.activityType}</div>
                <div className="text-sm text-muted-foreground">{selectedEntry.description}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">{selectedEntry.credits} credits</Badge>
                  <Badge variant="outline">{selectedEntry.facultyName}</Badge>
                  <Badge variant="secondary">{selectedEntry.department}</Badge>
                </div>
                {selectedEntry.hodRemarks && (
                  <div className="mt-3 p-2 bg-background rounded text-sm">
                    <span className="font-medium">HOD Remarks:</span> {selectedEntry.hodRemarks}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Principal Remarks (Optional)
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
              onClick={confirmAction}
            >
              {actionType === 'approve' ? 'Grant Final Approval' : 'Reject Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrincipalApprovals;
