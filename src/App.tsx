import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Nutrition from "./pages/Nutrition";
import Journal from "./pages/Journal";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import EmotionResult from "./pages/EmotionResult";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Journeys from "./pages/Journeys";
import WellnessReport from "./pages/WellnessReport";
import GuideChat from "./pages/GuideChat";
import GuideSelect from "./pages/GuideSelect";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/legacy" element={<Index />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/emotion-result" element={<EmotionResult />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/journeys" element={<Journeys />} />
            <Route path="/report" element={<WellnessReport />} />
            <Route path="/guide" element={<GuideChat />} />
            <Route path="/guide/select" element={<GuideSelect />} />
            <Route path="/admin/*" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
