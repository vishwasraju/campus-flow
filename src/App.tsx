import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CPSProvider } from "@/contexts/CPSContext";
import { LeaveProvider } from "@/contexts/LeaveContext";
import { TimetableProvider } from "@/contexts/TimetableContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CPSEntry from "./pages/CPSEntry";
import CPSRecords from "./pages/CPSRecords";
import HODApprovals from "./pages/HODApprovals";
import PrincipalApprovals from "./pages/PrincipalApprovals";
import Leave from "./pages/Leave";
import Timetable from "./pages/Timetable";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CPSProvider>
        <LeaveProvider>
        <TimetableProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes - wrapped in DashboardLayout */}
              <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
              <Route path="/cps/new" element={<DashboardLayout><CPSEntry /></DashboardLayout>} />
              <Route path="/cps/records" element={<DashboardLayout><CPSRecords /></DashboardLayout>} />
              <Route path="/approvals/hod" element={<DashboardLayout><HODApprovals /></DashboardLayout>} />
              <Route path="/approvals/principal" element={<DashboardLayout><PrincipalApprovals /></DashboardLayout>} />
              
              {/* Placeholder routes for other modules */}
              <Route path="/circulars" element={<DashboardLayout><ComingSoon title="Circulars" /></DashboardLayout>} />
              <Route path="/events" element={<DashboardLayout><ComingSoon title="Events Calendar" /></DashboardLayout>} />
              <Route path="/leave" element={<DashboardLayout><Leave /></DashboardLayout>} />
              <Route path="/timetable" element={<DashboardLayout><Timetable /></DashboardLayout>} />
              <Route path="/tasks" element={<DashboardLayout><ComingSoon title="Task Management" /></DashboardLayout>} />
              <Route path="/reports" element={<DashboardLayout><ComingSoon title="Reports" /></DashboardLayout>} />
              
              {/* Redirects */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </TimetableProvider>
        </LeaveProvider>
      </CPSProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// Placeholder component for modules not yet implemented
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="p-4 rounded-full bg-muted mb-4">
        <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md">
        This module is coming soon. The core CPS functionality is ready for use.
      </p>
    </div>
  );
}

export default App;
