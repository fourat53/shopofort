"use client";

import { IconLoader2 } from "@tabler/icons-react";
import type { VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type React from "react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		loading?: boolean;
		icon?: React.ReactNode;
		iconPosition?: "start" | "end";
		asChild?: boolean;
		border?: boolean;
		shadow?: boolean;
	};

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	loading = false,
	border = true,
	shadow = true,
	icon,
	iconPosition = "start",
	children,
	disabled,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot.Root : "button";
	const showIcon = loading || icon;

	return (
		<Comp
			data-slot="button"
			disabled={loading || disabled || false}
			className={cn(
				buttonVariants({ variant, size, className }),
				!border && "border-none",
				!shadow && "shadow-none",
				showIcon &&
					iconPosition === "end" &&
					"pl-4 flex-row-reverse items-center justify-between",
			)}
			{...props}
		>
			{showIcon && (loading ? <IconLoader2 className="animate-spin" /> : icon)}
			{children}
		</Comp>
	);
}

export { Button, buttonVariants };
