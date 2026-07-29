import {
	IconChevronLeft,
	IconChevronRight,
	IconDots,
} from "@tabler/icons-react";
import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import type * as React from "react";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
	return (
		<nav
			aria-label="pagination"
			data-slot="pagination"
			className={className}
			{...props}
		/>
	);
}

function PaginationContent({
	className,
	...props
}: React.ComponentProps<"ul">) {
	return (
		<ul
			data-slot="pagination-content"
			className={cn("flex items-center gap-0.5", className)}
			{...props}
		/>
	);
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
	return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
	isActive?: boolean;
} & Pick<VariantProps<typeof buttonVariants>, "size" | "variant"> &
	React.ComponentProps<typeof Link>;

function PaginationLink({
	className,
	isActive,
	size = "icon",
	variant,
	...props
}: PaginationLinkProps) {
	return (
		<Link
			aria-current={isActive ? "page" : undefined}
			data-slot="pagination-link"
			data-active={isActive}
			className={cn(
				buttonVariants({
					variant: isActive ? "default" : (variant ?? "ghost"),
					size,
				}),
				className,
			)}
			{...props}
		/>
	);
}

function PaginationPrevious({
	className,
	text = "Previous",
	...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
	return (
		<PaginationLink
			aria-label="Go to previous page"
			size="default"
			className={cn("pl-2!", className)}
			{...props}
		>
			<IconChevronLeft data-icon="inline-start" className="cn-rtl-flip" />
			{text}
		</PaginationLink>
	);
}

function PaginationNext({
	className,
	text = "Next",
	...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
	return (
		<PaginationLink
			aria-label="Go to next page"
			size="default"
			className={cn("pr-2!", className)}
			{...props}
		>
			{text}
			<IconChevronRight data-icon="inline-end" className="cn-rtl-flip" />
		</PaginationLink>
	);
}

function PaginationEllipsis({
	className,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			aria-hidden
			data-slot="pagination-ellipsis"
			className={cn(
				"flex size-7 items-center justify-center [&_svg:not([class*='size-'])]:size-3.5",
				className,
			)}
			{...props}
		>
			<IconDots />
			<span className="sr-only">More pages</span>
		</span>
	);
}

export {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
};
