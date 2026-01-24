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
  CheckCircle2, 
  XCircle,
  Eye,
  Clock,
  FileText,
  User,
} from 'lucide-react';
import { CPSEntry, APPROVAL_STATUS_LABELS, CPS_CATEGORY_LABELS } from '@/types/cps';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

const HODApprovals = () => {
  const { user } = useAuth();
  const { getPendingHODApprovals, updateEntry, entries } = useCPS();
  
  const [selectedEntry, setSelectedEntry] = useState<CPSEntry | null>(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const pendingEntries = user ? getPendingHODApprovals(user.department) : [];
  
  // Get recently processed entries by this HOD
  const recentlyProcessed = entries.filter(
    (e) => 
      e.department === user?.department && 
      (e.status === 'pending_principal' || e.status === 'rejected') &&
      e.hodApprovedAt
  ).slice(0, 5);

  const handleAction = (entry: CPSEntry, action: 'approve' | 'reject') => {
    setSelectedEntry(entry);
    setActionType(action);
    setRemarks('');
  };

  const confirmAction = () => {
    if (!selectedEntry || !actionType) return;

    if (actionType === 'approve') {
      updateEntry(selectedEntry.id, {
        status: 'pending_principal',
        hodRemarks: remarks,
        hodApprovedAt: new Date().toISOString(),
      });
      toast.success('Entry approved and forwarded to Principal');
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
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">HOD Approvals</h1>
        <p className="text-muted-foreground">
          Review and approve CPS entries from your department faculty
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingEntries.length}</div>
            <p className="text-xs text-muted-foreground">Entries awaiting your approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Department</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.department}</div>
            <p className="text-xs text-muted-foreground">Your department</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recently Processed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentlyProcessed.length}</div>
            <p className="text-xs text-muted-foreground">Last 5 processed entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>CPS entries submitted by faculty in your department</CardDescription>
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
                  <TableHead>Submitted</TableHead>
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
                    <TableCell>
                      {entry.submittedAt && format(new Date(entry.submittedAt), 'MMM d, yyyy')}
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
              {actionType === 'approve' ? 'Approve Entry' : 'Reject Entry'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'This entry will be forwarded to the Principal for final approval.'
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
              onClick={confirmAction}
            >
              {actionType === 'approve' ? 'Approve & Forward' : 'Reject Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HODApprovals;
