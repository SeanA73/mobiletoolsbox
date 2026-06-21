import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  CheckCircle, Download, Play, Shield, RefreshCw, Award, 
  Drill, Briefcase, TrendingUp, CheckSquare, Edit3, Mic, 
  Calculator, Clock, Repeat, Globe, Layers, Target, 
  WifiOff, Smartphone, FolderSync, Mail, MessageCircle, HelpCircle,
  Menu, X, Check, Star, Coffee, UtensilsCrossed, Heart
} from "lucide-react";
import { useState } from "react";

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Drill className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">MobileToolsBox</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-primary transition-colors">Pricing</a>
              <a href="#download" className="text-slate-600 hover:text-primary transition-colors">Download</a>
              <a href="#contact" className="text-slate-600 hover:text-primary transition-colors">Contact</a>
              <Link href="/account" className="text-slate-600 hover:text-primary transition-colors">Sign In</Link>
              <Button asChild>
                <Link href="/app">Get Started</Link>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-slate-600 hover:text-primary">Features</a>
              <a href="#pricing" className="block px-3 py-2 text-slate-600 hover:text-primary">Pricing</a>
              <a href="#download" className="block px-3 py-2 text-slate-600 hover:text-primary">Download</a>
              <a href="#contact" className="block px-3 py-2 text-slate-600 hover:text-primary">Contact</a>
              <Link href="/account" className="block px-3 py-2 text-slate-600 hover:text-primary">Sign In</Link>
              <div className="px-3 py-2">
                <Button asChild className="w-full">
                  <Link href="/app">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-slate-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
            <div className="lg:col-span-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Your Ultimate
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                  Mobile Toolbox
                </span>
              </h1>
              <p className="mt-6 text-xl text-slate-600 leading-relaxed">
                10+ essential productivity tools in one beautiful app. From to-do lists to habit tracking, 
                everything you need to stay organized and productive.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/app" className="flex items-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Try Now</span>
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>Offline capable</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>Cross-platform</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 mt-12 lg:mt-0">
              <div className="relative">
                {/* Mock phone displaying app interface */}
                <div className="mx-auto w-80 h-[640px] bg-slate-900 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Status bar */}
                    <div className="bg-slate-50 h-8 flex items-center justify-between px-6 text-xs font-medium">
                      <span>9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-2 bg-slate-400 rounded-sm"></div>
                        <div className="w-6 h-3 border border-slate-400 rounded-sm">
                          <div className="w-4 h-full bg-secondary rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    {/* App content */}
                    <div className="p-4 h-full bg-gradient-to-br from-slate-50 to-white">
                      <div className="text-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900">MobileToolsBox</h2>
                        <p className="text-sm text-slate-600">Choose your tool</p>
                      </div>
                      {/* Drill grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                            <CheckSquare className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="font-semibold text-sm">To-Do</h3>
                          <p className="text-xs text-slate-600">Tasks & Lists</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
                            <Edit3 className="w-5 h-5 text-secondary" />
                          </div>
                          <h3 className="font-semibold text-sm">Notes</h3>
                          <p className="text-xs text-slate-600">Quick Notes</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                            <Mic className="w-5 h-5 text-red-600" />
                          </div>
                          <h3 className="font-semibold text-sm">Voice</h3>
                          <p className="text-xs text-slate-600">Recorder</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                            <Calculator className="w-5 h-5 text-purple-600" />
                          </div>
                          <h3 className="font-semibold text-sm">Calculator</h3>
                          <p className="text-xs text-slate-600">Math Tools</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                            <Clock className="w-5 h-5 text-orange-600" />
                          </div>
                          <h3 className="font-semibold text-sm">Timers</h3>
                          <p className="text-xs text-slate-600">Pomodoro</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                            <Target className="w-5 h-5 text-indigo-600" />
                          </div>
                          <h3 className="font-semibold text-sm">Habits</h3>
                          <p className="text-xs text-slate-600">Track Goals</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need in One App
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Carefully crafted tools organized by category for maximum productivity and ease of use.
            </p>
          </div>

          {/* Feature Categories */}
          <div className="space-y-16">
            {/* Productivity Tools */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                Productivity Tools
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="bg-slate-50 border-slate-200 hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <CheckSquare className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Smart To-Do Lists</h4>
                    <p className="text-slate-600 mb-4">Create, organize, and manage tasks with due dates, priorities, and categories. Never miss a deadline again.</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li className="flex items-center"><Check className="w-4 h-4 text-secondary mr-2" />Priority levels</li>
                      <li className="flex items-center"><Check className="w-4 h-4 text-secondary mr-2" />Due date reminders</li>
                      <li className="flex items-center"><Check className="w-4 h-4 text-secondary mr-2" />Category organization</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-slate-50 border-slate-200 hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                      <Edit3 className="w-6 h-6 text-secondary" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Rich Text Notes</h4>
                    <p className="text-slate-600 mb-4">Take detailed notes with formatting, images, and organization. Perfect for meetings, ideas, and documentation.</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li className="flex items-center"><Check className="w-4 h-4 text-secondary mr-2" />Rich text editing</li>
                      <li className="flex items-center"><Check className="w-4 h-4 text-secondary mr-2" />Folder organization</li>
                      <li className="flex items-center"><Check className="w-4 h-4 text-secondary mr-2" />Search functionality</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-slate-50 border-slate-200 hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                      <Mic className="w-6 h-6 text-red-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Voice Recorder</h4>
                    <p className="text-slate-600 mb-4">Record meetings, lectures, or voice memos with high-quality audio and easy playback controls.</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li className="flex items-center"><Check className="w-4 h-4 text-secondary mr-2" />High-quality recording</li>
                      <li className="flex items-center"><Check className="w-4 h-4 text-secondary mr-2" />Playback controls</li>
                      <li className="flex items-center"><Check className="w-4 h-4 text-secondary mr-2" />File management</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Utility Tools */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
                  <Drill className="w-5 h-5 text-secondary" />
                </div>
                Utility Tools
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="bg-slate-50 border-slate-200 hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <Calculator className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Calculator</h4>
                    <p className="text-slate-600">Advanced calculator with scientific functions and calculation history.</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-50 border-slate-200 hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Timer & Pomodoro</h4>
                    <p className="text-slate-600">Focus timers with Pomodoro technique support for better productivity.</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-50 border-slate-200 hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                      <Repeat className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Unit Converter</h4>
                    <p className="text-slate-600">Convert between different units for length, weight, temperature, and more.</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-50 border-slate-200 hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                      <Globe className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">World Clock</h4>
                    <p className="text-slate-600">Keep track of multiple time zones for global communication and travel.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Learning & Habits */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                </div>
                Learning & Habits
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-slate-50 border-slate-200 hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                      <Layers className="w-6 h-6 text-pink-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Smart Flashcards</h4>
                    <p className="text-slate-600 mb-4">Create and study flashcards with spaced repetition algorithm for optimal learning retention.</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li className="flex items-center"><Check className="w-4 h-4 text-secondary mr-2" />Spaced repetition</li>
                      <li className="flex items-center"><Check className="w-4 h-4 text-secondary mr-2" />Progress tracking</li>
                      <li className="flex items-center"><Check className="w-4 h-4 text-secondary mr-2" />Custom decks</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-slate-50 border-slate-200 hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                      <Target className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Habit Tracker</h4>
                    <p className="text-slate-600 mb-4">Build and maintain positive habits with visual progress tracking and smart reminders.</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li className="flex items-center"><Check className="w-4 h-4 text-secondary mr-2" />Daily tracking</li>
                      <li className="flex items-center"><Check className="w-4 h-4 text-secondary mr-2" />Progress visualization</li>
                      <li className="flex items-center"><Check className="w-4 h-4 text-secondary mr-2" />Smart notifications</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 lg:py-24 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Support Development
            </h2>
            <p className="text-2xl font-bold text-orange-600 mb-4">
              All features are 100% FREE. Forever. 🎉
            </p>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Love MobileToolsBox? Buy me a coffee to support continued development and help keep it free for everyone!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {/* Coffee Donation */}
            <Card className="border-2 border-slate-200 hover:border-orange-300 transition-all hover:shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <Coffee className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Buy me a coffee</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900">$3</span>
                </div>
                <p className="text-slate-600 mb-3">Support development with a coffee ☕</p>
                <p className="text-sm text-slate-500 italic mb-6">Covers 30 minutes of development</p>
                <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white" asChild>
                  <Link href="/pricing">Donate $3</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Lunch Donation */}
            <Card className="border-2 border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 relative hover:shadow-xl transition-all">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4">
                  <UtensilsCrossed className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Buy me lunch</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-orange-600">$5</span>
                </div>
                <p className="text-slate-600 mb-3">Keep me fueled while coding 🥗</p>
                <p className="text-sm text-slate-500 italic mb-6">Covers 1 hour of development</p>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" asChild>
                  <Link href="/pricing">Donate $5</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Generous Donation */}
            <Card className="border-2 border-slate-200 hover:border-orange-300 transition-all hover:shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Generous support</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900">$10</span>
                </div>
                <p className="text-slate-600 mb-3">Your generous support means everything! 💝</p>
                <p className="text-sm text-slate-500 italic mb-6">Covers cloud hosting for 1 month</p>
                <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white" asChild>
                  <Link href="/pricing">Donate $10</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* What's Included - Free */}
          <Card className="max-w-4xl mx-auto mb-8 bg-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center text-slate-900 mb-6">What's Included (100% Free)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center"><Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />15+ productivity tools</div>
                <div className="flex items-center"><Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />Unlimited usage</div>
                <div className="flex items-center"><Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />Voice Recording & Transcription</div>
                <div className="flex items-center"><Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />Flashcards & Study Tools</div>
                <div className="flex items-center"><Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />Habit & Project Tracking</div>
                <div className="flex items-center"><Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />Cloud Sync</div>
                <div className="flex items-center"><Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />No ads, ever</div>
                <div className="flex items-center"><Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />Regular updates</div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <p className="text-slate-600 mb-4">All features are free forever • Your support helps keep it that way!</p>
            <div className="flex justify-center items-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Secure payments</span>
              </div>
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>30-day guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Download MobileToolsBox
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Available on all major platforms. Start boosting your productivity today.
            </p>
          </div>

          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Try it as a Web App</h3>
              <p className="text-slate-600 mb-6">Experience MobileToolsBox directly in your browser with full PWA capabilities.</p>
              <Button size="lg" asChild>
                <Link href="/app">Launch Web App</Link>
              </Button>
              <div className="mt-4 flex justify-center items-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center space-x-2">
                  <WifiOff className="w-4 h-4" />
                  <span>Works offline</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Install on device</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FolderSync className="w-4 h-4" />
                  <span>Cross-platform sync</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-slate-600">
              Have questions, feedback, or need support? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Email Support</h4>
                    <p className="text-slate-600">support@mobiletoolsbox.app</p>
                    <p className="text-sm text-slate-500">We typically respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Live Chat</h4>
                    <p className="text-slate-600">Available Monday-Friday, 9 AM - 6 PM EST</p>
                    <Button variant="link" className="p-0 h-auto text-primary">Start chat →</Button>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Help Center</h4>
                    <p className="text-slate-600">Find answers to common questions</p>
                    <Button variant="link" className="p-0 h-auto text-primary">Visit help center →</Button>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Send us a Message</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="support">Technical Support</SelectItem>
                              <SelectItem value="billing">Billing Question</SelectItem>
                              <SelectItem value="feature">Feature Request</SelectItem>
                              <SelectItem value="bug">Bug Report</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={5} 
                              placeholder="Tell us how we can help you..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Drill className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">MobileToolsBox</span>
              </div>
              <p className="text-slate-400 mb-4">
                Your ultimate mobile productivity suite. Everything you need to stay organized and productive.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#download" className="text-slate-400 hover:text-white transition-colors">Download</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Release Notes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 MobileToolsBox. All rights reserved. Made with ❤️ for productivity enthusiasts.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
