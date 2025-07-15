

import { Routes, Route } from "react-router-dom";
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

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="h-16 flex items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <img src="/lovable-uploads/6fe10f9b-a47d-41e4-a10f-65e7c88af4c7.png" alt="Freedoctor.World" className="h-8 w-auto" />
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
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
