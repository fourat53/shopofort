import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
} from "@/components/ui/sidebar";
import NavMenu from "./NavMenu";

export default function NavMain() {
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					<NavMenu />
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
