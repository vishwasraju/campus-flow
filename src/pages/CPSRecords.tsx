import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCPS } from '@/contexts/CPSContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CPSEntry, ApprovalStatus } from '@/types/cps';
import { toast } from 'sonner';
import { CheckCircle2, Clock, FileText, Award } from 'lucide-react';
import CPSSidebar from '@/components/cps/CPSSidebar';
import CPSEntryList from '@/components/cps/CPSEntryList';
import CPSEntryDetail from '@/components/cps/CPSEntryDetail';

const CPSRecords = () => {
  const { user } = useAuth();
  const { entries, updateEntry, deleteEntry } = useCPS();
  const [selectedEntry, setSelectedEntry] = useState<CPSEntry | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const myEntries = user ? entries.filter((e) => e.facultyId === user.id) : [];

  // Counts for sidebar
  const counts = useMemo(() => ({
    all: myEntries.length,
    draft: myEntries.filter((e) => e.status === 'draft').length,
    pending: myEntries.filter((e) => e.status === 'pending_hod' || e.status === 'pending_principal').length,
    approved: myEntries.filter((e) => e.status === 'approved').length,
    rejected: myEntries.filter((e) => e.status === 'rejected').length,
  }), [myEntries]);

  // Filter entries based on active filter
  const filteredEntries = useMemo(() => {
    switch (activeFilter) {
      case 'draft':
        return myEntries.filter((e) => e.status === 'draft');
      case 'pending':
        return myEntries.filter((e) => e.status === 'pending_hod' || e.status === 'pending_principal');
      case 'approved':
        return myEntries.filter((e) => e.status === 'approved');
      case 'rejected':
        return myEntries.filter((e) => e.status === 'rejected');
      case 'research':
      case 'academics':
      case 'industry':
      case 'placement':
        return myEntries.filter((e) => e.category === activeFilter);
      default:
        return myEntries;
    }
  }, [myEntries, activeFilter]);

  const handleSubmitDraft = (entry: CPSEntry) => {
    updateEntry(entry.id, {
      status: 'pending_hod',
      submittedAt: new Date().toISOString(),
    });
    toast.success('Entry submitted for approval');
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My CPS Records</h1>
        <p className="text-muted-foreground">View and manage your CPS credit submissions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Approved Credits</CardTitle>
            <div className="p-2 rounded-lg bg-green-100">
              <Award className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCredits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myEntries.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <div className="p-2 rounded-lg bg-amber-100">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <div className="p-2 rounded-lg bg-gray-100">
              <FileText className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.draft}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gmail-style Inbox Layout */}
      <div className="flex gap-4 min-h-[500px]">
        <CPSSidebar 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />

        <CPSEntryList
          entries={filteredEntries}
          selectedEntry={selectedEntry}
          onSelectEntry={setSelectedEntry}
          onSubmitDraft={handleSubmitDraft}
        />

        {selectedEntry && (
          <CPSEntryDetail
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
            onCancel={handleCancelEntry}
            canCancel={!!canCancelEntry}
          />
        )}
      </div>
    </div>
  );
};

export default CPSRecords;
