import { getCurrentUserData } from "@/app/actions/getCurrentUser";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  MapPin,
  Sparkles,
  Mail,
  Calendar,
  FileText,
  Edit3,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CandidateProfilePage() {
  const user = await getCurrentUserData();

  if (!user) {
    redirect("/sign-in");
  }

  if (!user.candidateProfile) {
    redirect("/dashboard/candidate/profile/setup");
  }

  const { candidateProfile } = user;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      {/* Header / Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/candidate/profile/setup">
          <Button variant="outline" className="gap-2 bg-background/50 hover:bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all">
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="relative group">
        <Card className="overflow-hidden border-none shadow-2xl bg-background/40 backdrop-blur-xl">
          {/* Banner Image */}
          <div className="relative h-64 w-full bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 overflow-hidden">
            {user.profileBanner ? (
              <Image
                src={user.profileBanner}
                alt="Profile Banner"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <Sparkles className="h-20 w-20 text-primary animate-pulse" />
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent" />
          </div>

          <CardContent className="relative px-8 pb-10">
            {/* Avatar Layer */}
            <div className="absolute -top-20 left-8">
              <div className="relative h-40 w-40 rounded-full border-4 border-background shadow-2xl overflow-hidden bg-muted group/avatar">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name || "User"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-primary/10">
                    <Sparkles className="h-12 w-12 text-primary" />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="pt-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column: Basic Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                  <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    {user.name}
                  </h1>
                  <p className="text-xl text-muted-foreground font-medium flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-indigo-400" />
                    {candidateProfile.primaryRole}
                  </p>
                </div>

                <Separator className="opacity-50" />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    Professional Bio
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg italic">
                    "{user.bio || "No professional bio provided yet. Tell recruiters about your passion and expertise!"}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <Calendar className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Experience</p>
                      <p className="text-lg font-semibold">{candidateProfile.experienceYears}+ Years</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                    <MapPin className="h-5 w-5 text-purple-500 mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Location</p>
                      <p className="text-lg font-semibold">{candidateProfile.location || "Remote"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Skills & Stats */}
              <div className="space-y-8">
                <section className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidateProfile.techStack.map((tech, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1 bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary transition-colors text-sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </section>

                <Separator className="opacity-50" />

                <section className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Target Level</h3>
                  <Badge className="text-lg px-4 py-1 bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                    {candidateProfile.targetLevel}
                  </Badge>
                </section>

                {candidateProfile.resumeUrl ? (
                  <section className="pt-6">
                    <Link href={candidateProfile.resumeUrl} target="_blank">
                      <Button className="w-full gap-2 py-6 text-md font-bold transition-all hover:scale-[1.02] bg-primary hover:bg-primary/90">
                        <FileText className="h-5 w-5" />
                        Download Resume
                        <ExternalLink className="h-4 w-4 opacity-50" />
                      </Button>
                    </Link>
                  </section>
                ) : (
                  <Card className="bg-destructive/5 border-destructive/20 p-4 text-center">
                    <p className="text-xs text-destructive font-medium uppercase tracking-wider">No Resume Uploaded</p>
                  </Card>
                )}

                <div className="space-y-2 pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}