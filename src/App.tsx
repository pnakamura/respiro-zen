import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initAccessibility } from "@/hooks/useAccessibility";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Landing from "./pages/Landing";
import Nutrition from "./pages/Nutrition";
import Journal from "./pages/Journal";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Privacy from "./pages/Privacy";
import EmotionResult from "./pages/EmotionResult";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Journeys from "./pages/Journeys";
import JourneysExplore from "./pages/JourneysExplore";
import Favorites from "./pages/Favorites";
import WellnessReport from "./pages/WellnessReport";
import GuideChat from "./pages/GuideChat";
import GuideSelect from "./pages/GuideSelect";
import Plans from "./pages/Plans";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Initialize accessibility settings before React renders
initAccessibility();

const App: React.FC = () => (
  <ErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/legacy" element={<Index />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/emotion-result" element={<ErrorBoundary><EmotionResult /></ErrorBoundary>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/journeys" element={<ErrorBoundary><Journeys /></ErrorBoundary>} />
                <Route path="/journeys/explore" element={<JourneysExplore />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/report" element={<WellnessReport />} />
                <Route path="/guide" element={<ErrorBoundary><GuideChat /></ErrorBoundary>} />
                <Route path="/guide/select" element={<GuideSelect />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/admin/*" element={<Admin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
