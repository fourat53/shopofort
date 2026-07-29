import { IconLoader2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function SmallLoader({
	className,
	iconClassName,
}: {
	className?: string;
	iconClassName?: string;
}) {
	return (
		<div
			className={cn(
				"w-full flex items-center justify-center text-primary",
				className,
			)}
		>
			<IconLoader2 className={cn("animate-spin", iconClassName)} />
		</div>
	);
}
