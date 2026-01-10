"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import UploadCard from "@/components/upload-card";
import { profileSchema, type ProfileFormValues } from "./form-schema";
import { Briefcase, MapPin, Sparkles, User as UserIcon, Loader2 } from "lucide-react";
import { updateCandidateProfile } from "./actions";

interface ProfileSetupFormProps {
    initialData: any; // Using any for now to simplify, ideally we use a shared type
}

export default function ProfileSetupForm({ initialData }: ProfileSetupFormProps) {
    const [banner, setBanner] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(initialData?.profileBanner || null);

    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatar || null);

    const [resume, setResume] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const [techStackInput, setTechStackInput] = useState(
        initialData?.CandidateProfile?.techStack?.join(", ") || ""
    );

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: initialData?.name || "",
            primaryRole: initialData?.CandidateProfile?.primaryRole || "",
            experienceYears: initialData?.CandidateProfile?.experienceYears || 0,
            targetLevel: (initialData?.CandidateProfile?.targetLevel as any) || "Mid",
            location: initialData?.CandidateProfile?.location || "",
            techStack: initialData?.CandidateProfile?.techStack || [],
            bio: "", // Bio is not in the schema yet, placeholder
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
        setIsLoading(true);
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

        try {
            const result = await updateCandidateProfile(formData);
            if (result.success) {
                console.log("Profile updated!", values);
                // Maybe redirect or show toast
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Media Section */}
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Profile Media</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <label className="text-sm font-medium">Profile Banner</label>
                                <UploadCard
                                    label="Banner Image"
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
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-medium">Avatar</label>
                                <div className="w-40">
                                    <UploadCard
                                        label="Avatar Image"
                                        description="Your professional photo"
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
                                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
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
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setTechStackInput(val);
                                                    // Only update the form state with actual values
                                                    const array = val.split(",")
                                                        .map((s) => s.trim())
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
                                    onChange={(e) => {
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
        </Form>
    );
}
