import { getCurrentUserData } from "@/app/actions/getCurrentUser";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Briefcase,
  FileText,
  Search,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Progress } from "@/components/ui/progress";

export default async function CandidateDashboardHome() {
  const user = await getCurrentUserData();

  if (!user) {
    redirect("/sign-in");
  }

  const hasProfile = !!user.candidateProfile;

  // Calculate profile completeness (simplified logic)
  let completeness = 0;
  if (user.name) completeness += 20;
  if (user.avatar) completeness += 20;
  if (user.bio) completeness += 20;
  if (hasProfile) {
    if (user.candidateProfile.resumeUrl) completeness += 20;
    if (user.candidateProfile.techStack.length > 0) completeness += 20;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header / Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Welcome back, {user.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's what's happening with your job search today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/jobs">
            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
              <Search className="mr-2 h-4 w-4" />
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Applied Jobs", value: "0", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Interviews", value: "0", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Profile Views", value: "12", icon: Target, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Offers", value: "0", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-xl bg-background/50 backdrop-blur-sm transition-all hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="mt-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Completeness Section */}
        <Card className="lg:col-span-1 border-none bg-linear-to-br from-indigo-500/5 to-purple-500/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles className="h-24 w-24 text-primary" />
          </div>
          <CardHeader>
            <CardTitle>Profile Completeness</CardTitle>
            <CardDescription>A complete profile gets 5x more attention.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Level {completeness === 100 ? "Pro" : "Intermediate"}</span>
                <span>{completeness}%</span>
              </div>
              <Progress value={completeness} className="h-2" />
            </div>
            <ul className="space-y-3">
              {[
                { label: "Add Bio & Experience", done: !!user.bio },
                { label: "Upload Avatar", done: !!user.avatar },
                { label: "Tech Stack & Skills", done: hasProfile && user.candidateProfile.techStack.length > 0 },
                { label: "Upload Resume", done: hasProfile && !!user.candidateProfile.resumeUrl },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div className={`rounded-full p-0.5 ${item.done ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}>
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className={item.done ? "text-foreground font-medium" : "text-muted-foreground"}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard/candidate/profile/setup" className="block pt-2">
              <Button className="w-full group" variant={completeness === 100 ? "outline" : "default"}>
                {completeness === 100 ? "View Profile" : "Complete Profile"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Suggestions / Recent Activity Placeholder */}
        <Card className="lg:col-span-2 border-none shadow-2xl bg-background/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Keep track of your interactions and job updates.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] flex flex-col items-center justify-center text-center p-8">
            <div className="bg-muted/50 p-6 rounded-full mb-4">
              <Briefcase className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to start?</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              You haven't applied to any jobs yet. Start your journey by exploring matches that fit your profile.
            </p>
            <Link href="/jobs">
              <Button variant="outline" className="px-8">
                Find Job Matches
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
