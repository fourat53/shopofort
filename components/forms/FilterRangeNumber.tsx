"use client";

import { useState } from "react";

import { Input } from "@/components/form-items/input";
import { RangeSlider } from "@/components/form-items/range-slider";

interface NumberRangeFilterProps {
	name: string;
	label: string;
	min?: number;
	max?: number;
	defaultFrom?: number;
	defaultTo?: number;
	step?: number;
}

export default function FilterRangeNumber({
	name,
	label,
	min: initMin = 0,
	max: initMax = 1000,
	defaultFrom = initMin,
	defaultTo = initMax,
	step = 1,
}: NumberRangeFilterProps) {
	const [min, setMin] = useState(initMin);
	const [max, setMax] = useState(Math.max(initMax, initMin));
	const [range, setRange] = useState<[number, number]>([
		Math.max(defaultFrom, initMin),
		Math.min(defaultTo, Math.max(initMax, initMin)),
	]);

	const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value);
		setMin(value);
		setRange(([_, to]) => [value, to]);
	};

	const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value);
		setMax(value);
		setRange(([from, _]) => [from, value]);
	};

	return (
		<div className="flex items-start gap-2.5">
			<RangeSlider
				fromName={`${name}From`}
				toName={`${name}To`}
				label={label}
				min={min}
				max={max}
				step={step}
				value={range}
				onValueChange={setRange}
			/>
			<Input
				name={`${name}Min`}
				type="number"
				label="Min Value"
				min={0}
				step={step}
				value={min}
				onChange={handleMinChange}
				parentClassName="w-2/5"
			/>
			<Input
				name={`${name}Max`}
				type="number"
				label="Max Value"
				min={min}
				step={step}
				value={max}
				onChange={handleMaxChange}
				parentClassName="w-2/5"
			/>
		</div>
	);
}
