
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Index />} />
          <Route path="/post-camp" element={<Index />} />
          <Route path="/sponsor" element={<Index />} />
          <Route path="/business-request" element={<Index />} />
          <Route path="/proposals" element={<Index />} />
          <Route path="/policies" element={<Index />} />
          <Route path="/contact" element={<Index />} />
          <Route path="/camp/:id" element={<Index />} />
          <Route path="/admin" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
