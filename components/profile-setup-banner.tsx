import Link from "next/link";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type ProfileSetupDialogProps = {
  defaultOpen: boolean;
  name: string;
};

export async function ProfileSetupBanner({
  defaultOpen,
  name,
}: ProfileSetupDialogProps) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Welcome, {name}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          You’ve successfully logged into your account. Before you continue,
          let’s quickly set up your candidate profile so we can give you the
          best experience.
        </DialogDescription>

        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          <p>You will be asked to fill in:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Primary role & experience</li>
            <li>Tech stack & target level</li>
            <li>Preferred location</li>
          </ul>
        </div>

        <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Skip for now</Link>
          </Button>
          <Button asChild>
            <Link href="/candidate/profile/setup">Complete profile</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
