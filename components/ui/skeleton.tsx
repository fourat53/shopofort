import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn(
				"w-full h-4 animate-pulse rounded-md bg-mist-300/80 dark:bg-muted",
				className,
			)}
			{...props}
		/>
	);
}

export { Skeleton };
