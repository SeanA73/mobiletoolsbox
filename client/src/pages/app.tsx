import { useState, useEffect, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useSearch } from "wouter";
import Navbar from "@/components/navbar";
import PremiumFeatureGuard from "@/components/premium-feature-guard";
import AdBanner from "@/components/ad-banner";
import UserTestingControls from "@/components/user-testing-controls";
import UserFeedbackTool from "@/components/tools/user-feedback";
import AppSettingsDialog from "@/components/app-settings";
import SmartAdPlacement from "@/components/ads/SmartAdPlacement";
import { initializeAdSense } from "@/lib/adsense";
import ToolCard from "@/components/tool-card";
import DonationButton from "@/components/donation-button";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ErrorBoundary } from "@/components/error-boundary";

// Lazy load all tool components - only load when needed
const EnhancedTodoTool = lazy(() => import("@/components/tools/enhanced-todo").then(m => ({ default: m.default })));
const EnhancedNotesTool = lazy(() => import("@/components/tools/enhanced-notes").then(m => ({ default: m.default })));
const EnhancedVoiceRecorderTool = lazy(() => import("@/components/tools/enhanced-voice-recorder").then(m => ({ default: m.default })));
const CalculatorTool = lazy(() => import("@/components/tools/calculator").then(m => ({ default: m.default })));
const UnitConverterTool = lazy(() => import("@/components/tools/unit-converter").then(m => ({ default: m.default })));
const WorldClockTool = lazy(() => import("@/components/tools/world-clock").then(m => ({ default: m.default })));
const FlashcardsTool = lazy(() => import("@/components/tools/flashcards").then(m => ({ default: m.default })));
const PomodoroTool = lazy(() => import("@/components/tools/pomodoro").then(m => ({ default: m.default })));
const HabitTrackerTool = lazy(() => import("@/components/tools/habit-tracker").then(m => ({ default: m.default })));
const PasswordGeneratorTool = lazy(() => import("@/components/tools/password-generator").then(m => ({ default: m.default })));
const QRScannerTool = lazy(() => import("@/components/tools/qr-scanner").then(m => ({ default: m.default })));
const FileConverterTool = lazy(() => import("@/components/tools/file-converter").then(m => ({ default: m.default })));
const EnhancedProjectTimer = lazy(() => import("@/components/tools/enhanced-project-timer").then(m => ({ default: m.default })));
const EnhancedIQTesterV2 = lazy(() => import("@/components/tools/enhanced-iq-tester-v2").then(m => ({ default: m.default })));
import { 
  CheckSquare, Edit3, Mic, Calculator, Clock, Repeat, 
  Globe, Layers, Target, Timer, Home, Star, Key, 
  QrCode, FileImage, MessageSquare, Brain, Quote,
  Trophy
} from "lucide-react";

type Tool = {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  category: string;
  premium?: boolean;
  adminOnly?: boolean;
  component: any;
};

const tools: Tool[] = [
  {
    id: "todo",
    name: "To-Do Lists",
    description: "Advanced task management with NLP, subtasks, and matrix views",
    icon: CheckSquare,
    color: "blue",
    category: "Productivity",
    component: EnhancedTodoTool,
  },
  {
    id: "notes",
    name: "Notes",
    description: "Rich text notes with markdown, templates, and smart organization",
    icon: Edit3,
    color: "emerald",
    category: "Productivity",
    component: EnhancedNotesTool,
  },
  {
    id: "voice-recorder",
    name: "Voice Recorder",
    description: "Record voice memos with AI transcription and sharing",
    icon: Mic,
    color: "red",
    category: "Productivity",
    component: EnhancedVoiceRecorderTool,
  },
  {
    id: "calculator",
    name: "Calculator",
    description: "Perform calculations",
    icon: Calculator,
    color: "purple",
    category: "Utility",
    component: CalculatorTool,
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Convert between units",
    icon: Repeat,
    color: "cyan",
    category: "Utility",
    component: UnitConverterTool,
  },
  {
    id: "world-clock",
    name: "World Clock",
    description: "Track multiple time zones",
    icon: Globe,
    color: "yellow",
    category: "Utility",
    component: WorldClockTool,
  },
  {
    id: "flashcards",
    name: "Flashcards",
    description: "Study with spaced repetition",
    icon: Layers,
    color: "pink",
    category: "Learning",
    premium: true,
    component: FlashcardsTool,
  },
  {
    id: "pomodoro",
    name: "Pomodoro Timer",
    description: "Focus with time blocks",
    icon: Timer,
    color: "indigo",
    category: "Learning",
    premium: true,
    component: PomodoroTool,
  },
  {
    id: "habit-tracker",
    name: "Habit Tracker",
    description: "Build positive habits",
    icon: Target,
    color: "green",
    category: "Learning",
    premium: true,
    component: HabitTrackerTool,
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Generate secure passwords",
    icon: Key,
    color: "red",
    category: "Security",
    component: PasswordGeneratorTool,
  },
  {
    id: "qr-scanner",
    name: "QR Code Scanner",
    description: "Scan and generate QR codes",
    icon: QrCode,
    color: "blue",
    category: "Utility",
    premium: true,
    component: QRScannerTool,
  },
  {
    id: "file-converter",
    name: "File Converter",
    description: "Convert files between formats",
    icon: FileImage,
    color: "purple",
    category: "Utility",
    premium: true,
    component: FileConverterTool,
  },
  {
    id: "user-feedback",
    name: "Feedback",
    description: "Submit feedback and suggestions",
    icon: MessageSquare,
    color: "orange",
    category: "Settings",
    component: UserFeedbackTool,
  },
  // Revenue dashboard - admin only (requires admin/superuser role)
  {
    id: "monetization-dashboard",
    name: "Revenue Dashboard",
    description: "Track revenue and user testing",
    icon: Quote,
    color: "green",
    category: "Settings",
    component: UserTestingControls,
    adminOnly: true, // Only visible to admin/superuser
  },

  {
    id: "project-timer",
    name: "Project Timer",
    description: "Advanced time tracking with AI insights and project management",
    icon: Clock,
    color: "blue",
    category: "Productivity",
    component: EnhancedProjectTimer,
  },
  {
    id: "iq-tester",
    name: "IQ Tester",
    description: "Advanced cognitive assessment with progress tracking and comprehensive analytics",
    icon: Brain,
    color: "purple",
    category: "Learning",
    component: EnhancedIQTesterV2,
  },
];

