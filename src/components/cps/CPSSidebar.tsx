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
    <div className="w-56 flex-shrink-0 pr-4">
      <nav className="space-y-1">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-r-full text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-100 text-blue-800" 
                  : "text-foreground/70 hover:bg-muted"
              )}
            >
              <Icon className={cn(
                "h-4 w-4",
                filter.id === 'all' && "text-red-500",
                filter.id === 'pending' && "text-amber-500",
                filter.id === 'approved' && "text-green-500",
                filter.id === 'rejected' && "text-red-500"
              )} />
              <span className="flex-1 text-left">{filter.label}</span>
              {filter.count > 0 && (
                <span className={cn(
                  "text-xs",
                  isActive ? "font-semibold" : "text-muted-foreground"
                )}>
                  {filter.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 pt-4 border-t">
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
          <ChevronDown className="h-4 w-4" />
          <span>Categories</span>
        </button>
        <div className="mt-2 space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange(cat.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 rounded-r-full text-sm transition-colors",
                activeFilter === cat.id
                  ? "bg-muted font-medium"
                  : "text-foreground/70 hover:bg-muted"
              )}
            >
              <Tag className="h-4 w-4" />
              <div className={cn("w-2 h-2 rounded-full", cat.color)} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CPSSidebar;
