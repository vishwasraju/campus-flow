import { cn } from '@/lib/utils';
import { 
  Inbox, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ChevronDown,
  Tag
} from 'lucide-react';
import { ApprovalStatus } from '@/types/cps';

interface FilterItem {
  id: string;
  label: string;
  icon: React.ElementType;
  count: number;
  color?: string;
}

interface CPSSidebarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: {
    all: number;
    draft: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

const CPSSidebar = ({ activeFilter, onFilterChange, counts }: CPSSidebarProps) => {
  const filters: FilterItem[] = [
    { id: 'all', label: 'All Entries', icon: Inbox, count: counts.all, color: 'text-red-500 bg-red-100' },
    { id: 'draft', label: 'Drafts', icon: FileText, count: counts.draft },
    { id: 'pending', label: 'Pending', icon: Clock, count: counts.pending, color: 'text-amber-600 bg-amber-100' },
    { id: 'approved', label: 'Approved', icon: CheckCircle2, count: counts.approved, color: 'text-green-600 bg-green-100' },
    { id: 'rejected', label: 'Rejected', icon: XCircle, count: counts.rejected, color: 'text-red-600 bg-red-100' },
  ];

  const categories = [
    { id: 'research', label: 'Research', color: 'bg-purple-500' },
    { id: 'academics', label: 'Academics', color: 'bg-cyan-500' },
    { id: 'industry', label: 'Industry', color: 'bg-orange-500' },
    { id: 'placement', label: 'Placement', color: 'bg-green-500' },
  ];

  return (
    <div className="py-4">
      <nav className="space-y-0.5 px-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-7 h-7 rounded-md",
                isActive && "bg-primary/10"
              )}>
                <Icon className={cn(
                  "h-4 w-4",
                  filter.id === 'all' && "text-primary",
                  filter.id === 'draft' && "text-muted-foreground",
                  filter.id === 'pending' && "text-amber-500",
                  filter.id === 'approved' && "text-green-500",
                  filter.id === 'rejected' && "text-red-500"
                )} />
              </div>
              <span className="flex-1 text-left">{filter.label}</span>
              {filter.count > 0 && (
                <span className={cn(
                  "min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs",
                  isActive 
                    ? "bg-primary text-primary-foreground font-semibold" 
                    : "bg-muted-foreground/10 text-muted-foreground"
                )}>
                  {filter.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 pt-4 mx-2 border-t">
        <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Tag className="h-3.5 w-3.5" />
          <span>Categories</span>
        </div>
        <div className="mt-1 space-y-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange(cat.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                activeFilter === cat.id
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className={cn("w-3 h-3 rounded-full shadow-sm", cat.color)} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CPSSidebar;
