import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTimetable } from '@/contexts/TimetableContext';
import { DEPARTMENTS } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import { Day, TimetableCell, TimeSlot } from '@/types/timetable';
import { Download, Edit2, Save, Trash2, CheckCircle2, FileText } from 'lucide-react';
import { toast } from 'sonner';

const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface TimetableEditorProps {
  onClose?: () => void;
  onSave?: () => void;
}

export const TimetableEditor: React.FC<TimetableEditorProps> = ({ onClose, onSave }) => {
  const { user, currentRole } = useAuth();
  const {
    timetable,
    updateCell,
    updateHeader,
    addCell,
    deleteCell,
    submitForApproval,
    approveByFaculty,
    approveByHOD,
  } = useTimetable();
  const [editingCell, setEditingCell] = useState<TimetableCell | null>(null);
  const [editingHeader, setEditingHeader] = useState(false);
  const [showCellDialog, setShowCellDialog] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ day: Day; timeSlotId: string } | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const timetableRef = useRef<HTMLDivElement>(null);

  const hasUserApproved = user
    ? (timetable.facultyApprovals || []).some((a) => a.facultyId === user.id && a.approved)
    : false;

  const timetableStatus = timetable.status || 'draft';

  const canApproveAsFaculty =
    user &&
    currentRole === 'faculty' &&
    timetableStatus === 'pending_faculty' &&
    !hasUserApproved;

  // Helper function to check if departments match (handles both code and full name)
  const departmentsMatch = (userDept: string, timetableDept: string): boolean => {
    // Direct match
    if (userDept === timetableDept) return true;
    
    // Find department info for user's department (could be code or label)
    const userDeptInfo = DEPARTMENTS.find(d => d.value === userDept || d.label === userDept);
    // Find department info for timetable's department (could be code or label)
    const timetableDeptInfo = DEPARTMENTS.find(d => d.value === timetableDept || d.label === timetableDept);
    
    // If both are found and they refer to the same department (same value), they match
    if (userDeptInfo && timetableDeptInfo && userDeptInfo.value === timetableDeptInfo.value) {
      return true;
    }
    
    // Fallback: check if user's code matches timetable's label or vice versa
    if (userDeptInfo && userDeptInfo.label === timetableDept) return true;
    if (timetableDeptInfo && timetableDeptInfo.label === userDept) return true;
    
    return false;
  };

  const canApproveAsHOD =
    user &&
    currentRole === 'hod' &&
    timetableStatus === 'pending_hod' &&
    departmentsMatch(user.department, timetable.header.department);

  const isEditable = timetableStatus === 'draft';
  const showCreateButton = timetableStatus === 'draft' && user;

  const getCell = (day: Day, timeSlotId: string): TimetableCell | undefined => {
    return timetable.cells.find((c) => c.day === day && c.timeSlotId === timeSlotId);
  };

  const handleCellClick = (day: Day, timeSlotId: string) => {
    const existingCell = getCell(day, timeSlotId);
    if (existingCell) {
      setEditingCell({ ...existingCell });
      setSelectedCell(null);
      setShowCellDialog(true);
    } else {
      setSelectedCell({ day, timeSlotId });
      // Initialize editingCell with empty values for new cell
      setEditingCell({
        id: '',
        day,
        timeSlotId,
        subjectCode: '',
        subjectName: '',
        facultyName: '',
        batch: '',
        lab: '',
        room: '',
      });
      setShowCellDialog(true);
    }
  };

  const handleSaveCell = () => {
    if (!editingCell) return;

    // Check if this is an update or a new cell
    const existingCell = getCell(editingCell.day, editingCell.timeSlotId);
    
    if (existingCell && existingCell.id && editingCell.id && editingCell.id === existingCell.id) {
      // Update existing cell - use the editingCell's ID
      updateCell(editingCell.id, {
        subjectCode: editingCell.subjectCode || '',
        subjectName: editingCell.subjectName || '',
        facultyName: editingCell.facultyName || '',
        batch: editingCell.batch || '',
        lab: editingCell.lab || '',
        room: editingCell.room || '',
      });
      toast.success('Cell updated');
    } else {
      // Add new cell - check if editingCell has the required fields
      if (!editingCell.day || !editingCell.timeSlotId) {
        toast.error('Invalid cell data');
        return;
      }
      
      // Check if there's already a cell at this position (shouldn't happen, but just in case)
      if (existingCell) {
        // Update the existing cell instead
        updateCell(existingCell.id, {
          subjectCode: editingCell.subjectCode || '',
          subjectName: editingCell.subjectName || '',
          facultyName: editingCell.facultyName || '',
          batch: editingCell.batch || '',
          lab: editingCell.lab || '',
          room: editingCell.room || '',
        });
        toast.success('Cell updated');
      } else {
        // Add new cell
        const newCell: Omit<TimetableCell, 'id'> = {
          day: editingCell.day,
          timeSlotId: editingCell.timeSlotId,
          subjectCode: editingCell.subjectCode || '',
          subjectName: editingCell.subjectName || '',
          facultyName: editingCell.facultyName || '',
          batch: editingCell.batch || '',
          lab: editingCell.lab || '',
          room: editingCell.room || '',
        };
        addCell(newCell);
        toast.success('Cell added');
      }
    }
    
    setEditingCell(null);
    setSelectedCell(null);
    setShowCellDialog(false);
  };

  const handleDeleteCell = () => {
    if (editingCell) {
      deleteCell(editingCell.id);
      toast.success('Cell deleted');
      setEditingCell(null);
      setShowCellDialog(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getTimeSlotIndex = (timeSlotId: string): number => {
    return timetable.timeSlots.findIndex((ts) => ts.id === timeSlotId);
  };

  const isBreakOrLunch = (timeSlot: TimeSlot): boolean => {
    return timeSlot.isBreak || timeSlot.isLunch || false;
  };

  const getGridColumn = (timeSlotId: string): number => {
    return getTimeSlotIndex(timeSlotId) + 2;
  };

  const getGridRow = (day: Day): number => {
    return DAYS.indexOf(day) + 2;
  };

  const generateSubjectDetails = () => {
    const subjectMap = new Map<string, { name: string; faculty: string }>();
    timetable.cells.forEach((cell) => {
      if (cell.subjectCode && cell.subjectName) {
        if (!subjectMap.has(cell.subjectCode)) {
          subjectMap.set(cell.subjectCode, {
            name: cell.subjectName,
            faculty: cell.facultyName || '',
          });
        }
      }
    });

    return Array.from(subjectMap.entries()).map(([code, data]) => ({
      subjectCode: code,
      subjectName: data.name,
      facultyName: data.faculty,
    }));
  };

  const subjectDetails = timetable.subjectDetails.length > 0
    ? timetable.subjectDetails
    : generateSubjectDetails();

  const handleCreateTimetable = () => {
    if (!user) {
      toast.error('Please login to create timetable');
      return;
    }
    if (timetable.cells.length === 0) {
      toast.error('Please add at least one subject to the timetable');
      return;
    }
    submitForApproval(user.id, user.name);
    toast.success('Timetable submitted for faculty approval');
    onSave?.();
  };

  const handleFacultyApproval = () => {
    if (!user) return;
    approveByFaculty(user.id, user.name, approvalRemarks || undefined);
    setShowApprovalDialog(false);
    setApprovalRemarks('');
    toast.success('Timetable approved by faculty');
  };

  const handleHODApproval = () => {
    if (!user) return;
    approveByHOD(user.id, approvalRemarks || undefined);
    setShowApprovalDialog(false);
    setApprovalRemarks('');
    toast.success('Timetable approved by HOD');
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          {timetableStatus !== 'draft' && (
            <Badge className={`${timetableStatus === 'pending_faculty' ? 'bg-amber-100 text-amber-800' : timetableStatus === 'pending_hod' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
              {timetableStatus === 'pending_faculty' ? 'Pending Faculty Approval' : timetableStatus === 'pending_hod' ? 'Pending HOD Approval' : 'Approved'}
            </Badge>
          )}
          {showCreateButton && (
            <Button onClick={handleCreateTimetable} className="bg-primary" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Create Timetable
            </Button>
          )}
          {canApproveAsFaculty && (
            <Button onClick={() => setShowApprovalDialog(true)} variant="outline" size="sm">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve as Faculty
            </Button>
          )}
          {canApproveAsHOD && (
            <Button onClick={() => setShowApprovalDialog(true)} variant="outline" size="sm">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve as HOD
            </Button>
          )}
          {isEditable && (
            <Button variant="outline" onClick={() => setEditingHeader(true)} size="sm">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Header
            </Button>
          )}
          <Button onClick={handlePrint} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Timetable */}
      <div ref={timetableRef} className="bg-white print:p-8">
        {/* Header Section */}
        <div className="text-center mb-6 print:mb-4">
          <h1 className="text-2xl font-bold mb-1">{timetable.header.collegeName}</h1>
          {timetable.header.accreditation && (
            <p className="text-sm text-muted-foreground mb-2">{timetable.header.accreditation}</p>
          )}
          <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
            <div>
              <span className="font-semibold">Department:</span> {timetable.header.department}
            </div>
            <div>
              <span className="font-semibold">Semester:</span> {timetable.header.semester}
            </div>
            <div>
              <span className="font-semibold">Section:</span> {timetable.header.section}
            </div>
            <div>
              <span className="font-semibold">Room:</span> {timetable.header.roomNumber}
            </div>
            <div>
              <span className="font-semibold">Academic Year:</span> {timetable.header.academicYear}
            </div>
            <div>
              <span className="font-semibold">Version:</span> {timetable.header.version}
            </div>
            <div className="col-span-2">
              <span className="font-semibold">W.E.F:</span> {timetable.header.wef}
            </div>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="border-2 border-gray-800">
          <div
            className="grid gap-0"
            style={{
              gridTemplateColumns: `120px repeat(${timetable.timeSlots.length}, minmax(120px, 1fr))`,
              gridTemplateRows: `40px repeat(${DAYS.length}, minmax(80px, auto))`,
            }}
          >
            {/* Empty corner */}
            <div className="bg-gray-800 text-white font-bold p-2 border-r-2 border-b-2 border-gray-800 flex items-center justify-center">
              DAY / TIME
            </div>

            {/* Time slots header */}
            {timetable.timeSlots.map((timeSlot) => (
              <div
                key={timeSlot.id}
                className={`font-bold p-2 border-r-2 border-b-2 border-gray-800 flex items-center justify-center text-xs ${
                  isBreakOrLunch(timeSlot)
                    ? 'bg-amber-100 text-gray-800'
                    : 'bg-gray-800 text-white'
                }`}
                style={{
                  writingMode: isBreakOrLunch(timeSlot) ? 'vertical-rl' : 'horizontal-tb',
                  textOrientation: isBreakOrLunch(timeSlot) ? 'mixed' : 'mixed',
                }}
              >
                {timeSlot.label}
              </div>
            ))}

            {/* Days and cells */}
            {DAYS.map((day, dayIndex) => (
              <React.Fragment key={day}>
                {/* Day label */}
                <div className="bg-gray-200 font-bold p-2 border-r-2 border-b-2 border-gray-800 flex items-center justify-center">
                  {day}
                </div>

                {/* Cells for each time slot */}
                {timetable.timeSlots.map((timeSlot) => {
                  const cell = getCell(day, timeSlot.id);
                  const isSpecial = isBreakOrLunch(timeSlot);

                  if (isSpecial) {
                    if (dayIndex === 0) {
                      return (
                        <div
                          key={`${day}-${timeSlot.id}`}
                          className="bg-amber-50 border-r-2 border-b-2 border-gray-800 flex items-center justify-center p-2"
                          style={{
                            gridColumn: getGridColumn(timeSlot.id),
                            gridRow: `${getGridRow(day)} / span ${DAYS.length}`,
                          }}
                        >
                          <span className="font-bold text-gray-700 text-sm" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                            {timeSlot.label}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }

                  return (
                    <div
                      key={`${day}-${timeSlot.id}`}
                      onClick={() => isEditable && handleCellClick(day, timeSlot.id)}
                      className={`border-r-2 border-b-2 border-gray-300 p-2 min-h-[80px] transition-colors print:cursor-default ${
                        isEditable ? 'cursor-pointer hover:bg-blue-50' : 'cursor-default'
                      }`}
                      style={{
                        gridColumn: getGridColumn(timeSlot.id),
                        gridRow: getGridRow(day),
                      }}
                    >
                      {cell ? (
                        <div className="text-xs space-y-1">
                          {cell.subjectCode && (
                            <div className="font-semibold text-gray-600">
                              [{cell.subjectCode}]
                            </div>
                          )}
                          {cell.subjectName && (
                            <div className="font-medium">{cell.subjectName}</div>
                          )}
                          {cell.batch && (
                            <div className="text-gray-500">Batch: {cell.batch}</div>
                          )}
                          {cell.facultyName && (
                            <div className="text-gray-600 font-semibold">{cell.facultyName}</div>
                          )}
                          {(cell.lab || cell.room) && (
                            <div className="text-gray-500 text-[10px]">
                              {cell.lab && `Lab: ${cell.lab}`}
                              {cell.lab && cell.room && ' | '}
                              {cell.room && `Room: ${cell.room}`}
                            </div>
                          )}
                        </div>
                      ) : (
                        isEditable && (
                          <div className="text-gray-400 text-xs flex items-center justify-center h-full print:hidden">
                            Click to add
                          </div>
                        )
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Subject Details Table */}
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-2">Subject & Faculty Details</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject Code</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Faculty Name</TableHead>
                <TableHead>Lab In-charge</TableHead>
                <TableHead>Mentor / Class Teacher</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjectDetails.length > 0 ? (
                subjectDetails.map((subj, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{subj.subjectCode}</TableCell>
                    <TableCell>{subj.subjectName}</TableCell>
                    <TableCell>{subj.facultyName}</TableCell>
                    <TableCell>{subj.labIncharge || '-'}</TableCell>
                    <TableCell>{subj.mentor || subj.classTeacher || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No subjects added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer with Signatures */}
        <div className="mt-8 grid grid-cols-3 gap-8 print:mt-6">
          <div className="text-center">
            <div className="border-t-2 border-gray-800 pt-2 mt-12">
              <div className="font-semibold">Timetable Coordinator</div>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-gray-800 pt-2 mt-12">
              <div className="font-semibold">Head of Department</div>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-gray-800 pt-2 mt-12">
              <div className="font-semibold">Principal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Cell Dialog */}
      <Dialog open={showCellDialog} onOpenChange={setShowCellDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCell ? 'Edit Cell' : 'Add Cell'}
            </DialogTitle>
            <DialogDescription>
              {selectedCell && `Add subject for ${selectedCell.day} at ${timetable.timeSlots.find(ts => ts.id === selectedCell.timeSlotId)?.label}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject Code</Label>
              <Input
                value={editingCell?.subjectCode || ''}
                onChange={(e) => {
                  if (editingCell) {
                    setEditingCell({ ...editingCell, subjectCode: e.target.value });
                  }
                }}
                placeholder="e.g., CS301"
              />
            </div>

            <div className="space-y-2">
              <Label>Subject Name</Label>
              <Input
                value={editingCell?.subjectName || ''}
                onChange={(e) => {
                  if (editingCell) {
                    setEditingCell({ ...editingCell, subjectName: e.target.value });
                  }
                }}
                placeholder="e.g., Database Management Systems"
              />
            </div>

            <div className="space-y-2">
              <Label>Faculty Name</Label>
              <Input
                value={editingCell?.facultyName || ''}
                onChange={(e) => {
                  if (editingCell) {
                    setEditingCell({ ...editingCell, facultyName: e.target.value });
                  }
                }}
                placeholder="e.g., Dr. John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Batch</Label>
                <Input
                  value={editingCell?.batch || ''}
                  onChange={(e) => {
                    if (editingCell) {
                      setEditingCell({ ...editingCell, batch: e.target.value });
                    }
                  }}
                  placeholder="e.g., A1, B1"
                />
              </div>

              <div className="space-y-2">
                <Label>Lab / Room</Label>
                <Input
                  value={editingCell?.lab || editingCell?.room || ''}
                  onChange={(e) => {
                    if (editingCell) {
                      setEditingCell({ ...editingCell, lab: e.target.value, room: e.target.value });
                    }
                  }}
                  placeholder="e.g., Lab-101"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            {editingCell && (
              <Button variant="destructive" onClick={handleDeleteCell}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowCellDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCell}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Header Dialog */}
      <Dialog open={editingHeader} onOpenChange={setEditingHeader}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Timetable Header</DialogTitle>
            <DialogDescription>Update timetable header information</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>College Name</Label>
              <Input
                value={timetable.header.collegeName}
                onChange={(e) => updateHeader({ collegeName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Accreditation (Optional)</Label>
              <Input
                value={timetable.header.accreditation || ''}
                onChange={(e) => updateHeader({ accreditation: e.target.value })}
                placeholder="e.g., NAAC Accredited"
              />
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Input
                value={timetable.header.department}
                onChange={(e) => updateHeader({ department: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <Input
                value={timetable.header.semester}
                onChange={(e) => updateHeader({ semester: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Section</Label>
              <Input
                value={timetable.header.section}
                onChange={(e) => updateHeader({ section: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Room Number</Label>
              <Input
                value={timetable.header.roomNumber}
                onChange={(e) => updateHeader({ roomNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Input
                value={timetable.header.academicYear}
                onChange={(e) => updateHeader({ academicYear: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Version</Label>
              <Input
                value={timetable.header.version}
                onChange={(e) => updateHeader({ version: e.target.value })}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>W.E.F (With Effect From)</Label>
              <Input
                value={timetable.header.wef}
                onChange={(e) => updateHeader({ wef: e.target.value })}
                placeholder="DD-MM-YYYY"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingHeader(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {canApproveAsHOD ? 'Approve as HOD' : 'Approve as Faculty'}
            </DialogTitle>
            <DialogDescription>
              {canApproveAsHOD
                ? 'This will grant final approval to the timetable.'
                : 'Your approval will be recorded. After all faculty approve, it will be sent to HOD.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="font-medium">{timetable.header.department}</div>
              <div className="text-sm text-muted-foreground">
                Semester {timetable.header.semester} - Section {timetable.header.section}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Created by: {timetable.createdByName || 'N/A'}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Remarks (Optional)</Label>
              <Textarea
                placeholder="Add any comments or feedback..."
                value={approvalRemarks}
                onChange={(e) => setApprovalRemarks(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={canApproveAsHOD ? handleHODApproval : handleFacultyApproval}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {canApproveAsHOD ? 'Approve as HOD' : 'Approve as Faculty'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
