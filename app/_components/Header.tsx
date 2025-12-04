import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { SunSnowIcon } from "lucide-react";
import Link from "next/link";

export default async function Header() {
  const { isAuthenticated } = await auth();

  return (
    <div className="w-screen h-16 flex items-center border-b border-border">
      <div className=" container max-w-8xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SunSnowIcon className="size-8 dark:text-green-400 text-green-500" />
          <h2 className="text-lg dark:text-green-50 text-green-950 font-bold">Sirus</h2>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href={"/dashboard"} className={buttonVariants()}>
                Dashboard
              </Link>

              <UserButton />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href={"/sign-in"}
                className={buttonVariants({ variant: "outline" })}
              >
                Sign In
              </Link>
              <Link href={"/sign-up"} className={buttonVariants()}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
