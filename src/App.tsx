
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Index from "./pages/Index";
import GuestPage from "./pages/GuestPage";
import StaffLoginPage from "./pages/StaffLoginPage";
import StaffDashboard from "./pages/StaffDashboard";
import StaffMessagePage from "./pages/StaffMessagePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/guest" element={<GuestPage />} />
                <Route path="/staff/login" element={<StaffLoginPage />} />
                
                {/* Protected staff routes */}
                <Route 
                  path="/staff" 
                  element={
                    <PrivateRoute>
                      <StaffDashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/staff/messages/:messageId" 
                  element={
                    <PrivateRoute>
                      <StaffMessagePage />
                    </PrivateRoute>
                  } 
                />

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
