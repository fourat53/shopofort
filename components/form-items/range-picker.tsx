"use client";

import { IconCalendar, IconX } from "@tabler/icons-react";
import { clsx } from "clsx";
import { format } from "date-fns";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
	fromName: string;
	toName: string;
	label: string;
	defaultFrom?: string | Date;
	defaultTo?: string | Date;
	required?: boolean;
	time?: boolean;
}

export default function RangePicker({
	fromName,
	toName,
	label,
	defaultFrom,
	defaultTo,
	required,
	time = true,
}: DateRangePickerProps) {
	const [open, setOpen] = React.useState(false);

	const [range, setRange] = React.useState<DateRange | undefined>(() => {
		const from = defaultFrom ? new Date(defaultFrom) : undefined;
		const to = defaultTo ? new Date(defaultTo) : undefined;

		return from ? { from, to } : undefined;
	});

	const handleDateChange = (selectedRange: DateRange | undefined) => {
		setRange((current) => {
			if (!selectedRange) {
				return undefined;
			}

			return {
				from: selectedRange.from
					? preserveTime(selectedRange.from, current?.from)
					: undefined,
				to: selectedRange.to
					? preserveTime(selectedRange.to, current?.to)
					: undefined,
			};
		});
	};

	const handleTimeChange = (
		type: "from" | "to",
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const [hours, minutes, seconds = 0] = event.target.value
			.split(":")
			.map(Number);

		setRange((current) => {
			if (!current?.[type]) return current;

			const date = new Date(current[type]);

			date.setHours(hours, minutes, seconds, 0);

			return {
				...current,
				[type]: date,
			};
		});
	};

	const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setRange(undefined);
	};

	const displayValue = range?.from
		? range.to
			? `${format(range.from, "MMM d, yyyy, HH:mm:ss")} - ${format(range.to, "MMM d, yyyy, HH:mm:ss")}`
			: `${format(range.from, "MMM d, yyyy, HH:mm:ss")} - Select an end date`
		: "Select a date range";

	return (
		<div className="w-full flex flex-col gap-2">
			<Label required={required}>{label}</Label>

			<input
				type="hidden"
				name={fromName}
				value={range?.from?.toISOString() ?? ""}
				required={required}
				className="sr-only"
			/>

			<input
				type="hidden"
				name={toName}
				value={range?.to?.toISOString() ?? ""}
				required={required}
				className="sr-only"
			/>

			<Popover open={open} onOpenChange={setOpen}>
				<div className="relative w-full">
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							type="button"
							className="w-full h-7 bg-input/20 dark:bg-input/30 border border-border text-xs rounded-md justify-start px-3 pr-8"
						>
							<span className="truncate">{displayValue}</span>

							{!range?.from && (
								<IconCalendar className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
							)}
						</Button>
					</PopoverTrigger>
					{range?.from && (
						<button
							type="button"
							onClick={handleClear}
							aria-label="Clear date range"
							className="absolute right-0.5 top-1/2 -translate-y-1/2 hover:bg-muted rounded-sm p-1 transition-colors text-muted-foreground hover:text-foreground z-10"
						>
							<IconX className="size-4" stroke={2} />
						</button>
					)}
				</div>
				<PopoverContent className={clsx("w-auto p-1.5", time && "pb-0")}>
					<Calendar
						mode="range"
						selected={range}
						onSelect={handleDateChange}
						captionLayout="dropdown"
						defaultMonth={range?.from}
						className={clsx(time && "pb-0")}
					/>
					{time && (
						<div className="-translate-y-1 px-1 pb-2 flex flex-col gap-2">
							<div className="flex flex-col items-center gap-1.5">
								<Label className="justify-center">Start Time</Label>
								<Input
									type="time"
									step="1"
									value={range?.from ? format(range.from, "HH:mm:ss") : ""}
									disabled={!range?.from}
									onChange={(event) => handleTimeChange("from", event)}
									className="text-center appearance-none dark:bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
								/>
							</div>
							<div className="flex flex-col items-center gap-1.5">
								<Label className="justify-center">End Time</Label>

								<Input
									type="time"
									step="1"
									value={range?.to ? format(range.to, "HH:mm:ss") : ""}
									disabled={!range?.to}
									onChange={(event) => handleTimeChange("to", event)}
									className="text-center appearance-none dark:bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
								/>
							</div>
						</div>
					)}
				</PopoverContent>
			</Popover>
		</div>
	);
}

function preserveTime(nextDate: Date, previousDate?: Date) {
	if (!previousDate) return nextDate;

	const result = new Date(nextDate);

	result.setHours(
		previousDate.getHours(),
		previousDate.getMinutes(),
		previousDate.getSeconds(),
		0,
	);

	return result;
}
