import { ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Badge } from '@/components/ui/badge';
import { ROLE_LABELS } from '@/types/auth';
import { Separator } from '@/components/ui/separator';
import { Bell, Search, CheckCheck, FileText, Megaphone, Clock, AlertTriangle, Info, CheckCircle2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/mode-toggle';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface DashboardLayoutProps {
  children: ReactNode;
}

const notifIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  cps: FileText,
  circular: Megaphone,
  leave: Clock,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
};

const notifColor: Record<string, string> = {
  cps: 'text-primary bg-primary/10',
  circular: 'text-orange-500 bg-orange-500/10',
  leave: 'text-teal-500 bg-teal-500/10',
  warning: 'text-amber-500 bg-amber-500/10',
  info: 'text-blue-500 bg-blue-500/10',
  success: 'text-green-500 bg-green-500/10',
};

function NotificationItem({ notification, onRead, onNavigate }: { notification: Notification; onRead: (id: string) => void; onNavigate?: (link: string) => void }) {
  const Icon = notifIcon[notification.type] || Info;
  const color = notifColor[notification.type] || notifColor.info;

  return (
    <button
      className={cn(
        'w-full text-left flex gap-3 px-4 py-3 hover:bg-accent/50 transition-colors border-b border-border last:border-0',
        !notification.read && 'bg-accent/30'
      )}
      onClick={() => {
        onRead(notification.id);
        if (notification.link && onNavigate) onNavigate(notification.link);
      }}
    >
      <div className={cn('p-2 rounded-lg shrink-0 mt-0.5', color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn('text-sm font-medium truncate', !notification.read && 'text-foreground')}>{notification.title}</p>
          {!notification.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{notification.message}</p>
        <p className="text-[10px] text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>
    </button>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, user, currentRole } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {/* Top Header */}
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 shadow-sm">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-6" />

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-9 h-10 bg-background border-border"
                />
              </div>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-96 p-0">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <div className="flex items-center gap-1">
                      {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={markAllAsRead}>
                          <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                        </Button>
                      )}
                      {notifications.length > 0 && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground" onClick={clearAll}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <ScrollArea className="max-h-[400px]">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                        <Bell className="h-8 w-8 mb-2 opacity-40" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <NotificationItem
                          key={n.id}
                          notification={n}
                          onRead={markAsRead}
                          onNavigate={(link) => navigate(link)}
                        />
                      ))
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>
              <Separator orientation="vertical" className="h-6" />
              {currentRole && (
                <Badge variant="secondary" className="font-normal py-1 px-3">
                  {ROLE_LABELS[currentRole]}
                </Badge>
              )}
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.department}
              </span>
              <ModeToggle />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-background">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
