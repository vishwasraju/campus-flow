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
} from 'lucide-react';
import { CPSEntry, CPS_CATEGORY_LABELS } from '@/types/cps';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

const PrincipalApprovals = () => {
  const { getPendingPrincipalApprovals, updateEntry, entries } = useCPS();
  
  const [selectedEntry, setSelectedEntry] = useState<CPSEntry | null>(null);
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
                  <TableRow key={entry.id}>
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
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
