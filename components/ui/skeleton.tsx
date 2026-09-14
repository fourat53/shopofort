import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn(
				"w-full h-4 animate-pulse rounded-md bg-muted dark:bg-mist-700/40",
				className,
			)}
			{...props}
		/>
	);
}

export { Skeleton };
