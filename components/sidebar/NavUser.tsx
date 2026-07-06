import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

function AvatarImage({ user }: { user: KindeUser<Record<string, unknown>> }) {
  return (
    <div className="size-8 flex items-center justify-center rounded-lg">
      {user.picture ? (
        <Image
          src={user.picture}
          alt={user.given_name || ""}
          width={32}
          height={32}
          className="rounded-lg"
        />
      ) : (
        user.given_name &&
        user.given_name.length > 0 && (
          <div className="text-xl text-semibold bg-accent">
            name.charAt(0).toUpperCase
          </div>
        )
      )}
    </div>
  );
}

function UserInfo({ user }: { user: KindeUser<Record<string, unknown>> }) {
  return (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-medium">
        {user.given_name} {user.family_name}
      </span>
      <span className="truncate text-xs text-muted-foreground">
        {user.email}
      </span>
    </div>
  );
}

async function NavUser() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();
  const isLoggedIn = await isAuthenticated();

  if (!isLoggedIn || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem className="w-full p-1.5">
          <div className="w-full flex gap-2 items-center justify-center">
            <Button className="w-23/48">
              <LoginLink>Login</LoginLink>
            </Button>
            <Button className="w-23/48" variant="outline">
              <RegisterLink>Sign Up</RegisterLink>
            </Button>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <AvatarImage user={user} />
              <UserInfo user={user} />
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={"right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <AvatarImage user={user} />
                <UserInfo user={user} />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-0.5" />
            <DropdownMenuItem variant="destructive">
              <LogoutLink className="flex items-center pl-0.5 gap-1.5">
                <IconLogout />
                Log out
              </LogoutLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export { AvatarImage, UserInfo, NavUser };
