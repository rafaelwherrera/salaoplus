"use client";

import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Scissors,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/authi-client";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Agendamentos",
    url: "/agendamentos",
    icon: CalendarDays,
  },
  {
    title: "Profissionais",
    url: "/profissionais",
    icon: Scissors,
  },
  {
    title: "Clientes",
    url: "/cliente",
    icon: Users,
  },
  {
    title: "Produtos",
    url: "/produtos",
    icon: ShoppingCart,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const session = authClient.useSession();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center border-b p-4">
        <Link href="/dashboard">
          <p className="text-2xl font-bold">
            Salão<span className="text-pink-500">PLUS</span>
          </p>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="items-center justify-center">
          <SidebarGroupLabel className="text-center">
            <p>Menu</p>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname?.startsWith(item.url)}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="bg-pink-300">
                <SidebarMenuButton size="lg">
                  <Avatar>
                    <AvatarFallback>
                      {session.data?.user?.name?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      {session.data?.user?.salon?.name ?? "Sem nome"}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {session.data?.user?.email}
                    </p>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer"
                >
                  <LogOut />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
