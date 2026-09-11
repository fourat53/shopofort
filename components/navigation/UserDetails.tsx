import Image from "next/image";
import type { KindeUser } from "@/lib/entity/types";

function AvatarImage({ user }: { user: KindeUser }) {
	return (
		<div className="size-8 flex items-center justify-center rounded-lg">
			{user.picture ? (
				<Image
					src={user.picture}
					alt=""
					width={1000}
					height={1000}
					className="rounded-lg"
				/>
			) : (
				<Image
					src="/svgs/shopofort.svg"
					alt=""
					width={32}
					height={32}
					loading="eager"
					className="bg-mist-500 rounded-lg p-0.5"
				/>
			)}
		</div>
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
