"use client";

import { IconCalendar, IconX } from "@tabler/icons-react";
import { format } from "date-fns";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
	name: string;
	label: string;
	defaultValue?: string | Date | undefined;
	required?: boolean;
}

export function DatePicker({
	name,
	label,
	defaultValue,
	required,
}: DateTimePickerProps) {
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date | undefined>(
		defaultValue ? new Date(defaultValue) : undefined,
	);

	const handleDateChange = (selectedDate: Date | undefined) => {
		if (!selectedDate) {
			setDate(undefined);
			return;
		}

		setDate((current) => {
			if (!current) return selectedDate;
			const result = new Date(selectedDate);
			result.setHours(
				current.getHours(),
				current.getMinutes(),
				current.getSeconds(),
				0,
			);
			return result;
		});
		setOpen(false);
	};

	const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const [hours, minutes, seconds = 0] = event.target.value
			.split(":")
			.map(Number);

		setDate((current) => {
			if (!current) return undefined;
			const result = new Date(current);
			result.setHours(hours, minutes, seconds, 0);
			return result;
		});
	};

	const handleClear = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDate(undefined);
	};

	const displayValue = date
		? `${format(date, "MMM d, yyyy")}, ${format(date, "HH:mm:ss")}`
		: "Select date and time";

	return (
		<div className="w-full flex flex-col gap-2">
			<Label required={required}>{label}</Label>

			<input
				type="hidden"
				name={name}
				value={date?.toISOString() ?? ""}
				required={required}
				className="translate-y-12 sr-only"
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
							{!date && (
								<IconCalendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							)}
						</Button>
					</PopoverTrigger>
					{date && (
						<button
							type="button"
							onClick={handleClear}
							aria-label="Clear date"
							className="absolute right-0.5 top-1/2 -translate-y-1/2 hover:bg-muted rounded-sm p-1 transition-colors text-muted-foreground hover:text-foreground z-10"
						>
							<IconX className="h-4 w-4" stroke={2} />
						</button>
					)}
				</div>

				<PopoverContent className="w-auto p-1.5">
					<Calendar
						mode="single"
						selected={date}
						captionLayout="dropdown"
						defaultMonth={date}
						className="pb-0"
						onSelect={handleDateChange}
					/>

					<div className="flex flex-col items-center gap-1.5">
						<Label className="justify-center">Select Time</Label>
						<Input
							type="time"
							step="1"
							value={date ? format(date, "HH:mm:ss") : ""}
							onChange={handleTimeChange}
							className="text-center appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
						/>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
