"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface RangeSliderProps {
	fromName?: string;
	toName?: string;
	id?: string;
	label?: React.ReactNode;
	min: number;
	max: number;
	defaultFrom?: number;
	defaultTo?: number;
	step?: number;
	value?: [number, number];
	onValueChange?: (value: [number, number]) => void;
	required?: boolean;
	disabled?: boolean;
	className?: string;
}

export function RangeSlider({
	fromName,
	toName,
	id,
	label,
	min,
	max,
	defaultFrom = min,
	defaultTo = max,
	step = 1,
	value,
	onValueChange,
	required,
	disabled,
	className,
}: RangeSliderProps) {
	const [internalValue, setInternalValue] = React.useState<[number, number]>([
		defaultFrom,
		defaultTo,
	]);

	const currentValue = value ?? internalValue;

	function handleValueChange(nextValue: number[]) {
		const next: [number, number] = [nextValue[0] ?? min, nextValue[1] ?? max];
		if (value === undefined) setInternalValue(next);
		onValueChange?.(next);
	}

	return (
		<div className={`grid w-full gap-3 ${className ?? ""}`}>
			<div className="flex items-center justify-between gap-2">
				{label && <Label htmlFor={id}>{label}</Label>}
				<span className="text-sm text-muted-foreground">
					{currentValue[0]} - {currentValue[1]}
				</span>
			</div>
			{fromName && (
				<input
					type="hidden"
					name={fromName}
					value={currentValue[0]}
					required={required}
				/>
			)}
			{toName && (
				<input
					type="hidden"
					name={toName}
					value={currentValue[1]}
					required={required}
				/>
			)}
			<Slider
				id={id}
				value={currentValue}
				onValueChange={handleValueChange}
				min={min}
				max={max}
				step={step}
				disabled={disabled}
			/>
		</div>
	);
}
