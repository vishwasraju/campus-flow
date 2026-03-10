import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TaskContext';
import { ADMIN_TASK_TYPES, AdminTaskType, TASK_STATUS_LABELS, TaskApprovalStatus } from '@/types/tasks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
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
  Award,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const statusStyles: Record<TaskApprovalStatus, string> = {
  pending_hod: 'bg-amber-100 text-amber-800 border-amber-200',
  pending_principal: 'bg-blue-100 text-blue-800 border-blue-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

function calcAccumulatedCredits(task: AdminTaskType, startYear: number): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  if (task.period === 'year') {
    const years = currentYear - startYear + 1;
    return Math.min(years * task.creditsPerPeriod, task.maxCredits);
  } else {
    // semester: ~2 semesters per year
    const totalSemesters = (currentYear - startYear) * 2 + (currentMonth >= 6 ? 2 : 1);
    return Math.min(totalSemesters * task.creditsPerPeriod, task.maxCredits);
  }
}

const Tasks = () => {
  const { user, currentRole } = useAuth();
  const {
    addAssignment,
    updateAssignment,
    getAssignmentsByUser,
    getPendingHODApprovals,
    getPendingPrincipalApprovals,
  } = useTasks();

  const [selectedTask, setSelectedTask] = useState<AdminTaskType | null>(null);
  const [approvalEntry, setApprovalEntry] = useState<any | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [remarks, setRemarks] = useState('');

  if (!user) return null;

  const myAssignments = getAssignmentsByUser(user.id);
  const isHOD = currentRole === 'hod';
  const isPrincipal = currentRole === 'principal';

  const hodPending = isHOD ? getPendingHODApprovals(user.department) : [];
  const principalPending = isPrincipal ? getPendingPrincipalApprovals() : [];

  const totalTaskCredits = myAssignments
    .filter((a) => a.status === 'approved')
    .reduce((sum, a) => {
      const taskType = ADMIN_TASK_TYPES.find((t) => t.id === a.taskTypeId);
      if (!taskType) return sum;
      return sum + calcAccumulatedCredits(taskType, a.startYear);
    }, 0);

  const handleApplyTask = (task: AdminTaskType) => {
    // Check if already applied
    const existing = myAssignments.find((a) => a.taskTypeId === task.id && a.status !== 'rejected');
    if (existing) {
      toast.error('You have already applied for this task');
      return;
    }

    const status: TaskApprovalStatus = isHOD ? 'pending_principal' : 'pending_hod';

    addAssignment({
      taskTypeId: task.id,
      userId: user.id,
      userName: user.name,
      department: user.department,
      status,
      assignedAt: new Date().toISOString(),
      accumulatedCredits: 0,
      startYear: new Date().getFullYear(),
    });

    toast.success(`Applied for "${task.title}". ${isHOD ? 'Sent to Principal for approval.' : 'Sent to HOD for approval.'}`);
    setSelectedTask(null);
  };

  const handleApproval = (entry: any, action: 'approve' | 'reject') => {
    setApprovalEntry(entry);
    setActionType(action);
    setRemarks('');
  };

  const confirmApproval = () => {
    if (!approvalEntry || !actionType) return;

    if (actionType === 'approve') {
      const taskType = ADMIN_TASK_TYPES.find((t) => t.id === approvalEntry.taskTypeId);
      const credits = taskType ? calcAccumulatedCredits(taskType, approvalEntry.startYear) : 0;

      updateAssignment(approvalEntry.id, {
        status: 'approved',
        approvedAt: new Date().toISOString(),
        remarks,
        accumulatedCredits: credits,
      });
      toast.success('Task approved successfully');
    } else {
      updateAssignment(approvalEntry.id, {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: isHOD ? 'hod' : 'principal',
        remarks,
      });
      toast.success('Task rejected');
    }

    setApprovalEntry(null);
    setActionType(null);
    setRemarks('');
  };

  const getMyTaskStatus = (taskId: string) => {
    return myAssignments.find((a) => a.taskTypeId === taskId && a.status !== 'rejected');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Administration Tasks</h1>
        <p className="text-muted-foreground">
          Select your administrative role/task to earn credit points automatically
        </p>
      </div>

      {/* My Task Credits Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Task Credits</CardTitle>
          <Award className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalTaskCredits.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Total accumulated administration credits</p>
        </CardContent>
      </Card>

      {/* Task Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {ADMIN_TASK_TYPES.map((task) => {
          const myStatus = getMyTaskStatus(task.id);
          const taskType = ADMIN_TASK_TYPES.find((t) => t.id === task.id)!;
          const currentCredits = myStatus && myStatus.status === 'approved'
            ? calcAccumulatedCredits(taskType, myStatus.startYear)
            : 0;

          return (
            <Card key={task.id} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                      {task.slNo}
                    </div>
                    <CardTitle className="text-base">{task.title}</CardTitle>
                  </div>
                  {myStatus && (
                    <Badge className={statusStyles[myStatus.status]}>
                      {TASK_STATUS_LABELS[myStatus.status]}
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-2 text-xs">
                  {task.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Credits</span>
                  <span className="font-semibold">
                    {task.creditsPerPeriod} / {task.period} (max {task.maxCredits})
                  </span>
                </div>

                {myStatus?.status === 'approved' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Accumulated</span>
                    <span className="font-bold text-green-600">{currentCredits.toFixed(2)} credits</span>
                  </div>
                )}

                {!myStatus ? (
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => setSelectedTask(task)}
                  >
                    <Briefcase className="w-3 h-3 mr-1" />
                    Apply for this Task
                  </Button>
                ) : myStatus.status === 'rejected' ? (
                  <p className="text-xs text-destructive">
                    Rejected{myStatus.remarks ? `: ${myStatus.remarks}` : ''}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* HOD Approvals Section */}
      {isHOD && hodPending.length > 0 && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle>Task Approvals (HOD)</CardTitle>
              </div>
              <CardDescription>
                Approve or reject administration task requests from your department
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {hodPending.map((entry) => {
                const taskType = ADMIN_TASK_TYPES.find((t) => t.id === entry.taskTypeId);
                if (!taskType) return null;
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{entry.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {taskType.slNo}. {taskType.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {taskType.creditsPerPeriod} credit/{taskType.period} · max {taskType.maxCredits}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproval(entry, 'approve')}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleApproval(entry, 'reject')}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}

      {/* Principal Approvals Section */}
      {isPrincipal && principalPending.length > 0 && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle>Task Approvals (Principal)</CardTitle>
              </div>
              <CardDescription>
                Approve or reject administration task requests from HODs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {principalPending.map((entry) => {
                const taskType = ADMIN_TASK_TYPES.find((t) => t.id === entry.taskTypeId);
                if (!taskType) return null;
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{entry.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {taskType.slNo}. {taskType.title} — {entry.department}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {taskType.creditsPerPeriod} credit/{taskType.period} · max {taskType.maxCredits}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproval(entry, 'approve')}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleApproval(entry, 'reject')}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}

      {/* Apply Confirmation Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Task</DialogTitle>
            <DialogDescription>
              Confirm you want to apply for this administration task. It will be sent for approval.
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="p-4 rounded-lg bg-muted space-y-2">
              <p className="font-medium">{selectedTask.slNo}. {selectedTask.title}</p>
              <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{selectedTask.creditsPerPeriod} credit/{selectedTask.period}</Badge>
                <Badge variant="outline">Max {selectedTask.maxCredits} credits</Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTask(null)}>Cancel</Button>
            <Button onClick={() => selectedTask && handleApplyTask(selectedTask)}>Confirm & Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Confirmation Dialog */}
      <Dialog
        open={!!approvalEntry}
        onOpenChange={(open) => {
          if (!open) {
            setApprovalEntry(null);
            setActionType(null);
            setRemarks('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Task' : 'Reject Task'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'Credits will be auto-calculated and accumulated annually.'
                : 'The faculty member will be notified of the rejection.'}
            </DialogDescription>
          </DialogHeader>
          {approvalEntry && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="font-medium">{approvalEntry.userName}</p>
                <p className="text-sm text-muted-foreground">
                  {ADMIN_TASK_TYPES.find((t) => t.id === approvalEntry.taskTypeId)?.title}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Remarks (Optional)</label>
                <Textarea
                  placeholder="Add comments..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalEntry(null)}>Cancel</Button>
            <Button
              variant={actionType === 'reject' ? 'destructive' : 'default'}
              onClick={confirmApproval}
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
