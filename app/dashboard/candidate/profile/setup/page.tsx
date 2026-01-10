import { getCurrentUserData } from "@/app/actions/getCurrentUser";
import ProfileSetupForm from "./profile-setup-form";

export default async function ProfileSetup() {
  const userData = await getCurrentUserData();

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please sign in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Setup Your Profile</h1>
        <p className="text-muted-foreground mt-2">
          Tell us about yourself and your professional background to get started.
        </p>
      </div>

      <ProfileSetupForm initialData={userData} />
    </div>
  );
}
