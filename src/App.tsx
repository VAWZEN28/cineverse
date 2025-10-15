import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { UserRoute } from "@/components/ProtectedRoute";
import { ChatWrapper } from "@/components/chat/ChatWrapper";
import { initializeSecurity } from "@/lib/security";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import MyLists from "./pages/MyLists";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize security monitoring on app start
    initializeSecurity();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/discover" element={<Discover />} />
                <Route 
                  path="/my-lists" 
                  element={
                    <UserRoute>
                      <MyLists />
                    </UserRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <UserRoute>
                      <Profile />
                    </UserRoute>
                  } 
                />
                <Route path="/login" element={<Login />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Global Chat Assistant */}
              <ChatWrapper />
            </BrowserRouter>
          </TooltipProvider>
        </ChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
