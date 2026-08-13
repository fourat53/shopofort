"use client";

import { IconCalendar } from "@tabler/icons-react";
import { format } from "date-fns";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";

interface DateTimePickerProps {
	name: string;
	label: string;
	defaultValue?: string | Date;
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

	const displayValue = date
		? `${format(date, "PPP")} ${format(date, "HH:mm:ss")}`
		: "Select date and time";

	return (
		<div className="flex flex-col gap-2">
			<Label required={required}>{label}</Label>

			<input type="hidden" name={name} value={date?.toISOString() ?? ""} />

			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						type="button"
						className="w-full justify-between font-normal"
					>
						{displayValue}
						<IconCalendar />
					</Button>
				</PopoverTrigger>

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
