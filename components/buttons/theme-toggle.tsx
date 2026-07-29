"use client";

import { type Icon, IconMoon, IconSun, IconSunMoon } from "@tabler/icons-react";
import { useTheme } from "@wrksz/themes/client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ThemeType = {
	icon: Icon;
	value: "light" | "dark" | "system";
};

const themes: ThemeType[] = [
	{ icon: IconSun, value: "light" },
	{ icon: IconMoon, value: "dark" },
	{ icon: IconSunMoon, value: "system" },
] as const;

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="size-7.5 rounded-xl">
					{theme === "light" ? (
						<IconSun className="size-4" />
					) : theme === "dark" ? (
						<IconMoon className="size-4" />
					) : (
						<IconSunMoon className="size-4" />
					)}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="flex flex-col gap-0.75">
				{themes.map((t) => (
					<DropdownMenuItem
						key={t.value}
						onClick={() => setTheme(t.value)}
						className={cn(
							t.value === theme &&
								"bg-primary text-white border border-mist-50 shadow-[0px_0px_4px_0.5px_rgba(20,38,41,0.5)]",
							"cursor-pointer hover:bg-primary",
						)}
					>
						<t.icon className="size-4" />
						{t.value.charAt(0).toUpperCase() + t.value.slice(1)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
