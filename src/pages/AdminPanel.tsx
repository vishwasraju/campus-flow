import { useState, useMemo } from 'react';
import { useCPS } from '@/contexts/CPSContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Filter,
    MoreHorizontal,
    XCircle,
    Trash2,
    Eye,
    User,
    Building2,
    FileText,
    Users,
    Mail,
    Briefcase,
    Key,
    ArrowLeft,
    Edit
} from 'lucide-react';
import { format } from 'date-fns';
import { CPSEntry, APPROVAL_STATUS_LABELS } from '@/types/cps';
import { User as UserType } from '@/types/auth';
import { toast } from 'sonner';
import CPSEntryDetail from '@/components/cps/CPSEntryDetail';

const AdminPanel = () => {
    const { entries, deleteEntry, deleteEntriesByFaculty } = useCPS();
    const { currentRole, getAdminUsers, updateUser, deleteUser } = useAuth();
    
    // Submissions State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedEntry, setSelectedEntry] = useState<CPSEntry | null>(null);

    // User Management State
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<(UserType & { password?: string }) | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<UserType & { password?: string }>>({});
    const [pinDialogState, setPinDialogState] = useState<{
        isOpen: boolean;
        type: 'edit' | 'delete' | null;
        user: (UserType & { password?: string }) | null;
    }>({ isOpen: false, type: null, user: null });
    const [pinInput, setPinInput] = useState('');
    
    // Detail View State
    const [selectedUserView, setSelectedUserView] = useState<(UserType & { password?: string }) | null>(null);

    const allUsers = getAdminUsers();

    // Refresh selectedUserView if allUsers changes (e.g., after an edit)
    const currentUserDetails = selectedUserView 
        ? allUsers.find(u => u.id === selectedUserView.id) 
        : null;

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
        let baseEntries = entries;
        if (currentUserDetails) {
            baseEntries = entries.filter(e => e.facultyId === currentUserDetails.id);
        }

        return baseEntries.filter(entry => {
            const matchesSearch =
                entry.activityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [entries, searchTerm, statusFilter, currentUserDetails]);

    const handleDeleteEntry = (id: string) => {
        if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
            deleteEntry(id);
            toast.success('Entry deleted successfully');
        }
    };

    const handleUserDeleteClick = (user: UserType & { password?: string }) => {
        setPinDialogState({ isOpen: true, type: 'delete', user });
        setPinInput('');
    };

    const executeUserDelete = (id: string) => {
        deleteUser(id);
        deleteEntriesByFaculty(id);
        toast.success('User and all associated entries deleted successfully');
        if (selectedUserView?.id === id) {
            setSelectedUserView(null);
        }
    };

    const handleEditUserClick = (user: UserType & { password?: string }) => {
        setPinDialogState({ isOpen: true, type: 'edit', user });
        setPinInput('');
    };

    const executeUserEdit = (user: UserType & { password?: string }) => {
        setEditingUser(user);
        setEditFormData({
            name: user.name,
            email: user.email,
            password: user.password,
            usn: user.usn,
            department: user.department,
            designation: user.designation
        });
    };

    const handlePinSubmit = () => {
        if (pinInput === '1234') {
            if (pinDialogState.type === 'delete' && pinDialogState.user) {
                executeUserDelete(pinDialogState.user.id);
            } else if (pinDialogState.type === 'edit' && pinDialogState.user) {
                executeUserEdit(pinDialogState.user);
            }
            setPinDialogState({ isOpen: false, type: null, user: null });
            setPinInput('');
        } else {
            toast.error('Incorrect PIN.');
            setPinInput('');
        }
    };

    const handleSaveUserEdit = () => {
        if (editingUser) {
            updateUser(editingUser.id, editFormData);
            toast.success('User details updated successfully');
            setEditingUser(null);
        }
    };

    const filteredUsers = useMemo(() => {
        return allUsers.filter(user => {
            const term = userSearchTerm.toLowerCase();
            return user.name.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term) ||
                user.usn.toLowerCase().includes(term) ||
                user.collegeId.toLowerCase().includes(term);
        });
    }, [allUsers, userSearchTerm]);

    const statusColors: Record<string, string> = {
        approved: 'bg-green-100 text-green-700',
        pending_hod: 'bg-amber-100 text-amber-700',
        pending_principal: 'bg-blue-100 text-blue-700',
        rejected: 'bg-red-100 text-red-700',
        draft: 'bg-gray-100 text-gray-700',
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {!currentUserDetails ? (
                // MAIN DIRECTORY VIEW
                <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">System Admin Panel</h1>
                            <p className="text-muted-foreground">Monitor and manage all users and CPS submissions across the institution</p>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                                    <p className="text-2xl font-bold">{allUsers.length}</p>
                                </div>
                            </CardContent>
                        </Card>
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
                                <CardTitle className="text-lg">User Directory</CardTitle>
                                <div className="relative w-full md:w-[300px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name, email, USN..."
                                        className="pl-9 bg-background"
                                        value={userSearchTerm}
                                        onChange={(e) => setUserSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead>User Information</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Identifiers</TableHead>
                                            <TableHead>Role/Dept</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((userObj) => (
                                            <TableRow 
                                                key={userObj.id} 
                                                className="hover:bg-muted/20 cursor-pointer"
                                                onClick={() => setSelectedUserView(userObj)}
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                                                            <img src={userObj.avatarUrl} alt={userObj.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold">{userObj.name}</div>
                                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Briefcase className="w-3 h-3" />
                                                                {userObj.designation}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm flex flex-col gap-1">
                                                        <span className="flex items-center gap-2">
                                                            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                                                            {userObj.email}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-2">
                                                            <Key className="w-3 h-3 text-muted-foreground shrink-0" />
                                                            {userObj.password ? '*'.repeat(userObj.password.length) : 'N/A'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <Badge variant="outline" className="w-fit font-mono text-[10px]">USN: {userObj.usn}</Badge>
                                                        <Badge variant="secondary" className="w-fit font-mono text-[10px]">ID: {userObj.collegeId}</Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1 mb-1">
                                                        <span className="text-sm font-medium">{userObj.department}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {userObj.roles.map(role => (
                                                            <Badge key={role} className="text-[10px] uppercase py-0 px-1 bg-primary/10 text-primary border-primary/20">
                                                                {role}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedUserView(userObj); }} className="gap-2 cursor-pointer">
                                                                <Eye className="h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditUserClick(userObj); }} className="gap-2 cursor-pointer">
                                                                <User className="h-4 w-4" /> Quick Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleUserDeleteClick(userObj); }} className="gap-2 cursor-pointer text-destructive">
                                                                <Trash2 className="h-4 w-4" /> Delete User
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredUsers.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                                    No users found matching "{userSearchTerm}".
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : (
                // USER DETAIL VIEW
                <div className="space-y-6 animate-fade-in">
                    <Button variant="ghost" onClick={() => setSelectedUserView(null)} className="gap-2 -ml-2 mb-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Directory
                    </Button>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted border-2 border-border">
                                <img src={currentUserDetails.avatarUrl} alt={currentUserDetails.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{currentUserDetails.name}</h1>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" /> {currentUserDetails.designation} • {currentUserDetails.department}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => handleEditUserClick(currentUserDetails)} className="gap-2">
                                <Edit className="w-4 h-4" /> Edit Profile
                            </Button>
                            <Button variant="destructive" onClick={() => handleUserDeleteClick(currentUserDetails)} className="gap-2">
                                <Trash2 className="w-4 h-4" /> Delete User
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Profile Details Card */}
                        <Card className="md:col-span-1 border-none shadow-md h-fit">
                            <CardHeader className="bg-muted/10 pb-4">
                                <CardTitle className="text-lg">Profile Details</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" /> {currentUserDetails.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Password</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Key className="w-4 h-4 text-muted-foreground" /> {currentUserDetails.password}
                                    </p>
                                </div>
                                <div className="border-t pt-4 mt-4">
                                    <p className="text-sm text-muted-foreground mb-1">University Seat Number (USN)</p>
                                    <p className="font-medium font-mono">{currentUserDetails.usn}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">College ID</p>
                                    <p className="font-medium font-mono">{currentUserDetails.collegeId}</p>
                                </div>
                                <div className="border-t pt-4 mt-4">
                                    <p className="text-sm text-muted-foreground mb-1">Assigned Roles</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {currentUserDetails.roles.map(role => (
                                            <Badge key={role} className="uppercase bg-primary/10 text-primary border-primary/20">
                                                {role}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Joined</p>
                                    <p className="font-medium">{format(new Date(currentUserDetails.createdAt), 'MMMM dd, yyyy')}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CPS Submissions Card */}
                        <Card className="md:col-span-2 border-none shadow-md overflow-hidden">
                            <CardHeader className="bg-muted/10 pb-4">
                                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">CPS Submissions</CardTitle>
                                        <CardDescription>All credit point entries submitted by {currentUserDetails.name}</CardDescription>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <div className="relative w-full md:w-48">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search default..."
                                                className="pl-9 bg-background"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="gap-2">
                                                    <Filter className="h-4 w-4" />
                                                    {statusFilter === 'all' ? 'All' : APPROVAL_STATUS_LABELS[statusFilter as keyof typeof APPROVAL_STATUS_LABELS]}
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
                                                <TableHead>Activity</TableHead>
                                                <TableHead>Credits</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredEntries.map((entry) => (
                                                <TableRow key={entry.id} className="hover:bg-muted/20">
                                                    <TableCell>
                                                        <div className="max-w-[200px] truncate font-medium" title={entry.activityType}>
                                                            {entry.activityType}
                                                        </div>
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
                                                                <DropdownMenuItem onClick={() => handleDeleteEntry(entry.id)} className="gap-2 cursor-pointer text-destructive">
                                                                    <Trash2 className="h-4 w-4" /> Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {filteredEntries.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                                        No entries found matching your filters.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {selectedEntry && (
                <CPSEntryDetail
                    entry={selectedEntry}
                    onClose={() => setSelectedEntry(null)}
                    onCancel={() => { }}
                    canCancel={false}
                />
            )}

            {/* Edit User Dialog */}
            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit User Details</DialogTitle>
                        <DialogDescription>
                            Make changes to {editingUser?.name}'s profile. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={editFormData.name || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={editFormData.email || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="text"
                                value={editFormData.password || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="usn">USN / Employee ID</Label>
                            <Input
                                id="usn"
                                value={editFormData.usn || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, usn: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="department">Department</Label>
                            <Input
                                id="department"
                                value={editFormData.department || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value as any })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="designation">Designation</Label>
                            <Input
                                id="designation"
                                value={editFormData.designation || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value as any })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                        <Button onClick={handleSaveUserEdit}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* PIN Dialog */}
            <Dialog open={pinDialogState.isOpen} onOpenChange={(open) => !open && setPinDialogState({ isOpen: false, type: null, user: null })}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Admin Authentication</DialogTitle>
                        <DialogDescription>
                            Please enter the 4-digit admin PIN to {pinDialogState.type} this user.
                            {pinDialogState.type === 'delete' && (
                                <span className="block mt-2 text-destructive font-medium">
                                    Warning: Deleting a user will also delete all their CPS entries permanently!
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="pin">Enter PIN</Label>
                            <Input
                                id="pin"
                                type="password"
                                maxLength={4}
                                value={pinInput}
                                onChange={(e) => setPinInput(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handlePinSubmit();
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPinDialogState({ isOpen: false, type: null, user: null })}>Cancel</Button>
                        <Button onClick={handlePinSubmit} variant={pinDialogState.type === 'delete' ? 'destructive' : 'default'} disabled={pinInput.length !== 4}>
                            Verify PIN
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPanel;
