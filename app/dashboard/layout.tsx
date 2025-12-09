import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import checkProfileSetup from "../actions/profileSetup";
import { ProfileSetupBanner } from "@/components/profile-setup-banner";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashbordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { needsProfile } = await checkProfileSetup();
  const user = await currentUser();

  const displayName =
    user?.firstName ?? user?.primaryEmailAddress?.emailAddress ?? "there";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center flex-row">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <UserButton />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {needsProfile && (
            <ProfileSetupBanner
              name={displayName}
            />
          )}
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
