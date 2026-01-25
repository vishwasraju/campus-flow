import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLeave } from '@/contexts/LeaveContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  LeaveType,
  LeaveStatus,
  LEAVE_TYPE_LABELS,
  LEAVE_STATUS_LABELS,
  LeaveEntry,
} from '@/types/leave';
import { format, differenceInDays, parseISO } from 'date-fns';
import { Calendar, Clock, CheckCircle2, XCircle, Send, User, TrendingUp, FileText } from 'lucide-react';
import { toast } from 'sonner';

const statusStyles: Record<LeaveStatus, string> = {
  pending_hod: 'bg-amber-100 text-amber-800 border-amber-200',
  pending_principal: 'bg-blue-100 text-blue-800 border-blue-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const Leave = () => {
  const { user, currentRole } = useAuth();
  const {
    addLeave,
    updateLeave,
    getLeavesByApplicant,
    getPendingHODLeaves,
    getPendingPrincipalLeaves,
  } = useLeave();

  const [leaveType, setLeaveType] = useState<LeaveType>('casual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedLeave, setSelectedLeave] = useState<LeaveEntry | null>(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const myLeaves = user ? getLeavesByApplicant(user.id) : [];
  const pendingHOD = user ? getPendingHODLeaves(user.department) : [];
  const pendingPrincipal = getPendingPrincipalLeaves();

  const canApply = currentRole === 'faculty' || currentRole === 'hod';
  const isHOD = currentRole === 'hod';
  const isPrincipal = currentRole === 'principal';

  const handleApply = () => {
    if (!user || !startDate || !endDate || !reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    if (end < start) {
      toast.error('End date must be on or after start date');
      return;
    }

    setIsSubmitting(true);
    const status: LeaveStatus = isHOD ? 'pending_principal' : 'pending_hod';
    addLeave({
      applicantId: user.id,
      applicantName: user.name,
      department: user.department,
      leaveType,
      startDate,
      endDate,
      reason: reason.trim(),
      status,
      appliedAt: new Date().toISOString(),
    });
    setLeaveType('casual');
    setStartDate('');
    setEndDate('');
    setReason('');
    setIsSubmitting(false);
    toast.success(
      status === 'pending_principal'
        ? 'Leave applied. Pending Principal approval.'
        : 'Leave applied. Pending HOD approval.'
    );
  };

  const handleApprovalAction = (leave: LeaveEntry, action: 'approve' | 'reject') => {
    setSelectedLeave(leave);
    setActionType(action);
    setRemarks('');
  };

  const confirmApproval = () => {
    if (!selectedLeave || !actionType || !user) return;

    if (actionType === 'approve') {
      if (selectedLeave.status === 'pending_hod') {
        // HOD approves faculty leave → forward to Principal for final approval
        updateLeave(selectedLeave.id, {
          status: 'pending_principal',
          remarks: remarks || undefined,
        });
        toast.success('Leave approved by HOD. Forwarded to Principal for final approval.');
      } else {
        // Principal approves HOD leave or final approval for faculty leave
        updateLeave(selectedLeave.id, {
          status: 'approved',
          approvedAt: new Date().toISOString(),
          approvedBy: 'principal',
          remarks: remarks || undefined,
        });
        toast.success('Leave approved');
      }
    } else {
      if (selectedLeave.status === 'pending_hod') {
        updateLeave(selectedLeave.id, {
          status: 'rejected',
          rejectedAt: new Date().toISOString(),
          rejectedBy: 'hod',
          remarks: remarks || undefined,
        });
        toast.success('Leave rejected');
      } else {
        updateLeave(selectedLeave.id, {
          status: 'rejected',
          rejectedAt: new Date().toISOString(),
          rejectedBy: 'principal',
          remarks: remarks || undefined,
        });
        toast.success('Leave rejected');
      }
    }

    setSelectedLeave(null);
    setActionType(null);
    setRemarks('');
  };

  const days = (s: string, e: string) =>
    differenceInDays(parseISO(e), parseISO(s)) + 1;

  // Calculate dashboard stats
  const myPending = myLeaves.filter(
    (l) => l.status === 'pending_hod' || l.status === 'pending_principal'
  ).length;
  const myApproved = myLeaves.filter((l) => l.status === 'approved').length;
  const myRejected = myLeaves.filter((l) => l.status === 'rejected').length;
  const totalDays = myLeaves
    .filter((l) => l.status === 'approved')
    .reduce((sum, l) => sum + days(l.startDate, l.endDate), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
        <p className="text-muted-foreground">
          Apply for leave and manage approvals. Faculty leaves require HOD and Principal approval; HOD leaves require Principal approval.
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myPending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myApproved}</div>
            <p className="text-xs text-muted-foreground">Total approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leave Days</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDays}</div>
            <p className="text-xs text-muted-foreground">Approved days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isHOD ? 'Faculty Pending' : isPrincipal ? 'HOD Pending' : 'Rejected'}
            </CardTitle>
            {isHOD || isPrincipal ? (
              <FileText className="h-4 w-4 text-blue-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isHOD ? pendingHOD.length : isPrincipal ? pendingPrincipal.length : myRejected}
            </div>
            <p className="text-xs text-muted-foreground">
              {isHOD
                ? 'Awaiting your approval'
                : isPrincipal
                  ? 'Awaiting your approval'
                  : 'Total rejected'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Apply for Leave - Faculty & HOD */}
      {canApply && (
        <Card>
          <CardHeader>
            <CardTitle>Apply for Leave</CardTitle>
            <CardDescription>
              {isHOD
                ? 'Your leave will be reviewed by the Principal.'
                : 'Your leave will be reviewed by your HOD.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>Leave Type</Label>
                <Select value={leaveType} onValueChange={(v) => setLeaveType(v as LeaveType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(LEAVE_TYPE_LABELS) as LeaveType[]).map((t) => (
                      <SelectItem key={t} value={t}>
                        {LEAVE_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label>Reason *</Label>
              <Textarea
                placeholder="Brief reason for leave..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
            <Button
              className="mt-4"
              onClick={handleApply}
              disabled={isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Application
            </Button>
          </CardContent>
        </Card>
      )}

      {/* My Leaves */}
      <Card>
        <CardHeader>
          <CardTitle>My Leaves</CardTitle>
          <CardDescription>Your leave applications and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {myLeaves.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No leave applications yet</p>
              {canApply && <p className="text-sm">Use the form above to apply</p>}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myLeaves
                  .slice()
                  .sort((a, b) => (b.appliedAt > a.appliedAt ? 1 : -1))
                  .map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>{LEAVE_TYPE_LABELS[l.leaveType]}</TableCell>
                      <TableCell>{format(parseISO(l.startDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{format(parseISO(l.endDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{days(l.startDate, l.endDate)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{l.reason}</TableCell>
                      <TableCell>
                        <Badge className={statusStyles[l.status]}>
                          {LEAVE_STATUS_LABELS[l.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(parseISO(l.appliedAt), 'MMM d, yyyy')}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* HOD: Faculty Leave Approvals */}
      {isHOD && (
        <Card>
          <CardHeader>
            <CardTitle>Faculty Leave Approvals</CardTitle>
            <CardDescription>Leave applications from your department faculty</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingHOD.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No pending faculty leave approvals</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faculty</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingHOD.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>
                        <div className="font-medium">{l.applicantName}</div>
                      </TableCell>
                      <TableCell>{LEAVE_TYPE_LABELS[l.leaveType]}</TableCell>
                      <TableCell>{format(parseISO(l.startDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{format(parseISO(l.endDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{days(l.startDate, l.endDate)}</TableCell>
                      <TableCell className="max-w-[180px] truncate">{l.reason}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprovalAction(l, 'approve')}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleApprovalAction(l, 'reject')}
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
      )}

      {/* Principal: HOD Leave Approvals */}
      {isPrincipal && (
        <Card>
          <CardHeader>
            <CardTitle>HOD Leave Approvals</CardTitle>
            <CardDescription>Leave applications from Heads of Department</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingPrincipal.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No pending HOD leave approvals</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>HOD</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPrincipal.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>
                        <div className="font-medium">{l.applicantName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{l.department}</Badge>
                      </TableCell>
                      <TableCell>{LEAVE_TYPE_LABELS[l.leaveType]}</TableCell>
                      <TableCell>{format(parseISO(l.startDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{format(parseISO(l.endDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{days(l.startDate, l.endDate)}</TableCell>
                      <TableCell className="max-w-[180px] truncate">{l.reason}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprovalAction(l, 'approve')}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleApprovalAction(l, 'reject')}
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
      )}

      {/* Approval / Rejection Dialog */}
      <Dialog
        open={!!selectedLeave}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLeave(null);
            setActionType(null);
            setRemarks('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Leave' : 'Reject Leave'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'This leave application will be approved.'
                : 'This leave application will be rejected.'}
            </DialogDescription>
          </DialogHeader>

          {selectedLeave && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  {selectedLeave.applicantName} · {selectedLeave.department}
                </div>
                <div className="mt-2 font-medium">{LEAVE_TYPE_LABELS[selectedLeave.leaveType]}</div>
                <div className="text-sm text-muted-foreground">
                  {format(parseISO(selectedLeave.startDate), 'MMM d, yyyy')} –{' '}
                  {format(parseISO(selectedLeave.endDate), 'MMM d, yyyy')} ({days(selectedLeave.startDate, selectedLeave.endDate)} days)
                </div>
                <p className="text-sm mt-1">{selectedLeave.reason}</p>
              </div>

              <div className="space-y-2">
                <Label>Remarks (optional)</Label>
                <Textarea
                  placeholder="Add any comments..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedLeave(null)}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'reject' ? 'destructive' : 'default'}
              onClick={confirmApproval}
            >
              {actionType === 'approve' ? 'Approve Leave' : 'Reject Leave'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leave;
