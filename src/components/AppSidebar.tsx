import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardCheck, 
  Megaphone, 
  Calendar, 
  Clock, 
  CalendarDays,
  CheckSquare,
  BarChart3,
  GraduationCap,
  User,
  LogOut,
  CheckCircle2,
  Settings,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/auth';

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  iconColor?: string;
}

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, roles: ['faculty', 'hod', 'principal'], iconColor: 'text-blue-600 bg-blue-100' },
  { title: 'CPS Entry', url: '/cps/new', icon: FileText, roles: ['faculty', 'hod'], iconColor: 'text-green-600 bg-green-100' },
  { title: 'My CPS Records', url: '/cps/records', icon: ClipboardCheck, roles: ['faculty', 'hod'], iconColor: 'text-purple-600 bg-purple-100' },
  { title: 'Approvals', url: '/approvals/hod', icon: CheckCircle2, roles: ['hod'], iconColor: 'text-amber-600 bg-amber-100' },
];

const approvalNavItems: NavItem[] = [
  { title: 'Principal Approvals', url: '/approvals/principal', icon: ClipboardCheck, roles: ['principal'], iconColor: 'text-cyan-600 bg-cyan-100' },
];

const moduleNavItems: NavItem[] = [
  { title: 'Circulars', url: '/circulars', icon: Megaphone, roles: ['faculty', 'hod', 'principal'], iconColor: 'text-orange-600 bg-orange-100' },
  { title: 'Events', url: '/events', icon: Calendar, roles: ['faculty', 'hod', 'principal'], iconColor: 'text-pink-600 bg-pink-100' },
  { title: 'Leave Management', url: '/leave', icon: Clock, roles: ['faculty', 'hod', 'principal'], iconColor: 'text-teal-600 bg-teal-100' },
  { title: 'Timetable', url: '/timetable', icon: CalendarDays, roles: ['faculty', 'hod', 'principal'], iconColor: 'text-indigo-600 bg-indigo-100' },
  { title: 'Tasks', url: '/tasks', icon: CheckSquare, roles: ['faculty', 'hod', 'principal'], iconColor: 'text-rose-600 bg-rose-100' },
];

const reportNavItems: NavItem[] = [
  { title: 'Reports', url: '/reports', icon: BarChart3, roles: ['faculty', 'hod', 'principal'], iconColor: 'text-emerald-600 bg-emerald-100' },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, currentRole, logout } = useAuth();
  const collapsed = state === 'collapsed';

  const filterByRole = (items: NavItem[]) => {
    if (!currentRole) return [];
    return items.filter((item) => item.roles.includes(currentRole));
  };

  const isActive = (path: string) => location.pathname === path;

  const renderNavItems = (items: NavItem[]) => {
    const filteredItems = filterByRole(items);
    if (filteredItems.length === 0) return null;

    return filteredItems.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild isActive={isActive(item.url)}>
          <NavLink 
            to={item.url} 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          >
            <div className={`p-2 rounded-lg ${item.iconColor || 'text-muted-foreground bg-muted'}`}>
              <item.icon className="h-4 w-4" />
            </div>
            {!collapsed && <span className="text-sm">{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-lg">CPS</span>
              <span className="text-xs text-muted-foreground">College Platform</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">{renderNavItems(mainNavItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Approvals - Only for HOD/Principal */}
        {filterByRole(approvalNavItems).length > 0 && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
              Approvals
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">{renderNavItems(approvalNavItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Modules */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
            Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">{renderNavItems(moduleNavItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Reports */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
            Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">{renderNavItems(reportNavItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 h-auto py-3 px-3 hover:bg-sidebar-accent rounded-lg"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full text-primary-foreground">
                <User className="w-5 h-5" />
              </div>
              {!collapsed && (
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-foreground truncate">{user?.name}</div>
                  <div className="text-xs text-muted-foreground">{user?.designation || user?.collegeId}</div>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
