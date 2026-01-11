"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import UploadCard from "@/components/upload-card";
import { profileSchema, type ProfileFormValues } from "./form-schema";
import { Briefcase, MapPin, Sparkles, User as UserIcon, Loader2, PartyPopper } from "lucide-react";
import { updateCandidateProfile } from "./actions";

interface ProfileSetupFormProps {
    initialData: {
        name: string | null;
        email: string;
        avatar: string | null;
        profileBanner: string | null;
        bio: string | null;
        candidateProfile: {
            primaryRole: string;
            experienceYears: number;
            targetLevel: "Junior" | "Mid" | "Senior" | "Lead";
            location: string | null;
            techStack: string[];
            resumeUrl: string | null;
        } | null;
    };
}

export default function ProfileSetupForm({ initialData }: ProfileSetupFormProps) {
    const router = useRouter();
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [banner, setBanner] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(initialData?.profileBanner || null);

    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatar || null);

    const [resume, setResume] = useState<File | null>(null);


    const [techStackInput, setTechStackInput] = useState(
        initialData?.candidateProfile?.techStack?.join(", ") || ""
    );

    const mutation = useMutation({
        mutationFn: updateCandidateProfile,
        onSuccess: (data: { success?: string; error?: string }) => {
            if (data.success) {
                setIsSuccessOpen(true);
            } else {
                console.error(data.error);
            }
        },
        onError: (error: Error) => {
            console.error("Submission failed", error);
        }
    });

    const isLoading = mutation.isPending;

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: initialData?.name || "",
            primaryRole: initialData?.candidateProfile?.primaryRole || "",
            experienceYears: initialData?.candidateProfile?.experienceYears || 0,
            targetLevel: (initialData?.candidateProfile?.targetLevel as any) || "Mid",
            location: initialData?.candidateProfile?.location || "",
            techStack: initialData?.candidateProfile?.techStack || [],
            bio: initialData?.bio || "",
        },
    });

    useEffect(() => {
        return () => {
            // Only revoke if it's a blob URL we created
            if (bannerPreview && bannerPreview.startsWith("blob:")) {
                URL.revokeObjectURL(bannerPreview);
            }
            if (avatarPreview && avatarPreview.startsWith("blob:")) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [bannerPreview, avatarPreview]);

    const onSubmit = async (values: ProfileFormValues) => {
        const formData = new FormData();

        // Append text fields
        Object.entries(values).forEach(([key, value]) => {
            if (key === "techStack") {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, String(value));
            }
        });

        // Append files
        if (banner) formData.append("banner", banner);
        if (avatar) formData.append("avatar", avatar);
        if (resume) formData.append("resume", resume);

        mutation.mutate(formData);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Media Section */}
                    <Card className="md:col-span-3 overflow-visible">
                        <CardHeader>
                            <CardTitle>Profile Media</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-0">
                            <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Banner Upload */}
                                <UploadCard
                                    label="Profile Banner"
                                    description="Upload a high-quality banner for your profile (max 5MB)"
                                    aspect="banner"
                                    preview={bannerPreview}
                                    file={banner}
                                    onFileSelect={(file) => {
                                        setBanner(file);
                                        setBannerPreview(URL.createObjectURL(file));
                                    }}
                                    onClear={() => {
                                        setBanner(null);
                                        setBannerPreview(null);
                                    }}
                                />

                                {/* Avatar Upload - Overlapping Banner */}
                                <UploadCard
                                    label="Profile Avatar"
                                    description="Upload a high-quality avatar for your profile (max 5MB)"
                                    aspect="avatar"
                                    preview={avatarPreview}
                                    file={avatar}
                                    onFileSelect={(file) => {
                                        setAvatar(file);
                                        setAvatarPreview(URL.createObjectURL(file));
                                    }}
                                    onClear={() => {
                                        setAvatar(null);
                                        setAvatarPreview(null);
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Basic Info */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon className="h-5 w-5 text-primary" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input className="pl-9" placeholder="Mumbai, India" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Professional Bio</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us about yourself and your career goals..."
                                                className="min-h-[120px] resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This will be shown on your profile to recruiters.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Professional Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-primary" />
                                Professional
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="primaryRole"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Primary Role</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Frontend Engineer" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="experienceYears"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Years of Experience</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.valueAsNumber || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="targetLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Target Level</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select level" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Junior">Junior</SelectItem>
                                                <SelectItem value="Mid">Mid</SelectItem>
                                                <SelectItem value="Senior">Senior</SelectItem>
                                                <SelectItem value="Lead">Lead</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Tech Stack */}
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Tech Stack & Skills
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="techStack"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Skills (Comma separated)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="React, Next.js, TypeScript, Node.js"
                                                value={techStackInput}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const val = e.target.value;
                                                    setTechStackInput(val);
                                                    // Only update the form state with actual values
                                                    const array = val.split(",")
                                                        .map((s: string) => s.trim())
                                                        .filter(Boolean);
                                                    field.onChange(array);
                                                }}
                                                onBlur={() => {
                                                    // On blur, clean up the display value to match the form state
                                                    setTechStackInput(field.value.join(", "));
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Enter your top skills separated by commas.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Resume Upload */}
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Resume / CV</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <Input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const file = e.target.files?.[0];
                                        if (file) setResume(file);
                                    }}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Accepted formats: PDF, DOC, DOCX. Max size 10MB.
                                </p>
                                {resume && (
                                    <div className="text-sm font-medium text-primary flex items-center gap-2">
                                        Selected: {resume.name}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-1"
                                            onClick={() => setResume(null)}
                                        >
                                            Change
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" type="button" disabled={isLoading}>
                        Save Draft
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Complete Profile
                    </Button>
                </div>
            </form>

            <Dialog open={isSuccessOpen} onOpenChange={(open) => {
                if (!open) router.push("/dashboard/candidate/profile");
                setIsSuccessOpen(open);
            }}>
                <DialogContent className="sm:max-w-md border-none bg-background/80 backdrop-blur-xl shadow-2xl">
                    <DialogHeader className="flex flex-col items-center justify-center space-y-4 py-6">
                        <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center animate-bounce">
                            <PartyPopper className="h-10 w-10 text-green-500" />
                        </div>
                        <DialogTitle className="text-3xl font-bold bg-linear-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                            Congratulations!
                        </DialogTitle>
                        <DialogDescription className="text-center text-lg text-muted-foreground">
                            Your professional profile has been successfully updated. Recruiters can now discover your amazing skills!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 pb-4">
                        <Button
                            className="w-full bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-6 text-lg transition-all hover:scale-[1.02]"
                            onClick={() => router.push("/dashboard/candidate/profile")}
                        >
                            View My Profile
                        </Button>
                        <p className="text-center text-xs text-muted-foreground animate-pulse">
                            Redirecting you in a few seconds...
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </Form>
    );
}
