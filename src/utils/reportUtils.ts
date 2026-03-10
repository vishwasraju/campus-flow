import { format } from 'date-fns';
import { CPSEntry, APPROVAL_STATUS_LABELS, CPS_CATEGORY_LABELS } from '@/types/cps';
import { toast } from 'sonner';

/** Download a CSV of entries */
export function downloadCSV(entries: CPSEntry[], fileName: string) {
    const header = ['Activity', 'Category', 'Description', 'Date', 'Credits', 'Status', 'Evidence', 'Remarks'];
    const rows = entries.map(e => [
        `"${e.activityType.replace(/"/g, '""')}"`,
        `"${CPS_CATEGORY_LABELS[e.category]}"`,
        `"${e.description.replace(/"/g, '""')}"`,
        e.date,
        e.credits,
        APPROVAL_STATUS_LABELS[e.status],
        e.evidence ?? '',
        `"${(e.hodRemarks || e.principalRemarks || '').replace(/"/g, '""')}"`,
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

/** Open a print-ready HTML page */
export function printReport(
    entries: CPSEntry[],
    title: string,
    metadata: { label: string; value: string }[],
    summaryStats: { label: string; value: string | number; color?: string }[]
) {
    const statusColor: Record<string, string> = {
        approved: '#16a34a',
        pending_hod: '#d97706',
        pending_principal: '#2563eb',
        rejected: '#dc2626',
        draft: '#6b7280',
    };

    const rows = entries.map(e => `
    <tr>
      <td>${e.activityType}</td>
      <td>${CPS_CATEGORY_LABELS[e.category].split(' ')[0]}</td>
      <td>${e.date}</td>
      <td style="text-align:right">${e.credits}</td>
      <td><span style="color:${statusColor[e.status]};font-weight:600">${APPROVAL_STATUS_LABELS[e.status]}</span></td>
      <td style="font-size:11px;color:#555">${e.hodRemarks || e.principalRemarks || '—'}</td>
    </tr>`).join('');

    const metaHtml = metadata.map(m => `${m.label}: <strong>${m.value}</strong>`).join(' &nbsp;|&nbsp; ');
    const statsHtml = summaryStats.map(s => `
    <div class="stat">
      <div class="stat-val" style="color:${s.color || 'inherit'}">${s.value}</div>
      <div class="stat-lbl">${s.label}</div>
    </div>`).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>${title}</title>
  <style>
    @media print { @page { margin: 18mm; } }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 24px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    .meta { color: #555; font-size: 13px; margin-bottom: 20px; }
    .summary { display: flex; gap: 24px; margin-bottom: 24px; flex-wrap: wrap; }
    .stat { background: #f3f4f6; border-radius: 8px; padding: 12px 20px; min-width: 100px; }
    .stat-val { font-size: 26px; font-weight: 700; }
    .stat-lbl { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: .5px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #f9fafb; text-align: left; padding: 9px 10px; border-bottom: 2px solid #e5e7eb; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; color: #374151; }
    td { padding: 8px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
    tr:hover td { background: #fafafa; }
    .footer { margin-top: 32px; font-size: 11px; color: #999; text-align: center; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">
    ${metaHtml} &nbsp;|&nbsp; Generated: ${format(new Date(), 'dd MMM yyyy, hh:mm a')}
  </div>
  <div class="summary">${statsHtml}</div>
  <table>
    <thead>
      <tr>
        <th>Activity</th><th>Category</th><th>Date</th>
        <th style="text-align:right">Credits</th><th>Status</th><th>Remarks</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">CPS College Platform System &mdash; Confidential</div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    if (!w) toast.error('Pop-up blocked. Please allow pop-ups and try again.');
    setTimeout(() => URL.revokeObjectURL(url), 5000);
}
