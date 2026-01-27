import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CPSEntry, APPROVAL_STATUS_LABELS, CPS_CATEGORY_LABELS, ApprovalStatus } from '@/types/cps';
import { format } from 'date-fns';
import { 
  X, 
  Archive, 
  Trash2, 
  Star, 
  MoreVertical,
  ExternalLink,
  Calendar,
  Award,
  FileText,
  CheckCircle2,
  Clock,
  XCircle
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
    <div className="flex flex-col h-full bg-card">
      {/* Header with actions */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
            <Archive className="h-4 w-4" />
          </Button>
          {canCancel && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onCancel}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-5">
        {/* Title & Status */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold leading-tight text-foreground">{entry.activityType}</h2>
          <Badge className={cn("flex-shrink-0 shadow-sm", statusStyles[entry.status])}>
            {APPROVAL_STATUS_LABELS[entry.status]}
          </Badge>
        </div>

        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="outline" className={cn("shadow-sm", categoryColors[entry.category])}>
            {CPS_CATEGORY_LABELS[entry.category]}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="space-y-4 bg-muted/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Date</p>
              <p className="text-sm font-medium text-foreground">{format(new Date(entry.date), 'MMMM d, yyyy')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <Award className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Credits Earned</p>
              <p className="text-sm font-semibold text-green-600">{entry.credits} credits</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium">Description</p>
              <p className="text-sm mt-1 text-foreground leading-relaxed">
                {entry.description}
              </p>
            </div>
          </div>

          {entry.evidence && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <ExternalLink className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Supporting Evidence</p>
                {entry.evidence.startsWith('file:') ? (
                  <p className="text-sm mt-1 text-foreground">File: {entry.evidence.slice(5)}</p>
                ) : (
                  <a
                    href={entry.evidence}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-1 inline-flex items-center gap-1"
                  >
                    View Evidence
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        {(entry.submittedAt || entry.hodApprovedAt || entry.principalApprovedAt || entry.status === 'rejected') && (
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Approval Timeline</p>
            <div className="space-y-3 relative">
              {/* Timeline line */}
              <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-border" />
              
              {entry.submittedAt && (
                <div className="flex items-center gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center z-10 shadow-sm">
                    <Clock className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Submitted</span>
                  <span className="text-xs text-muted-foreground ml-auto tabular-nums">
                    {format(new Date(entry.submittedAt), 'MMM d, h:mm a')}
                  </span>
                </div>
              )}
              {entry.hodApprovedAt && (
                <div className="flex items-center gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center z-10 shadow-sm">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-foreground">HOD Approved</span>
                  <span className="text-xs text-muted-foreground ml-auto tabular-nums">
                    {format(new Date(entry.hodApprovedAt), 'MMM d, h:mm a')}
                  </span>
                </div>
              )}
              {entry.principalApprovedAt && (
                <div className="flex items-center gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center z-10 shadow-sm">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Principal Approved</span>
                  <span className="text-xs text-muted-foreground ml-auto tabular-nums">
                    {format(new Date(entry.principalApprovedAt), 'MMM d, h:mm a')}
                  </span>
                </div>
              )}
              {entry.status === 'rejected' && entry.rejectedAt && (
                <div className="flex items-center gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center z-10 shadow-sm">
                    <XCircle className="h-3 w-3 text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Rejected</span>
                  <span className="text-xs text-muted-foreground ml-auto tabular-nums">
                    {format(new Date(entry.rejectedAt), 'MMM d, h:mm a')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CPSEntryDetail;
