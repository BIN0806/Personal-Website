import { Switch, Route, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import { BlogIndex, BlogProjectPage, BlogEntryPage, BlogArticlePage } from "@/pages/blog";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={BlogIndex} />
      <Route path="/blog/projects/nolan-amc-event-study/work-log">
        <Redirect to="/blog/projects/nolan-amc-event-study" />
      </Route>
      <Route path="/blog/:projectSlug/:setupSlug/:updateSlug" component={BlogArticlePage} />
      <Route path="/blog/:projectSlug/:entrySlug" component={BlogEntryPage} />
      <Route path="/blog/:projectSlug" component={BlogProjectPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
