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
  ChevronDown,
  User,
  LogOut,
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
import { Badge } from '@/components/ui/badge';
import { ROLE_LABELS, UserRole } from '@/types/auth';

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, roles: ['faculty', 'hod', 'principal'] },
  { title: 'CPS Entry', url: '/cps/new', icon: FileText, roles: ['faculty', 'hod'] },
  { title: 'My CPS Records', url: '/cps/records', icon: ClipboardCheck, roles: ['faculty', 'hod'] },
];

const approvalNavItems: NavItem[] = [
  { title: 'HOD Approvals', url: '/approvals/hod', icon: ClipboardCheck, roles: ['hod'] },
  { title: 'Principal Approvals', url: '/approvals/principal', icon: ClipboardCheck, roles: ['principal'] },
];

const moduleNavItems: NavItem[] = [
  { title: 'Circulars', url: '/circulars', icon: Megaphone, roles: ['faculty', 'hod', 'principal'] },
  { title: 'Events', url: '/events', icon: Calendar, roles: ['faculty', 'hod', 'principal'] },
  { title: 'Leave Management', url: '/leave', icon: Clock, roles: ['faculty', 'hod', 'principal'] },
  { title: 'Timetable', url: '/timetable', icon: CalendarDays, roles: ['faculty', 'hod', 'principal'] },
  { title: 'Tasks', url: '/tasks', icon: CheckSquare, roles: ['faculty', 'hod', 'principal'] },
];

const reportNavItems: NavItem[] = [
  { title: 'Reports', url: '/reports', icon: BarChart3, roles: ['faculty', 'hod', 'principal'] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, currentRole, switchRole, logout } = useAuth();
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
            className="flex items-center gap-3"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <item.icon className="h-4 w-4" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-sidebar-primary rounded-lg">
            <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground">CPS</span>
              <span className="text-xs text-sidebar-foreground/70">College Platform</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(mainNavItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Approvals - Only for HOD/Principal */}
        {filterByRole(approvalNavItems).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60">Approvals</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderNavItems(approvalNavItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Modules */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(moduleNavItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Reports */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(reportNavItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 h-auto py-3 px-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-sidebar-accent rounded-full">
                <User className="w-4 h-4" />
              </div>
              {!collapsed && (
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium truncate">{user?.name}</div>
                  <div className="text-xs text-sidebar-foreground/60">{user?.collegeId}</div>
                </div>
              )}
              {!collapsed && <ChevronDown className="w-4 h-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name}</span>
                <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Role Switcher */}
            {user && user.roles.length > 1 && (
              <>
                <DropdownMenuLabel className="text-xs text-muted-foreground">Switch Role</DropdownMenuLabel>
                {user.roles.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => switchRole(role)}
                    className="flex items-center justify-between"
                  >
                    {ROLE_LABELS[role]}
                    {currentRole === role && (
                      <Badge variant="secondary" className="text-xs">Active</Badge>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
