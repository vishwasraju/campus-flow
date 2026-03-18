import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCPS } from '@/contexts/CPSContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import {
  FlaskConical,
  BookOpen,
  Briefcase,
  Users,
  Save,
  Send,
  AlertCircle,
  CheckCircle2,
  Upload,
  X,
  Link2,
  ClipboardList
} from 'lucide-react';
import { CPSCategory, CPS_ACTIVITIES, CPS_CATEGORY_LABELS, CPSActivityType } from '@/types/cps';
import { toast } from 'sonner';

const categoryIcons: Record<CPSCategory, React.ComponentType<{ className?: string }>> = {
  research: FlaskConical,
  academics: BookOpen,
  industry: Briefcase,
  placement: Users,
  administration: ClipboardList,
};

const CPSEntry = () => {
  const navigate = useNavigate();
  const { user, currentRole } = useAuth();
  const { addEntry, entries } = useCPS();

  const [activeCategory, setActiveCategory] = useState<CPSCategory>('research');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidenceLink, setEvidenceLink] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Research specific state
  const [involvementType, setInvolvementType] = useState<'solo' | 'multi'>('solo');
  const [researchRole, setResearchRole] = useState<'principal' | 'co-investigator'>('principal');
  const [coInvestigatorCount, setCoInvestigatorCount] = useState<number | ''>(1);
  const [consultancyAmount, setConsultancyAmount] = useState<number | ''>('');

  const getActivitiesByCategory = (category: CPSCategory): CPSActivityType[] => {
    return CPS_ACTIVITIES.filter((a) => a.category === category);
  };

  const getSelectedActivityDetails = (): CPSActivityType | undefined => {
    return CPS_ACTIVITIES.find((a) => a.id === selectedActivity);
  };

  const isResearchInvolvementActivity = selectedActivity.startsWith('rd_project_') || selectedActivity.startsWith('patent_');
  const isConsultancy = selectedActivity === 'consultancy_project_research';
  const isPhDActivity = selectedActivity === 'phd_awarded' || selectedActivity === 'phd_pursuing';
  const isJournalActivity = selectedActivity === 'journal_scopus_sci';
  const isConferenceActivity = selectedActivity === 'conf_indexed';
  const isConferenceOrganised = selectedActivity === 'conference_organised_role';

  const shouldShowInvolvementOptions = isResearchInvolvementActivity || isPhDActivity || isJournalActivity || isConferenceActivity;

  // Helper to calculate total approved/pending credits for a specific activity type
  const getAccumulatedCreditsForActivity = (activityName: string) => {
    if (!user) return 0;
    return entries
      .filter(e =>
        e.facultyId === user.id &&
        e.activityType === activityName &&
        (e.status === 'approved' || e.status === 'pending_hod' || e.status === 'pending_principal')
      )
      .reduce((sum, e) => sum + e.credits, 0);
  };

  // Specific helpers for the complex research limits (that also depend on maxCredits or other rules)
  const pastConfOrganisedCredits = getAccumulatedCreditsForActivity('National / International Conference Organised (Chairman / Secretary / Convener / Session Chair / Session Co-Chair)');
  const pastJournalCredits = getAccumulatedCreditsForActivity('Journal / Book Chapter (SCI / Scopus)');
  const pastConfPaperCredits = getAccumulatedCreditsForActivity('Conference Paper (SCI / Scopus / WoS / Intl.)');

  const getRoleLabels = () => {
    if (isPhDActivity) {
      return {
        principal: 'Main Guide',
        coInvestigator: 'Co-Supervisor / Guide',
        solo: 'Single Guide',
        multi: 'Multiple Guides'
      };
    }
    if (isJournalActivity || isConferenceActivity) {
      return {
        principal: 'First Author / Main Supervisor',
        coInvestigator: 'Co-Author',
        solo: 'Solo',
        multi: 'Multi-person / Team'
      };
    }
    if (selectedActivity.startsWith('patent_')) {
      return {
        principal: 'Principal Inventor',
        coInvestigator: 'Co-inventor',
        solo: 'Solo',
        multi: 'Multi-person / Team'
      };
    }
    return {
      principal: 'Principal Investigator',
      coInvestigator: 'Co-investigator',
      solo: 'Solo',
      multi: 'Multi-person / Team'
    };
  };

  const labels = getRoleLabels();

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category as CPSCategory);
    setSelectedActivity('');
    setInvolvementType('solo');
    setResearchRole('principal');
    setCoInvestigatorCount(1);
    setConsultancyAmount('');
  };

  const calculateCredits = (activity: CPSActivityType) => {
    if (activeCategory !== 'research') return activity.credits;

    if (isConferenceOrganised) {
      // Max 3 points cumulative (as defined in type)
      const maxPossible = activity.maxCredits || 3;
      const remainingCap = Math.max(0, maxPossible - pastConfOrganisedCredits);
      return Math.min(activity.credits, remainingCap);
    }

    if (isConsultancy) {
      const amount = Number(consultancyAmount) || 0;
      const maxPossible = activity.maxCredits || 10;
      return Math.min(amount, maxPossible);
    }

    // Common logic for capping Journal and Conf Paper
    let calculated = 0;

    if (!shouldShowInvolvementOptions) {
      calculated = activity.credits;
    } else if (involvementType === 'solo') {
      calculated = activity.credits;
    } else if (isJournalActivity) {
      // Journal Logic
      if (researchRole === 'principal') {
        calculated = 2;
      } else {
        const remainingCredits = 2;
        const count = Number(coInvestigatorCount) || 1;
        calculated = Number((remainingCredits / count).toFixed(2));
      }
    } else if (isConferenceActivity) {
      // Conf Paper Logic
      if (researchRole === 'principal') {
        calculated = activity.credits * 0.6;
      } else {
        const remainingCredits = activity.credits * 0.4;
        const count = Number(coInvestigatorCount) || 1;
        calculated = Number((remainingCredits / count).toFixed(2));
      }
    } else {
      // Standard Logic (R&D, Patents, PhD)
      if (researchRole === 'principal') {
        calculated = activity.credits * 0.6;
      } else {
        const remainingCredits = activity.credits * 0.4;
        const count = Number(coInvestigatorCount) || 1;
        calculated = Number((remainingCredits / count).toFixed(2));
      }
    }

    // Apply Cumulative Limits
    if (isJournalActivity) {
      const remainingCap = Math.max(0, (activity.maxCredits || 10) - pastJournalCredits);
      return Math.min(calculated, remainingCap);
    }
    if (isConferenceActivity) {
      const remainingCap = Math.max(0, (activity.maxCredits || 10) - pastConfPaperCredits);
      return Math.min(calculated, remainingCap);
    }

    // Apply generic maxCredits limits for everything else
    if (activity.maxCredits) {
      const pastGenericCredits = getAccumulatedCreditsForActivity(activity.name);
      const remainingCap = Math.max(0, activity.maxCredits - pastGenericCredits);
      return Math.min(calculated, remainingCap);
    }

    return calculated;
  };

  const handleSaveDraft = () => {
    if (!selectedActivity || !description || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const activity = getSelectedActivityDetails();
    if (!activity || !user) return;

    let finalDescription = description;
    let finalCredits = activity.credits;

    if (activeCategory === 'research') {
      finalCredits = calculateCredits(activity);

      if (shouldShowInvolvementOptions) {
        const count = Number(coInvestigatorCount) || 1;

        let roleLabel = labels.principal;
        if (researchRole === 'co-investigator') roleLabel = labels.coInvestigator;

        const involvementDetails = `
---
Involvement: ${involvementType === 'solo' ? 'Solo' : 'Multi-person'}
${involvementType === 'multi' ? `Role: ${roleLabel}` : ''}
${involvementType === 'multi' && researchRole === 'co-investigator' ? `Number of Co-Authors/Investigators: ${count}` : ''}
`;
        finalDescription += involvementDetails;
      } else if (isConsultancy) {
        const amount = Number(consultancyAmount) || 0;
        const consultancyDetails = `
---
Consultancy Amount: ₹${amount} Lakhs
`;
        finalDescription += consultancyDetails;
      }
    }

    const evidence = evidenceFile ? `file:${evidenceFile.name}` : (evidenceLink.trim() || undefined);
    addEntry({
      facultyId: user.id,
      facultyName: user.name,
      department: user.department,
      category: activeCategory,
      activityType: activity.name,
      description: finalDescription,
      date,
      credits: finalCredits,
      status: 'draft',
      evidence,
    });

    toast.success('Entry saved as draft');
    navigate('/cps/records');
  };

  const handleSubmit = () => {
    if (!selectedActivity || !description || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const activity = getSelectedActivityDetails();
    if (!activity || !user) return;

    setIsSubmitting(true);

    let finalDescription = description;
    let finalCredits = activity.credits;

    if (activeCategory === 'research') {
      finalCredits = calculateCredits(activity);

      if (shouldShowInvolvementOptions) {
        const count = Number(coInvestigatorCount) || 1;

        let roleLabel = labels.principal;
        if (researchRole === 'co-investigator') roleLabel = labels.coInvestigator;

        const involvementDetails = `
---
Involvement: ${involvementType === 'solo' ? 'Solo' : 'Multi-person'}
${involvementType === 'multi' ? `Role: ${roleLabel}` : ''}
${involvementType === 'multi' && researchRole === 'co-investigator' ? `Number of Co-Authors/Investigators: ${count}` : ''}
`;
        finalDescription += involvementDetails;
      } else if (isConsultancy) {
        const amount = Number(consultancyAmount) || 0;
        const consultancyDetails = `
---
Consultancy Amount: ₹${amount} Lakhs
`;
        finalDescription += consultancyDetails;
      }
    }

    const evidence = evidenceFile ? `file:${evidenceFile.name}` : (evidenceLink.trim() || undefined);
    addEntry({
      facultyId: user.id,
      facultyName: user.name,
      department: user.department,
      category: activeCategory,
      activityType: activity.name,
      description: finalDescription,
      date,
      credits: finalCredits,
      status: 'pending_hod',
      evidence,
      submittedAt: new Date().toISOString(),
    });

    setIsSubmitting(false);
    toast.success('Entry submitted for HOD approval');
    navigate('/cps/records');
  };

  const selectedActivityDetails = getSelectedActivityDetails();
  const calculatedCredits = selectedActivityDetails ? calculateCredits(selectedActivityDetails) : 0;

  // Display value for Credits Preview
  let previewDisplay: React.ReactNode = calculatedCredits;
  
  if (selectedActivityDetails?.maxCredits) {
    const pastCredits = getAccumulatedCreditsForActivity(selectedActivityDetails.name);
    // The user will receive exactly `calculatedCredits` for this entry, but we show the overall progress
    const nextTotal = Math.min(pastCredits + calculatedCredits, selectedActivityDetails.maxCredits);
    previewDisplay = (
      <div className="flex items-baseline justify-center gap-1">
        <span>{nextTotal}</span>
        <span className="text-xl text-muted-foreground">/ {selectedActivityDetails.maxCredits}</span>
      </div>
    );
  } else if (isConferenceOrganised) {
    previewDisplay = `${Math.min(pastConfOrganisedCredits + calculatedCredits, 3)}/3`;
  } else if (isJournalActivity) {
    previewDisplay = `${Math.min(pastJournalCredits + calculatedCredits, 10)}/10`;
  } else if (isConferenceActivity) {
    previewDisplay = `${Math.min(pastConfPaperCredits + calculatedCredits, 10)}/10`;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">New CPS Entry</h1>
        <p className="text-muted-foreground">
          Record your academic activities to earn CPS credits
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Category</CardTitle>
              <CardDescription>Choose the type of activity you want to record</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeCategory} onValueChange={handleCategoryChange}>
                <TabsList className="grid grid-cols-4 h-auto">
                  {(Object.keys(CPS_CATEGORY_LABELS) as CPSCategory[]).map((category) => {
                    const Icon = categoryIcons[category];
                    return (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs">{CPS_CATEGORY_LABELS[category].split(' ')[0]}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {(Object.keys(CPS_CATEGORY_LABELS) as CPSCategory[]).map((category) => (
                  <TabsContent key={category} value={category} className="mt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="activity">Activity Type *</Label>
                        <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                          <SelectTrigger id="activity">
                            <SelectValue placeholder="Select an activity type" />
                          </SelectTrigger>
                          <SelectContent>
                            {getActivitiesByCategory(category).map((activity) => {
                              const pastCredits = getAccumulatedCreditsForActivity(activity.name);
                              const isMaxedOut = activity.maxCredits ? pastCredits >= activity.maxCredits : false;
                              
                              return (
                                <SelectItem 
                                  key={activity.id} 
                                  value={activity.id}
                                  disabled={isMaxedOut}
                                  className={isMaxedOut ? "opacity-50" : ""}
                                >
                                  <div className="flex items-center justify-between gap-4 w-full pr-2">
                                    <span className={isMaxedOut ? "line-through text-muted-foreground" : ""}>
                                      {activity.name}
                                    </span>
                                    <Badge variant={isMaxedOut ? "outline" : "secondary"} className="ml-2 whitespace-nowrap">
                                      {isMaxedOut ? 'Maxed Out' : 
                                        activity.maxCredits ? `${activity.credits} pts (Max ${activity.maxCredits})` : `${activity.credits} pts`}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      {category === 'research' && selectedActivity && shouldShowInvolvementOptions && (
                        <div className="p-4 border rounded-lg bg-card space-y-4 animate-in fade-in slide-in-from-top-2">
                          <div className="space-y-3">
                            <Label>Involvement Type</Label>
                            <RadioGroup
                              value={involvementType}
                              onValueChange={(val: 'solo' | 'multi') => setInvolvementType(val)}
                              className="flex gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="solo" id="solo" />
                                <Label htmlFor="solo" className="font-normal cursor-pointer">
                                  {labels.solo} (100% credit)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="multi" id="multi" />
                                <Label htmlFor="multi" className="font-normal cursor-pointer">
                                  {labels.multi}
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {involvementType === 'multi' && (
                            <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                              <Label>Your Role</Label>
                              <RadioGroup
                                value={researchRole}
                                onValueChange={(val: 'principal' | 'co-investigator') => setResearchRole(val)}
                                className="flex gap-4 flex-wrap"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="principal" id="principal" />
                                  <Label htmlFor="principal" className="font-normal cursor-pointer">
                                    {labels.principal} ({isJournalActivity ? '50%' : '60%'})
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="co-investigator" id="co-investigator" />
                                  <Label htmlFor="co-investigator" className="font-normal cursor-pointer">
                                    {labels.coInvestigator}
                                  </Label>
                                </div>
                              </RadioGroup>

                              {researchRole === 'co-investigator' && (
                                <div className="space-y-2 pt-2 max-w-[200px]">
                                  <Label htmlFor="co-count">
                                    Total Others (Co-Authors/Investigators)
                                  </Label>
                                  <Input
                                    id="co-count"
                                    type="number"
                                    min="1"
                                    value={coInvestigatorCount}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setCoInvestigatorCount(val === '' ? '' : parseInt(val));
                                    }}
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    remaining {isJournalActivity ? '50%' : '40%'} shared equally
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {category === 'research' && isConsultancy && (
                        <div className="p-4 border rounded-lg bg-card space-y-4 animate-in fade-in slide-in-from-top-2">
                          <div className="space-y-2">
                            <Label htmlFor="consultancy-amount">Consultancy Amount (in Lakhs)</Label>
                            <Input
                              id="consultancy-amount"
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Enter amount (e.g., 5 for 5 Lakhs)"
                              value={consultancyAmount}
                              onChange={(e) => {
                                const val = e.target.value;
                                setConsultancyAmount(val === '' ? '' : parseFloat(val));
                              }}
                            />
                            <p className="text-xs text-muted-foreground">1 Credit point per ₹1 Lakh, max 10 points.</p>
                          </div>
                        </div>
                      )}

                      {/* Warning notes removed in favor of cumulative display */}

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Provide details about this activity..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date">Date of Activity *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Evidence / Reference (Optional)</Label>
                        <div
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
                          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDragOver(false);
                            const f = e.dataTransfer.files[0];
                            if (f) setEvidenceFile(f);
                          }}
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50'
                            }`}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) setEvidenceFile(f);
                              e.target.value = '';
                            }}
                          />
                          {evidenceFile ? (
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-sm font-medium truncate max-w-[200px]">{evidenceFile.name}</span>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setEvidenceFile(null); }}
                                className="p-1 rounded-full hover:bg-destructive/10 text-destructive"
                                aria-label="Remove file"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm font-medium">Drag and drop a document here, or click to browse</p>
                              <p className="text-xs text-muted-foreground mt-1">PDF, DOC, images</p>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
                          <Input
                            placeholder="Or add a link (certificate, DOI, etc.)"
                            value={evidenceLink}
                            onChange={(e) => setEvidenceLink(e.target.value)}
                            className="h-9"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Upload a file or provide a link to supporting documents if available
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleSaveDraft} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
              <Send className="w-4 h-4 mr-2" />
              Submit for Approval
            </Button>
          </div>
        </div>

        {/* Credits Summary Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Credits Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedActivityDetails ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-accent">
                    <div className="text-3xl font-bold text-center">
                      {isConsultancy && !selectedActivityDetails?.maxCredits ? `${calculatedCredits}/10` : previewDisplay}
                    </div>
                    <div className="text-sm text-center text-muted-foreground">
                      {(isConsultancy || isJournalActivity || isConferenceActivity || isConferenceOrganised || selectedActivityDetails?.maxCredits) ? 'Total Points Progress' : 'Calculated Points'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-cps-placement" />
                      <span>{selectedActivityDetails.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{CPS_CATEGORY_LABELS[activeCategory]}</span>
                    </div>
                    {activeCategory === 'research' && shouldShowInvolvementOptions && involvementType !== 'solo' && (
                      <div className="pt-2 text-xs text-muted-foreground border-t mt-2">
                        <p>Activity Base: {selectedActivityDetails.credits} pts</p>
                        <p>
                          {`Role: ${labels.principal} (${isJournalActivity ? '50%' : '60%'})`}
                          {researchRole === 'co-investigator' ? ` / ${labels.coInvestigator} (Share of ${isJournalActivity ? '50%' : '40%'})` : ''}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select an activity to see credits</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Approval Workflow</CardTitle>
              <CardDescription>
                {currentRole === 'hod'
                  ? 'Your entry goes to Principal for final approval.'
                  : 'Your entry goes to HOD for approval.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">
                    1
                  </div>
                  <div>
                    <div className="text-sm font-medium">Submit Entry</div>
                    <div className="text-xs text-muted-foreground">You are here</div>
                  </div>
                </div>
                {currentRole === 'hod' ? (
                  <div className="flex items-center gap-3 opacity-50">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                      2
                    </div>
                    <div>
                      <div className="text-sm font-medium">Principal Approval</div>
                      <div className="text-xs text-muted-foreground">Pending</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 opacity-50">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                      2
                    </div>
                    <div>
                      <div className="text-sm font-medium">HOD Approve</div>
                      <div className="text-xs text-muted-foreground">Pending</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CPSEntry;
