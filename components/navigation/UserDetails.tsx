import { IconShoppingBag } from "@tabler/icons-react";
import Image from "next/image";
import type { KindeUser } from "@/lib/entity/types";

function AvatarImage({ user }: { user: KindeUser }) {
	return (
		<>
			{user.picture ? (
				<Image
					src={user.picture}
					alt="profile pic"
					width={1000}
					height={1000}
					className="size-8 rounded-lg"
				/>
			) : (
				<div className="size-8 rounded-lg border flex flex-col items-center justify-center bg-muted/60">
					<IconShoppingBag className="size-5 opacity-50 text-muted-foreground" />
				</div>
			)}
		</>
	);
}

function UserInfo({ user }: { user: KindeUser }) {
	return (
		<div className="grid flex-1 text-left text-sm leading-tight">
			<span className="truncate font-medium">
				{user.given_name} {user.family_name}
			</span>
			<span className="truncate text-xs">{user.email}</span>
		</div>
	);
}

export { AvatarImage, UserInfo };
