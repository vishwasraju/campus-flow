import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle2, Clock, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface Complaint {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromDepartment: string;
  fromRole: string;
  toRole: 'hod' | 'principal';
  subject: string;
  message: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

const STORAGE_KEY = 'raise_complaints';

function loadComplaints(): Complaint[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveComplaints(complaints: Complaint[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

export default function Raise() {
  const { user, currentRole } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>(loadComplaints);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<'hod' | 'principal'>('hod');

  useEffect(() => {
    saveComplaints(complaints);
  }, [complaints]);

  const myComplaints = complaints.filter((c) => c.fromUserId === user?.id);

  // Complaints addressed TO this user's role (for review)
  const reviewComplaints = complaints.filter((c) => {
    if (currentRole === 'hod' && c.toRole === 'hod' && c.fromDepartment === user?.department) return true;
    if (currentRole === 'principal' && c.toRole === 'principal') return true;
    return false;
  });

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in both subject and message.');
      return;
    }
    const newComplaint: Complaint = {
      id: Date.now().toString(),
      fromUserId: user?.id || '',
      fromUserName: user?.name || '',
      fromDepartment: user?.department || '',
      fromRole: currentRole || '',
      toRole: currentRole === 'hod' ? 'principal' : target,
      subject: subject.trim(),
      message: message.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    setSubject('');
    setMessage('');
    toast.success('Complaint submitted successfully.');
  };

  const handleResolve = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: 'resolved' as const, resolvedAt: new Date().toISOString() } : c
      )
    );
    toast.success('Complaint marked as resolved.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Raise a Complaint</h1>
        <p className="text-muted-foreground">Submit issues or complaints and track their resolution.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Submit Complaint */}
        {(currentRole === 'faculty' || currentRole === 'hod') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                New Complaint
              </CardTitle>
              <CardDescription>
                {currentRole === 'faculty'
                  ? 'Raise a complaint to your HOD or Principal.'
                  : 'Raise a complaint to the Principal.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentRole === 'faculty' && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Complain To</label>
                  <Select value={target} onValueChange={(v) => setTarget(v as 'hod' | 'principal')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hod">Head of Department</SelectItem>
                      <SelectItem value="principal">Principal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Subject</label>
                <Input
                  placeholder="Brief subject of your complaint"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  maxLength={120}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Message</label>
                <Textarea
                  placeholder="Describe your issue in detail…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={1000}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                <Send className="h-4 w-4 mr-2" /> Submit Complaint
              </Button>
            </CardContent>
          </Card>
        )}

        {/* My Complaints */}
        <Card className={(currentRole === 'principal' && reviewComplaints.length > 0) ? 'lg:col-span-2' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              My Complaints
            </CardTitle>
            <CardDescription>Track the status of your submitted complaints.</CardDescription>
          </CardHeader>
          <CardContent>
            {myComplaints.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No complaints raised yet.</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {myComplaints.map((c) => (
                  <div key={c.id} className="border border-border rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-foreground">{c.subject}</span>
                      {c.status === 'resolved' ? (
                        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Resolved
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" /> Pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{c.message}</p>
                    <p className="text-xs text-muted-foreground">
                      To: <span className="capitalize font-medium">{c.toRole === 'hod' ? 'HOD' : 'Principal'}</span> · {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Section for HOD / Principal */}
      {(currentRole === 'hod' || currentRole === 'principal') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Review Complaints
            </CardTitle>
            <CardDescription>
              {currentRole === 'hod'
                ? 'Review and resolve complaints from your department faculty.'
                : 'Review and resolve complaints from faculty and HODs.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reviewComplaints.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No complaints to review.</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {reviewComplaints.map((c) => (
                  <div
                    key={c.id}
                    className="border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-foreground">{c.subject}</span>
                        {c.status === 'resolved' ? (
                          <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-xs">Resolved</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Pending</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{c.message}</p>
                      <p className="text-xs text-muted-foreground">
                        From: <span className="font-medium">{c.fromUserName}</span> ({c.fromDepartment}) · {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {c.status === 'pending' && (
                      <Button size="sm" variant="outline" onClick={() => handleResolve(c.id)} className="shrink-0">
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Mark Resolved
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
