import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import SmartRouter from "@/components/smart-router";
import ToolsIndex from "@/pages/tools-index";
import ToolPage from "@/pages/tool-page";
import Account from "@/pages/account";
import Subscribe from "@/pages/subscribe";
import Pricing from "@/pages/pricing";
import Checkout from "@/pages/checkout";
import Privacy from "@/pages/privacy";
import Support from "@/pages/support";
import SupportSuccess from "@/pages/support-success";
import AdminFeedback from "@/pages/admin-feedback";
import Help from "@/pages/help";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/account" component={Account} />
      <Route path="/tools/:slug" component={ToolPage} />
      <Route path="/tools" component={ToolsIndex} />
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/support" component={Support} />
      <Route path="/support-success" component={SupportSuccess} />
      <Route path="/admin/feedback" component={AdminFeedback} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/help" component={Help} />
      <Route path="/app" component={SmartRouter} />
      <Route path="/" component={SmartRouter} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Main() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default Main;
