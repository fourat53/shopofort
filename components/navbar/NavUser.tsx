import {
	LoginLink,
	LogoutLink,
	RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
	IconDashboard,
	IconDotsVertical,
	IconLogin,
	IconLogout,
	IconRegistered,
} from "@tabler/icons-react";
import Link from "next/link";
import ThemeMenu from "@/components/navigation/ThemeMenu";
import { AvatarImage, UserInfo } from "@/components/navigation/UserDetails";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { KindeUser } from "@/lib/entity/types";

export default async function NavUser() {
	const { isAuthenticated, getUser, getPermissions } = getKindeServerSession();

	const isLoggedIn = await isAuthenticated();
	let user: KindeUser | null = null;
	let isAdmin: boolean | undefined;

	if (isLoggedIn) {
		user = await getUser();
		const userPermissions = await getPermissions();
		isAdmin = userPermissions?.permissions.includes("ADMIN_ACCESS");
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost">
					<IconDotsVertical className="ml-auto size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
				sideOffset={18}
				align="end"
			>
				{user && (
					<>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<AvatarImage user={user} />
								<UserInfo user={user} />
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
					</>
				)}
				<DropdownMenuGroup>
					{isAdmin && (
						<Link href="/admin/dashboard">
							<DropdownMenuItem asChild>
								<div>
									<IconDashboard />
									Dashboard
								</div>
							</DropdownMenuItem>
						</Link>
					)}
					<ThemeMenu />
				</DropdownMenuGroup>
				<DropdownMenuSeparator className="my-0.5" />
				{user ? (
					<LogoutLink>
						<DropdownMenuItem asChild variant="destructive">
							<div>
								<IconLogout />
								Sign Out
							</div>
						</DropdownMenuItem>
					</LogoutLink>
				) : (
					<>
						<LoginLink>
							<DropdownMenuItem asChild>
								<div>
									<IconLogin />
									Sign In
								</div>
							</DropdownMenuItem>
						</LoginLink>
						<RegisterLink>
							<DropdownMenuItem asChild>
								<div>
									<IconRegistered />
									Sign Up
								</div>
							</DropdownMenuItem>
						</RegisterLink>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
