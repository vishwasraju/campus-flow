import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  ClipboardCheck, 
  Clock, 
  TrendingUp,
  BookOpen,
  Briefcase,
  Users,
  FlaskConical
} from 'lucide-react';
import { ROLE_LABELS } from '@/types/auth';
import { CPS_CATEGORY_LABELS } from '@/types/cps';

const Dashboard = () => {
  const { user, currentRole } = useAuth();

  // Mock data for dashboard stats
  const facultyStats = {
    totalCredits: 68,
    pendingSubmissions: 2,
    approvedThisYear: 12,
    categoryBreakdown: {
      research: 25,
      academics: 18,
      industry: 15,
      placement: 10,
    },
  };

  const hodStats = {
    pendingApprovals: 8,
    approvedThisMonth: 15,
    departmentCredits: 450,
    facultyCount: 12,
  };

  const principalStats = {
    pendingApprovals: 5,
    totalCreditsCollege: 2850,
    departmentsCount: 6,
    approvedThisMonth: 45,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your {currentRole && ROLE_LABELS[currentRole].toLowerCase()} dashboard
        </p>
      </div>

      {/* Role-specific Stats */}
      {currentRole === 'faculty' && (
        <>
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total CPS Credits</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{facultyStats.totalCredits}</div>
                <p className="text-xs text-muted-foreground">This academic year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{facultyStats.pendingSubmissions}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Entries</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{facultyStats.approvedThisYear}</div>
                <p className="text-xs text-muted-foreground">This year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Department Rank</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#3</div>
                <p className="text-xs text-muted-foreground">Among 12 faculty</p>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>CPS Category Breakdown</CardTitle>
              <CardDescription>Credits earned across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <div className="p-2 rounded-md bg-cps-research/20">
                    <FlaskConical className="h-5 w-5 text-cps-research" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Research & Development</p>
                    <p className="text-2xl font-bold">{facultyStats.categoryBreakdown.research}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="p-2 rounded-md bg-cps-academics/20">
                    <BookOpen className="h-5 w-5 text-cps-academics" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Academics & Teaching</p>
                    <p className="text-2xl font-bold">{facultyStats.categoryBreakdown.academics}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                  <div className="p-2 rounded-md bg-cps-industry/20">
                    <Briefcase className="h-5 w-5 text-cps-industry" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Industry Interaction</p>
                    <p className="text-2xl font-bold">{facultyStats.categoryBreakdown.industry}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <div className="p-2 rounded-md bg-cps-placement/20">
                    <Users className="h-5 w-5 text-cps-placement" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Placement Activities</p>
                    <p className="text-2xl font-bold">{facultyStats.categoryBreakdown.placement}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {currentRole === 'hod' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hodStats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Require your review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hodStats.approvedThisMonth}</div>
              <p className="text-xs text-muted-foreground">Entries processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Department Credits</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hodStats.departmentCredits}</div>
              <p className="text-xs text-muted-foreground">Total this year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculty Count</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hodStats.facultyCount}</div>
              <p className="text-xs text-muted-foreground">In your department</p>
            </CardContent>
          </Card>
        </div>
      )}

      {currentRole === 'principal' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Final Approvals</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{principalStats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">From all departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">College-wide Credits</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{principalStats.totalCreditsCollege}</div>
              <p className="text-xs text-muted-foreground">This academic year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{principalStats.departmentsCount}</div>
              <p className="text-xs text-muted-foreground">Active departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{principalStats.approvedThisMonth}</div>
              <p className="text-xs text-muted-foreground">Final approvals given</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for your role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {currentRole === 'faculty' && (
              <>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">
                  <FileText className="w-4 h-4 mr-2" />
                  New CPS Entry
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">
                  <Clock className="w-4 h-4 mr-2" />
                  Apply for Leave
                </Badge>
              </>
            )}
            {currentRole === 'hod' && (
              <>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Review Pending ({hodStats.pendingApprovals})
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">
                  <FileText className="w-4 h-4 mr-2" />
                  Department Report
                </Badge>
              </>
            )}
            {currentRole === 'principal' && (
              <>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Final Approvals ({principalStats.pendingApprovals})
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">
                  <FileText className="w-4 h-4 mr-2" />
                  College Report
                </Badge>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
