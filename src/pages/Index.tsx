

import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Homepage from "@/components/Homepage";
import PostCampForm from "@/components/PostCampForm";
import SponsorCamp from "@/components/SponsorCamp";
import BusinessRequest from "@/components/BusinessRequest";
import ProposalsPage from "@/components/ProposalsPage";
import AdminPanel from "@/components/AdminPanel";
import AuthPage from "@/components/AuthPage";
import PoliciesPage from "@/components/PoliciesPage";
import ContactPage from "@/components/ContactPage";
import CampDetailsPage from "@/components/CampDetailsPage";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Handle OAuth callback tokens in URL hash
  useEffect(() => {
    const handleOAuthCallback = () => {
      // Check if there are OAuth tokens in the URL hash
      const hash = window.location.hash;
      const currentPath = window.location.pathname;
      
      console.log('🔍 Checking OAuth callback - Hash:', hash, 'Path:', currentPath);
      
      if (hash && hash.includes('access_token=')) {
        console.log('✅ OAuth callback detected, processing tokens...');
        
        // Immediately redirect to home and clear the hash
        window.history.replaceState({}, document.title, '/');
        navigate('/', { replace: true });
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="h-16 flex items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <img src="/lovable-uploads/77473094-0c8e-4870-8a21-82dfb6bc828b.png" alt="Freedoctor.World" className="h-8 w-auto" />
                <h1 className="text-2xl font-bold text-primary">Freedoctor.World</h1>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/post-camp" element={<PostCampForm />} />
              <Route path="/sponsor" element={<SponsorCamp />} />
              <Route path="/business-request" element={<BusinessRequest />} />
              <Route path="/proposals" element={<ProposalsPage />} />
              <Route path="/policies" element={<PoliciesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/camp/:id" element={<CampDetailsPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
