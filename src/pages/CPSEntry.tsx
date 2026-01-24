import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { 
  FlaskConical, 
  BookOpen, 
  Briefcase, 
  Users, 
  Save, 
  Send,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { CPSCategory, CPS_ACTIVITIES, CPS_CATEGORY_LABELS, CPSActivityType } from '@/types/cps';
import { toast } from 'sonner';

const categoryIcons: Record<CPSCategory, React.ComponentType<{ className?: string }>> = {
  research: FlaskConical,
  academics: BookOpen,
  industry: Briefcase,
  placement: Users,
};

const CPSEntry = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addEntry } = useCPS();
  
  const [activeCategory, setActiveCategory] = useState<CPSCategory>('research');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [evidence, setEvidence] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getActivitiesByCategory = (category: CPSCategory): CPSActivityType[] => {
    return CPS_ACTIVITIES.filter((a) => a.category === category);
  };

  const getSelectedActivityDetails = (): CPSActivityType | undefined => {
    return CPS_ACTIVITIES.find((a) => a.id === selectedActivity);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category as CPSCategory);
    setSelectedActivity('');
  };

  const handleSaveDraft = () => {
    if (!selectedActivity || !description || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const activity = getSelectedActivityDetails();
    if (!activity || !user) return;

    addEntry({
      facultyId: user.id,
      facultyName: user.name,
      department: user.department,
      category: activeCategory,
      activityType: activity.name,
      description,
      date,
      credits: activity.credits,
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

    addEntry({
      facultyId: user.id,
      facultyName: user.name,
      department: user.department,
      category: activeCategory,
      activityType: activity.name,
      description,
      date,
      credits: activity.credits,
      status: 'pending_hod',
      evidence,
      submittedAt: new Date().toISOString(),
    });

    setIsSubmitting(false);
    toast.success('Entry submitted for HOD approval');
    navigate('/cps/records');
  };

  const selectedActivityDetails = getSelectedActivityDetails();

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
                            {getActivitiesByCategory(category).map((activity) => (
                              <SelectItem key={activity.id} value={activity.id}>
                                <div className="flex items-center justify-between gap-4">
                                  <span>{activity.name}</span>
                                  <Badge variant="secondary" className="ml-2">
                                    {activity.credits} pts
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

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
                        <Label htmlFor="evidence">Evidence/Reference (Optional)</Label>
                        <Input
                          id="evidence"
                          placeholder="Link to certificate, DOI, or other proof"
                          value={evidence}
                          onChange={(e) => setEvidence(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Provide a link to supporting documents if available
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
                      {selectedActivityDetails.credits}
                    </div>
                    <div className="text-sm text-center text-muted-foreground">
                      Credit Points
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
                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                    2
                  </div>
                  <div>
                    <div className="text-sm font-medium">HOD Review</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                    3
                  </div>
                  <div>
                    <div className="text-sm font-medium">Principal Approval</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CPSEntry;
