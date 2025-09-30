'use client';

import { BookOpenIcon, HomeIcon, LogOutIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/authStore';

interface NavigationProps {
  children: React.ReactNode;
}

/**
 * Navigation component that provides the main application navigation using shadcn/ui sidebar
 * - Responsive sidebar navigation with collapse/expand functionality
 * - Active route highlighting
 * - User authentication status and logout functionality
 * - Organized navigation structure for different app sections
 */
export default function Navigation({ children }: NavigationProps) {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();

  const navigationItems = [
    {
      title: 'Dashboard',
      url: '/',
      icon: HomeIcon,
    },
    {
      title: 'Courses',
      url: '/courses',
      icon: BookOpenIcon,
    },
  ];

  const handleLogout = () => {
    clearAuth();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <BookOpenIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Senda CMS</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  Meditation Course Management
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                      >
                        <Link href={item.url}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <UserIcon className="size-4" />
                  <span className="truncate">
                    {user?.email || 'Unknown User'}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOutIcon className="size-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="mx-auto">
              <h1 className="font-semibold">
                {navigationItems.find((item) => item.url === pathname)?.title ||
                  'Senda CMS'}
              </h1>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