// Categories - defined outside component to prevent recreation on every render
const getAllCategories = (availableTools: Tool[]) => [
  { id: "all", name: "All Tools", count: availableTools.length, icon: Home, color: "bg-gray-100 text-gray-700" },
  { id: "Productivity", name: "Productivity", count: availableTools.filter(t => t.category === "Productivity").length, icon: CheckSquare, color: "bg-blue-100 text-blue-700" },
  { id: "Utility", name: "Utility", count: availableTools.filter(t => t.category === "Utility").length, icon: Calculator, color: "bg-green-100 text-green-700" },
  { id: "Learning", name: "Learning & Habits", count: availableTools.filter(t => t.category === "Learning").length, icon: Layers, color: "bg-purple-100 text-purple-700" },
  { id: "Security", name: "Security", count: availableTools.filter(t => t.category === "Security").length, icon: Key, color: "bg-red-100 text-red-700" },
];

export default function App() {
  const searchString = useSearch();
  // Read an optional ?tool=<id> deep link so SEO tool pages can land users
  // directly on the right tool instead of the generic grid.
  const initialTool = (() => {
    const params = new URLSearchParams(searchString);
    const requested = params.get("tool");
    return requested && tools.some(t => t.id === requested) ? requested : null;
  })();

  const [selectedTool, setSelectedToolState] = useState<string | null>(initialTool);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [adSenseLoaded, setAdSenseLoaded] = useState(false);
  const { isAdmin } = useAuth();

  // Update tool selection AND keep the URL in sync, so deep links, the browser
  // back button, and shareable links all behave correctly.
  const setSelectedTool = (toolId: string | null) => {
    setSelectedToolState(toolId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (toolId) {
        url.searchParams.set("tool", toolId);
      } else {
        url.searchParams.delete("tool");
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Initialize AdSense - defer to not block initial render
  useEffect(() => {
    const initAds = async () => {
      try {
        // Only initialize in browser environment
        if (typeof window !== 'undefined') {
          // Wait for idle time to not block main thread
          if ('requestIdleCallback' in window) {
            requestIdleCallback(async () => {
              await initializeAdSense();
              setAdSenseLoaded(true);
            }, { timeout: 2000 });
          } else {
            // Fallback: delay by 500ms after page load
            setTimeout(async () => {
              await initializeAdSense();
              setAdSenseLoaded(true);
            }, 500);
          }
        }
      } catch (error) {
        console.log('AdSense not available:', error);
        // Continue without ads if AdSense fails
        setAdSenseLoaded(false);
      }
    };
    
    initAds();
  }, []);

  // Filter tools based on category and admin access
  // Exclude feedback and revenue dashboard from main tools grid
  const availableTools = tools.filter(tool => {
    // Hide feedback and revenue dashboard (accessed via navbar)
    if (tool.id === "user-feedback" || tool.id === "monetization-dashboard") {
      return false;
    }
    // Hide admin-only tools from non-admin users
    if (tool.adminOnly && !isAdmin) {
      return false;
    }
    return true;
  });

  const filteredTools = selectedCategory === "all" 
    ? availableTools 
    : availableTools.filter(tool => tool.category === selectedCategory);

  const categories = getAllCategories(availableTools);
  const selectedToolData = availableTools.find(tool => tool.id === selectedTool);

  // Loading skeleton for lazy-loaded tools
  const ToolLoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (selectedTool && selectedToolData) {
    const ToolComponent = selectedToolData.component;
    
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar 
          onBack={() => setSelectedTool(null)} 
          title={selectedToolData.name}
          onFeedbackClick={() => setShowFeedback(true)}
          onRevenueClick={() => setShowRevenue(true)}
          onSettingsClick={() => setShowSettings(true)}
          isAdmin={isAdmin}
        />
        <div className="p-4">
          <ErrorBoundary>
            <Suspense fallback={<ToolLoadingSkeleton />}>
              <PremiumFeatureGuard>
                <ToolComponent />
              </PremiumFeatureGuard>
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* Dialogs */}
        <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
          <DialogContent className="max-w-2xl">
            <UserFeedbackTool />
          </DialogContent>
        </Dialog>

        <Dialog open={showRevenue} onOpenChange={setShowRevenue}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <UserTestingControls />
          </DialogContent>
        </Dialog>

        <AppSettingsDialog isOpen={showSettings} onClose={() => setShowSettings(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar 
        onFeedbackClick={() => setShowFeedback(true)}
        onRevenueClick={() => setShowRevenue(true)}
        onSettingsClick={() => setShowSettings(true)}
        isAdmin={isAdmin}
      />
      
      <div className="p-4 max-w-7xl mx-auto">
        {/* DemoModeBanner removed - site is free to use */}
        
        {/* Compact Hero Section */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-2xl p-6 border border-indigo-200/50 dark:border-gray-600/50 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Main content */}
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Welcome to MobileToolsBox
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mb-3">
                  Your all-in-one productivity suite. All tools are completely free to use.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                    <CheckSquare className="h-4 w-4" />
                    <span>Productivity Tools</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                    <Star className="h-4 w-4" />
                    <span>Always Free</span>
                  </div>
                </div>
              </div>
              
              {/* Support section */}
              <div className="flex flex-col items-center lg:items-end space-y-2">
                <div className="text-sm text-slate-500 dark:text-slate-400 text-center lg:text-right">
                  Enjoying MobileToolsBox?
                </div>
                <DonationButton />
              </div>
            </div>
          </div>

          {/* Subtle ad placement after hero */}
          {adSenseLoaded && (
            <div className="mb-6">
              <SmartAdPlacement 
                placement="landing" 
                adSlot="1234567890"
                className="max-w-4xl mx-auto"
                onAdShown={() => console.log('Landing page ad shown')}
              />
            </div>
          )}

          {/* Category Filter */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`h-auto p-4 flex-col space-y-2 transition-all duration-200 ${
                      selectedCategory === category.id 
                        ? "ring-2 ring-blue-500 shadow-xl scale-105 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-500" 
                        : "hover:shadow-lg hover:scale-102 hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <div className="text-center">
                      <div className="font-medium text-xs">{category.name}</div>
                      <Badge 
                        variant={selectedCategory === category.id ? "default" : "secondary"}
                        className={`text-xs mt-1 ${
                          selectedCategory === category.id 
                            ? "bg-white/20 text-white border-white/30" 
                            : ""
                        }`}
                      >
                        {category.count}
                      </Badge>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool, index) => (
            <div key={tool.id}>
              <ToolCard
                tool={tool}
                onClick={() => setSelectedTool(tool.id)}
              />
              {/* Show ad after every 8 tools */}
              {adSenseLoaded && index === 7 && (
                <div className="mt-4">
                  <SmartAdPlacement 
                    placement="tools" 
                    adSlot="1234567890"
                    onAdShown={() => console.log('Tool grid ad shown')}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <Card className="p-8 text-center">
            <CardContent>
              <Home className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No tools found</h3>
              <p className="text-slate-600">Try selecting a different category.</p>
            </CardContent>
          </Card>
        )}

        {/* Footer Ad */}
        {adSenseLoaded && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <SmartAdPlacement 
              placement="landing" 
              adSlot="9988776655"
              className="max-w-4xl mx-auto"
              onAdShown={() => console.log('Footer ad shown')}
            />
          </div>
        )}

      </div>

      {/* Dialogs */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="max-w-2xl">
          <UserFeedbackTool />
        </DialogContent>
      </Dialog>

      <Dialog open={showRevenue} onOpenChange={setShowRevenue}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <UserTestingControls />
        </DialogContent>
      </Dialog>

      <AppSettingsDialog isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
