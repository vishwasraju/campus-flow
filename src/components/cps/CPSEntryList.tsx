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
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Star className="h-8 w-8 opacity-30" />
        </div>
        <p className="text-lg font-medium">No entries found</p>
        <p className="text-sm mt-1 text-center">Try changing your filter or create a new entry</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-muted/20">
        <Checkbox className="data-[state=checked]:bg-primary" />
        <span className="text-sm font-medium text-muted-foreground">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* Entry List with scroll */}
      <div className="flex-1 overflow-auto divide-y">
        {entries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => onSelectEntry(entry)}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all duration-150",
              selectedEntry?.id === entry.id
                ? "bg-primary/5 border-l-3 border-l-primary"
                : "hover:bg-muted/50 border-l-3 border-l-transparent",
              entry.status === 'draft' && "bg-muted/10"
            )}
          >
            <Checkbox 
              onClick={(e) => e.stopPropagation()} 
              className="data-[state=checked]:bg-primary"
            />
            
            <button 
              className="text-muted-foreground/50 hover:text-amber-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Star className="h-4 w-4" />
            </button>

            {/* Category dot with glow */}
            <div className={cn(
              "w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-offset-1",
              categoryColors[entry.category],
              entry.category === 'research' && "ring-purple-200",
              entry.category === 'academics' && "ring-cyan-200",
              entry.category === 'industry' && "ring-orange-200",
              entry.category === 'placement' && "ring-green-200"
            )} />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "font-medium text-sm truncate",
                  selectedEntry?.id === entry.id && "text-primary"
                )}>
                  {entry.activityType}
                </span>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-[10px] px-1.5 py-0 font-medium",
                    entry.category === 'research' && "bg-purple-100 text-purple-700 border-purple-200",
                    entry.category === 'academics' && "bg-cyan-100 text-cyan-700 border-cyan-200",
                    entry.category === 'industry' && "bg-orange-100 text-orange-700 border-orange-200",
                    entry.category === 'placement' && "bg-green-100 text-green-700 border-green-200"
                  )}
                >
                  {CPS_CATEGORY_LABELS[entry.category].split(' ')[0]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate mt-0.5 leading-relaxed">
                {entry.description}
              </p>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {entry.status === 'draft' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubmitDraft(entry);
                  }}
                >
                  <Send className="w-3 h-3 mr-1" />
                  Submit
                </Button>
              )}
              
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  statusDotColors[entry.status]
                )} />
                <span className="text-[11px] text-muted-foreground whitespace-nowrap font-medium">
                  {APPROVAL_STATUS_LABELS[entry.status]}
                </span>
              </div>

              <span className="text-xs text-muted-foreground w-16 text-right tabular-nums">
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
