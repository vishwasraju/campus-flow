import { useState, useMemo } from 'react';
import { useCPS } from '@/contexts/CPSContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Trash2,
    Eye,
    ArrowUpDown,
    User,
    Building2,
    FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { CPSEntry, CPS_CATEGORY_LABELS, APPROVAL_STATUS_LABELS } from '@/types/cps';
import { toast } from 'sonner';
import CPSEntryDetail from '@/components/cps/CPSEntryDetail';

const AdminPanel = () => {
    const { entries, updateEntry, deleteEntry } = useCPS();
    const { currentRole } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedEntry, setSelectedEntry] = useState<CPSEntry | null>(null);

    // Security check - redirect or show error if not admin
    if (currentRole !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="p-4 rounded-full bg-red-100 mb-4">
                    <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                <p className="text-muted-foreground max-w-md">
                    You do not have permission to view the Admin Panel. This area is reserved for system administrators.
                </p>
            </div>
        );
    }

    const filteredEntries = useMemo(() => {
        return entries.filter(entry => {
            const matchesSearch =
                entry.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.activityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
            const matchesCategory = categoryFilter === 'all' || entry.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [entries, searchTerm, statusFilter, categoryFilter]);

    const handleStatusChange = (id: string, newStatus: CPSEntry['status']) => {
        updateEntry(id, { status: newStatus });
        toast.success(`Entry status updated to ${APPROVAL_STATUS_LABELS[newStatus]}`);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
            deleteEntry(id);
            toast.success('Entry deleted successfully');
        }
    };

    const statusColors: Record<string, string> = {
        approved: 'bg-green-100 text-green-700',
        pending_hod: 'bg-amber-100 text-amber-700',
        pending_principal: 'bg-blue-100 text-blue-700',
        rejected: 'bg-red-100 text-red-700',
        draft: 'bg-gray-100 text-gray-700',
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Admin Panel</h1>
                    <p className="text-muted-foreground">Monitor and manage all CPS credit submissions across the institution</p>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
                            <p className="text-2xl font-bold">{entries.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                            <MoreHorizontal className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                            <p className="text-2xl font-bold">{entries.filter(e => e.status.startsWith('pending')).length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-green-100 text-green-600">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Approved</p>
                            <p className="text-2xl font-bold">{entries.filter(e => e.status === 'approved').length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Departments</p>
                            <p className="text-2xl font-bold">{new Set(entries.map(e => e.department)).size}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-muted/10 pb-4">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                        <CardTitle className="text-lg">Management Console</CardTitle>
                        <div className="flex flex-wrap gap-2">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search faculty or activity..."
                                    className="pl-9 bg-background"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        <Filter className="h-4 w-4" />
                                        Status: {statusFilter === 'all' ? 'All' : APPROVAL_STATUS_LABELS[statusFilter as keyof typeof APPROVAL_STATUS_LABELS]}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Statuses</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter('approved')}>Approved</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter('pending_hod')}>Pending HOD</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter('pending_principal')}>Pending Principal</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>Rejected</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[200px]">Faculty Member</TableHead>
                                    <TableHead>Activity</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Credits</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEntries.map((entry) => (
                                    <TableRow key={entry.id} className="hover:bg-muted/20">
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{entry.facultyName}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase">{entry.facultyId}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[200px] truncate" title={entry.activityType}>
                                                {entry.activityType}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-mono text-[10px]">{entry.department}</Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold">{entry.credits.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge className={`${statusColors[entry.status]} border-none`}>
                                                {APPROVAL_STATUS_LABELS[entry.status]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {format(new Date(entry.date), 'MMM dd, yyyy')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => setSelectedEntry(entry)} className="gap-2 cursor-pointer">
                                                        <Eye className="h-4 w-4" /> View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(entry.id, 'approved')} className="gap-2 cursor-pointer text-green-600">
                                                        <CheckCircle2 className="h-4 w-4" /> Approve
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(entry.id, 'rejected')} className="gap-2 cursor-pointer text-red-600">
                                                        <XCircle className="h-4 w-4" /> Reject
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(entry.id)} className="gap-2 cursor-pointer text-destructive">
                                                        <Trash2 className="h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredEntries.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                            No entries found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {selectedEntry && (
                <CPSEntryDetail
                    entry={selectedEntry}
                    onClose={() => setSelectedEntry(null)}
                    onCancel={() => { }}
                    canCancel={false}
                />
            )}
        </div>
    );
};

export default AdminPanel;
