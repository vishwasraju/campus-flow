import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCPS } from '@/contexts/CPSContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Eye,
  Send,
  XCircle,
} from 'lucide-react';
import { CPSEntry, APPROVAL_STATUS_LABELS, CPS_CATEGORY_LABELS, ApprovalStatus } from '@/types/cps';
import { format } from 'date-fns';
import { toast } from 'sonner';

const statusStyles: Record<ApprovalStatus, string> = {
  draft: 'bg-secondary text-secondary-foreground',
  pending_hod: 'bg-amber-100 text-amber-800 border-amber-200',
  pending_principal: 'bg-blue-100 text-blue-800 border-blue-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const CPSRecords = () => {
  const { user } = useAuth();
  const { entries, updateEntry, deleteEntry } = useCPS();
  const [selectedEntry, setSelectedEntry] = useState<CPSEntry | null>(null);

  const myEntries = user ? entries.filter((e) => e.facultyId === user.id) : [];

  const filterByStatus = (status: ApprovalStatus | 'all'): CPSEntry[] => {
    if (status === 'all') return myEntries;
    return myEntries.filter((e) => e.status === status);
  };

  const handleSubmitDraft = (entry: CPSEntry) => {
    updateEntry(entry.id, {
      status: 'pending_hod',
      submittedAt: new Date().toISOString(),
    });
  };

  const handleCancelEntry = () => {
    if (!selectedEntry) return;
    deleteEntry(selectedEntry.id);
    setSelectedEntry(null);
    toast.success('Entry cancelled');
  };

  const canCancelEntry =
    user &&
    selectedEntry &&
    selectedEntry.facultyId === user.id &&
    (['draft', 'pending_hod', 'pending_principal'] as ApprovalStatus[]).includes(selectedEntry.status);

  const totalCredits = myEntries
    .filter((e) => e.status === 'approved')
    .reduce((sum, e) => sum + e.credits, 0);

  const pendingCount = myEntries.filter(
    (e) => e.status === 'pending_hod' || e.status === 'pending_principal'
  ).length;

  const draftCount = myEntries.filter((e) => e.status === 'draft').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My CPS Records</h1>
        <p className="text-muted-foreground">View and manage your CPS credit submissions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Approved Credits</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-cps-placement" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCredits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myEntries.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>CPS Entries</CardTitle>
          <CardDescription>All your submitted and draft entries</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({myEntries.length})</TabsTrigger>
              <TabsTrigger value="draft">Drafts ({draftCount})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            {['all', 'draft', 'pending', 'approved', 'rejected'].map((tab) => {
              let filtered: CPSEntry[];
              if (tab === 'pending') {
                filtered = myEntries.filter(
                  (e) => e.status === 'pending_hod' || e.status === 'pending_principal'
                );
              } else if (tab === 'all') {
                filtered = myEntries;
              } else {
                filtered = filterByStatus(tab as ApprovalStatus);
              }

              return (
                <TabsContent key={tab} value={tab}>
                  {filtered.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No entries found</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Activity</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Credits</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((entry) => (
                          <TableRow key={entry.id}>
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
                              <Badge className={statusStyles[entry.status]}>
                                {APPROVAL_STATUS_LABELS[entry.status]}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {entry.status === 'draft' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleSubmitDraft(entry)}
                                  >
                                    <Send className="w-3 h-3 mr-1" />
                                    Submit
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedEntry(entry)}
                                  aria-label="View details"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>

      {/* View details dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
            <DialogDescription>View and manage this CPS entry</DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Activity</span>
                <p className="text-sm">{selectedEntry.activityType}</p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Category</span>
                <p className="text-sm">{CPS_CATEGORY_LABELS[selectedEntry.category]}</p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Date</span>
                <p className="text-sm">{format(new Date(selectedEntry.date), 'MMM d, yyyy')}</p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Credits</span>
                <p className="text-sm font-semibold">{selectedEntry.credits}</p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Description</span>
                <p className="text-sm">{selectedEntry.description}</p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Supporting document / file</span>
                <p className="text-sm">
                  {selectedEntry.evidence?.startsWith('file:')
                    ? `File: ${selectedEntry.evidence.slice(5)}`
                    : selectedEntry.evidence
                      ? (
                          <a
                            href={selectedEntry.evidence}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline hover:no-underline"
                          >
                            {selectedEntry.evidence}
                          </a>
                        )
                      : 'None'}
                </p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <Badge className={statusStyles[selectedEntry.status]}>
                  {APPROVAL_STATUS_LABELS[selectedEntry.status]}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEntry(null)}>
              Close
            </Button>
            {canCancelEntry && (
              <Button variant="destructive" onClick={handleCancelEntry}>
                <XCircle className="w-4 h-4 mr-2" />
                Cancel entry
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CPSRecords;
