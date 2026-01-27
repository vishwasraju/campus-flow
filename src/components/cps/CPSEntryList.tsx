import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CPSEntry, APPROVAL_STATUS_LABELS, CPS_CATEGORY_LABELS, ApprovalStatus } from '@/types/cps';
import { format } from 'date-fns';
import { Star, Send } from 'lucide-react';

interface CPSEntryListProps {
  entries: CPSEntry[];
  selectedEntry: CPSEntry | null;
  onSelectEntry: (entry: CPSEntry) => void;
  onSubmitDraft: (entry: CPSEntry) => void;
}

const categoryColors: Record<string, string> = {
  research: 'bg-purple-500',
  academics: 'bg-cyan-500',
  industry: 'bg-orange-500',
  placement: 'bg-green-500',
};

const statusDotColors: Record<ApprovalStatus, string> = {
  draft: 'bg-gray-400',
  pending_hod: 'bg-amber-400',
  pending_principal: 'bg-blue-400',
  approved: 'bg-green-400',
  rejected: 'bg-red-400',
};

const CPSEntryList = ({ entries, selectedEntry, onSelectEntry, onSubmitDraft }: CPSEntryListProps) => {
  if (entries.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg">No entries found</p>
          <p className="text-sm mt-1">Try changing your filter or create a new entry</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-card rounded-lg border overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/30">
        <Checkbox />
        <span className="text-sm text-muted-foreground ml-2">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* Entry List */}
      <div className="divide-y">
        {entries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => onSelectEntry(entry)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
              selectedEntry?.id === entry.id
                ? "bg-blue-50 border-l-2 border-l-blue-500"
                : "hover:bg-muted/50",
              entry.status === 'draft' && "bg-muted/20"
            )}
          >
            <Checkbox onClick={(e) => e.stopPropagation()} />
            
            <button 
              className="text-muted-foreground hover:text-amber-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Star className="h-4 w-4" />
            </button>

            {/* Category dot */}
            <div className={cn(
              "w-2.5 h-2.5 rounded-full flex-shrink-0",
              categoryColors[entry.category]
            )} />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">
                  {entry.activityType}
                </span>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-xs px-1.5 py-0",
                    entry.category === 'research' && "bg-purple-100 text-purple-700",
                    entry.category === 'academics' && "bg-cyan-100 text-cyan-700",
                    entry.category === 'industry' && "bg-orange-100 text-orange-700",
                    entry.category === 'placement' && "bg-green-100 text-green-700"
                  )}
                >
                  {CPS_CATEGORY_LABELS[entry.category].split(' ')[0]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {entry.description}
              </p>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {entry.status === 'draft' && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubmitDraft(entry);
                  }}
                >
                  <Send className="w-3 h-3 mr-1" />
                  Submit
                </Button>
              )}
              
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  statusDotColors[entry.status]
                )} />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {APPROVAL_STATUS_LABELS[entry.status]}
                </span>
              </div>

              <span className="text-xs text-muted-foreground w-20 text-right">
                {format(new Date(entry.date), 'MMM d')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CPSEntryList;
