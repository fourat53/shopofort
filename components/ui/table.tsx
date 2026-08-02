"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
	return (
		<div
			data-slot="table-container"
			className="overflow-auto overscroll-none w-full rounded-lg border border-mist-300 dark:border-mist-700"
		>
			<table
				data-slot="table"
				className={cn("w-full caption-bottom text-xs", className)}
				{...props}
			/>
		</div>
	);
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
	return (
		<thead
			data-slot="table-header"
			className={cn(
				"[&_tr]:border-b border-mist-300 dark:border-mist-700",
				className,
			)}
			{...props}
		/>
	);
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
	return (
		<tbody
			data-slot="table-body"
			className={cn("[&_tr:last-child]:border-0", className)}
			{...props}
		/>
	);
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
	return (
		<tfoot
			data-slot="table-footer"
			className={cn(
				"font-medium border-t [&>tr]:last:border-b-0 bg-mist-300 dark:border-mist-700",
				className,
			)}
			{...props}
		/>
	);
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
	return (
		<tr
			data-slot="table-row"
			className={cn(
				"border-b border-mist-300 dark:border-mist-700 transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
				className,
			)}
			{...props}
		/>
	);
}

function TableHead({
	className,
	border = false,
	...props
}: React.ComponentProps<"th"> & { border?: boolean }) {
	return (
		<th
			data-slot="table-head"
			className={cn(
				"h-4 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0",
				border && "border-l border-mist-300 dark:border-mist-700",
				className,
			)}
			{...props}
		/>
	);
}

function TableCell({
	className,
	border = false,
	...props
}: React.ComponentProps<"td"> & { border?: boolean }) {
	return (
		<td
			data-slot="table-cell"
			className={cn(
				"p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0",
				border && "border-l border-mist-300 dark:border-mist-700",
				className,
			)}
			{...props}
		/>
	);
}

function TableCaption({
	className,
	...props
}: React.ComponentProps<"caption">) {
	return (
		<caption
			data-slot="table-caption"
			className={cn("mt-4 text-xs text-muted-foreground", className)}
			{...props}
		/>
	);
}

export {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
};
