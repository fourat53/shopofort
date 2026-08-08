"use client";

import {
	type Icon,
	IconDeviceDesktop,
	IconMoon,
	IconPalette,
	IconSun,
} from "@tabler/icons-react";
import { type DefaultTheme, useTheme } from "@wrksz/themes/client";
import {
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

type ThemeType = {
	icon: Icon;
	value: DefaultTheme;
};

const themes: ThemeType[] = [
	{ icon: IconSun, value: "light" },
	{ icon: IconMoon, value: "dark" },
	{ icon: IconDeviceDesktop, value: "system" },
] as const;

export default function ThemeMenu() {
	const { theme, setTheme } = useTheme();
	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<IconPalette />
				Theme
			</DropdownMenuSubTrigger>
			<DropdownMenuPortal>
				<DropdownMenuSubContent>
					<DropdownMenuGroup>
						<DropdownMenuLabel>Appearance</DropdownMenuLabel>
						<DropdownMenuRadioGroup
							value={theme}
							onValueChange={(val) => setTheme(val as DefaultTheme)}
						>
							{themes.map((theme) => (
								<DropdownMenuRadioItem key={theme.value} value={theme.value}>
									<theme.icon />
									{theme.value}
								</DropdownMenuRadioItem>
							))}
						</DropdownMenuRadioGroup>
					</DropdownMenuGroup>
				</DropdownMenuSubContent>
			</DropdownMenuPortal>
		</DropdownMenuSub>
	);
}
