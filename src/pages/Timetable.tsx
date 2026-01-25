import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTimetable } from '@/contexts/TimetableContext';
import { TimetableEditor } from '@/components/TimetableEditor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TimetableData } from '@/types/timetable';
import { Plus, Eye, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  pending_faculty: 'Pending Faculty Approval',
  pending_hod: 'Pending HOD Approval',
  approved: 'Approved',
};

const statusStyles: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending_faculty: 'bg-amber-100 text-amber-800',
  pending_hod: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
};

const Timetable = () => {
  const { user } = useAuth();
  const { getAllTimetables, createNewTimetable, loadTimetable } = useTimetable();
  const [timetables, setTimetables] = useState<TimetableData[]>([]);
  const [showEditorDialog, setShowEditorDialog] = useState(false);
  const [selectedTimetableId, setSelectedTimetableId] = useState<string | null>(null);

  useEffect(() => {
    setTimetables(getAllTimetables());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewTimetable = () => {
    createNewTimetable();
    setSelectedTimetableId(null);
    setShowEditorDialog(true);
  };

  const handleViewTimetable = (id: string) => {
    loadTimetable(id);
    setSelectedTimetableId(id);
    setShowEditorDialog(true);
  };

  const handleCloseEditor = () => {
    setShowEditorDialog(false);
    setSelectedTimetableId(null);
    // Refresh timetables list
    setTimetables(getAllTimetables());
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable Management</h1>
          <p className="text-muted-foreground">Create and manage academic timetables</p>
        </div>
        <Button onClick={handleNewTimetable} className="bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Timetable
        </Button>
      </div>

      {/* Timetables List */}
      <Card>
        <CardHeader>
          <CardTitle>Timetables</CardTitle>
          <CardDescription>All created timetables and their approval status</CardDescription>
        </CardHeader>
        <CardContent>
          {timetables.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No timetables created yet</p>
              <p className="text-sm">Click "New Timetable" to create one</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetables
                  .slice()
                  .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
                  .map((tt) => (
                    <TableRow key={tt.id}>
                      <TableCell className="font-medium">{tt.header.department}</TableCell>
                      <TableCell>{tt.header.semester}</TableCell>
                      <TableCell>{tt.header.section}</TableCell>
                      <TableCell>{tt.header.academicYear}</TableCell>
                      <TableCell>{tt.createdByName || 'N/A'}</TableCell>
                      <TableCell>
                        {tt.createdAt
                          ? format(new Date(tt.createdAt), 'MMM d, yyyy')
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusStyles[tt.status || 'draft']}>
                          {statusLabels[tt.status || 'draft']}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewTimetable(tt.id!)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Timetable Editor Dialog */}
      <Dialog open={showEditorDialog} onOpenChange={handleCloseEditor}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTimetableId ? 'View Timetable' : 'Create New Timetable'}
            </DialogTitle>
            <DialogDescription>
              {selectedTimetableId
                ? 'View and manage this timetable'
                : 'Fill in the timetable details and add subjects to each time slot'}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
            <TimetableEditor onClose={handleCloseEditor} onSave={handleCloseEditor} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Timetable;
