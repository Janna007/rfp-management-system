import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Dashboard from "@/pages/Dashboard";
import RFPList from "@/pages/RFPList";
import CreateRFP from "@/pages/CreateRFP";
import RFPDetail from "@/pages/RFPDetail";
import VendorList from "@/pages/VendorList";
import ProposalList from "@/pages/ProposalList";
import CompareProposals from "@/pages/CompareProposals";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rfps" element={<RFPList />} />
            <Route path="/rfps/create" element={<CreateRFP />} />
            <Route path="/rfps/:id" element={<RFPDetail />} />
            <Route path="/vendors" element={<VendorList />} />
            <Route path="/proposals/:id" element={<ProposalList />} />
            <Route path="/compare/:id" element={<CompareProposals />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;
