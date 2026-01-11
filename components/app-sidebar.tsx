import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Interviews",
      url: "#",
      items: [
        {
          title: "Overview",
          url: "/dashboard/overview",
        },
        {
          title: "Interview Setup",
          url: "/dashboard/interview-setup",
        },
        {
          title: "Interview History",
          url: "/dashboard/interview-history",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

// DATABASE_URL="postgresql://neondb_owner:npg_Glth3iFUxpT6@ep-frosty-thunder-add4mjka-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
// # uncomment next line if you use Prisma <5.10
// # DATABASE_URL_UNPOOLED="postgresql://neondb_owner:npg_Glth3iFUxpT6@ep-frosty-thunder-add4mjka.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
