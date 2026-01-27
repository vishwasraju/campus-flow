import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CPSEntry, APPROVAL_STATUS_LABELS, CPS_CATEGORY_LABELS, ApprovalStatus } from '@/types/cps';
import { format } from 'date-fns';
import { 
  X, 
  Archive, 
  Trash2, 
  Star, 
  Reply, 
  MoreVertical,
  ExternalLink,
  Calendar,
  Award,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CPSEntryDetailProps {
  entry: CPSEntry;
  onClose: () => void;
  onCancel: () => void;
  canCancel: boolean;
}

const statusStyles: Record<ApprovalStatus, string> = {
  draft: 'bg-secondary text-secondary-foreground',
  pending_hod: 'bg-amber-100 text-amber-800 border-amber-200',
  pending_principal: 'bg-blue-100 text-blue-800 border-blue-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const categoryColors: Record<string, string> = {
  research: 'bg-purple-100 text-purple-700 border-purple-200',
  academics: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  industry: 'bg-orange-100 text-orange-700 border-orange-200',
  placement: 'bg-green-100 text-green-700 border-green-200',
};

const CPSEntryDetail = ({ entry, onClose, onCancel, canCancel }: CPSEntryDetailProps) => {
  return (
    <div className="w-[420px] bg-card rounded-lg border flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Archive className="h-4 w-4" />
          </Button>
          {canCancel && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={onCancel}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Title & Status */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold leading-tight">{entry.activityType}</h2>
          <Badge className={cn("flex-shrink-0", statusStyles[entry.status])}>
            {APPROVAL_STATUS_LABELS[entry.status]}
          </Badge>
        </div>

        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="outline" className={categoryColors[entry.category]}>
            {CPS_CATEGORY_LABELS[entry.category]}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm font-medium">{format(new Date(entry.date), 'MMMM d, yyyy')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Award className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Credits</p>
              <p className="text-sm font-semibold text-primary">{entry.credits} credits</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="text-sm mt-1 text-foreground/80 leading-relaxed">
                {entry.description}
              </p>
            </div>
          </div>

          {entry.evidence && (
            <div className="flex items-start gap-3">
              <ExternalLink className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Supporting Evidence</p>
                {entry.evidence.startsWith('file:') ? (
                  <p className="text-sm mt-1">File: {entry.evidence.slice(5)}</p>
                ) : (
                  <a
                    href={entry.evidence}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-1 inline-block"
                  >
                    {entry.evidence}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        {(entry.submittedAt || entry.hodApprovedAt || entry.principalApprovedAt) && (
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-3">APPROVAL TIMELINE</p>
            <div className="space-y-3">
              {entry.submittedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-muted-foreground">Submitted</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {format(new Date(entry.submittedAt), 'MMM d, h:mm a')}
                  </span>
                </div>
              )}
              {entry.hodApprovedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">HOD Approved</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {format(new Date(entry.hodApprovedAt), 'MMM d, h:mm a')}
                  </span>
                </div>
              )}
              {entry.principalApprovedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">Principal Approved</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {format(new Date(entry.principalApprovedAt), 'MMM d, h:mm a')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Footer */}
      <div className="p-4 border-t">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs">
            Looking forward to it!
          </Button>
          <Button variant="outline" size="sm" className="rounded-full text-xs">
            Thanks for the update!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CPSEntryDetail;
