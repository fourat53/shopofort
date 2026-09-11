import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { IconDotsVertical, IconLogout } from "@tabler/icons-react";
import ThemeMenu from "@/components/navigation/ThemeMenu";
import { AvatarImage, UserInfo } from "@/components/navigation/UserDetails";
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
import type { KindeUser } from "@/lib/entity/types";

export default async function SidebarUser() {
	const { isAuthenticated, getUser } = getKindeServerSession();

	const isLoggedIn = await isAuthenticated();
	let user: KindeUser | null = null;
	if (isLoggedIn) user = await getUser();

	if (!user) return;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton size="lg">
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
							<ThemeMenu />
						</DropdownMenuGroup>
						<DropdownMenuSeparator className="my-0.5" />
						<LogoutLink>
							<DropdownMenuItem variant="destructive">
								<IconLogout />
								Sign Out
							</DropdownMenuItem>
						</LogoutLink>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
