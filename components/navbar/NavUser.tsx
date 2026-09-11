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
	const { isAuthenticated, getUser } = getKindeServerSession();
	const user: KindeUser | null = await getUser();
	const isLoggedIn = await isAuthenticated();
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
				{isLoggedIn && user && (
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
					<DropdownMenuItem asChild>
						<Link href="/admin/dashboard">
							<IconDashboard />
							Dashboard
						</Link>
					</DropdownMenuItem>
					<ThemeMenu />
				</DropdownMenuGroup>
				<DropdownMenuSeparator className="my-0.5" />
				{isLoggedIn && user ? (
					<DropdownMenuItem variant="destructive">
						<LogoutLink className="flex items-center pl-0.5 gap-1.5">
							<IconLogout />
							Sign Out
						</LogoutLink>
					</DropdownMenuItem>
				) : (
					<>
						<DropdownMenuItem>
							<LoginLink className="flex items-center pl-0.5 gap-1.5">
								<IconLogin className="rotate-180" />
								Sign In
							</LoginLink>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<RegisterLink className="flex items-center pl-0.5 gap-1.5">
								<IconRegistered />
								Sign Up
							</RegisterLink>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
