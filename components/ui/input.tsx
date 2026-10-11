import type * as React from "react";
import { cn } from "@/lib/utils";

function Input({
	className,
	type,
	name,
	...props
}: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			name={name}
			aria-label={name}
			className={cn(
				"h-7 w-full min-w-0 rounded-md border border-border/80 bg-input px-2 py-0.5 text-xs transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
