"use client";

import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { type ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const getLabelText = (item: SelectOption) =>
	Array.isArray(item.label) ? item.label.join(" ") : String(item.label);

type StringNumber = string | number;

type SelectOption = {
	value: string;
	label: StringNumber | [StringNumber, StringNumber];
	icon?: ReactNode;
};

interface SelectProps {
	name?: string;
	label?: ReactNode | StringNumber | [StringNumber, StringNumber];
	placeholder?: string;
	required?: boolean;
	value?: string | string[];
	defaultValue?: string | string[] | undefined;
	autoDefaultValue?: boolean;
	multiple?: boolean;
	onValueChange?: (value: string) => void;
	onValuesChange?: (values: string[]) => void;
	disabled?: boolean;
	className?: string;
	parentClassName?: string;
	items?: SelectOption[];
	searchable?: boolean;
	menuClassName?: string;
	isDefaultOpen?: boolean;
}

function Select({
	name,
	label,
	placeholder,
	required,
	value,
	defaultValue,
	autoDefaultValue = false,
	multiple = false,
	onValueChange,
	onValuesChange,
	disabled,
	className,
	parentClassName,
	items = [],
	searchable = true,
	menuClassName,
	isDefaultOpen,
}: SelectProps) {
	const [open, setOpen] = useState(isDefaultOpen || false);
	const [internalValue, setInternalValue] = useState<string | string[]>(
		defaultValue ?? (multiple ? [] : ""),
	);

	const selectedValues = multiple
		? value !== undefined
			? Array.isArray(value)
				? value
				: [value]
			: Array.isArray(internalValue)
				? internalValue
				: internalValue
					? [internalValue]
					: []
		: [];

	const selectedValue = multiple ? "" : (value ?? (internalValue as string));

	useEffect(() => {
		if (value === undefined && defaultValue !== undefined) {
			setInternalValue(defaultValue);
		}
	}, [defaultValue, value]);

	useEffect(() => {
		if (autoDefaultValue && !multiple && !selectedValue && items.length > 0) {
			const firstValue = items[0].value;
			setInternalValue(firstValue);
			onValueChange?.(firstValue);
		}
	}, [autoDefaultValue, multiple, selectedValue, items, onValueChange]);

	const selectedItem = multiple
		? undefined
		: items.find((item) => item.value === selectedValue);

	const selectedItems = multiple
		? items.filter((item) => selectedValues.includes(item.value))
		: [];

	const isSelected = (itemValue: string) =>
		multiple ? selectedValues.includes(itemValue) : selectedValue === itemValue;

	function filterItems(value: string, search: string) {
		const item = items.find((item) => item.value === value);

		if (!item) return 0;

		const labelText = Array.isArray(item.label)
			? item.label.join(" ")
			: String(item.label);

		const searchableText = `${item.value} ${labelText}`.toLowerCase();

		return searchableText.includes(search.toLowerCase()) ? 1 : 0;
	}

	const renderItemContent = (item: SelectOption) => {
		if (Array.isArray(item.label) && item.label.length === 2) {
			return (
				<div className="absolute top-1/2 -translate-y-1/2 w-[calc(100%-36px)] flex max-sm:flex-col gap-1.5 max-sm:items-start justify-between">
					<p
						className="truncate max-w-full sm:max-w-[40%]"
						title={String(item.label[0])}
					>
						{item.label[0]}
					</p>
					<p
						className="sm:text-right text-muted-foreground truncate max-w-full sm:max-w-[60%]"
						title={String(item.label[1])}
					>
						{item.label[1]}
					</p>
				</div>
			);
		}

		return (
			<div
				className="absolute top-1/2 -translate-y-1/2 w-full flex items-center sm:gap-1.5 truncate"
				title={typeof item.label === "string" ? item.label : ""}
			>
				{item.icon}
				<span className="truncate max-w-full">{item.label}</span>
			</div>
		);
	};

	const renderButtonContent = () => {
		if (multiple) {
			if (selectedItems.length === 0) return placeholder || "Select options";
			const labels = selectedItems.map(getLabelText);
			return (
				<span className="block w-full truncate" title={labels.join(", ")}>
					{labels.join(", ")}
				</span>
			);
		}

		if (!selectedItem) return placeholder || "Select an option";

		if (Array.isArray(selectedItem.label) && selectedItem.label.length === 2) {
			return (
				<div className="absolute top-1/2 -translate-y-1/2 w-[calc(100%-36px)] flex max-sm:flex-col sm:gap-1.5 items-start sm:items-center sm:justify-between">
					<p
						className="truncate max-w-full sm:max-w-[40%]"
						title={String(selectedItem.label[0])}
					>
						{selectedItem.label[0]}
					</p>
					<p
						className="sm:text-right text-muted-foreground truncate max-w-full sm:max-w-[60%]"
						title={String(selectedItem.label[1])}
					>
						{selectedItem.label[1]}
					</p>
				</div>
			);
		}

		return (
			<div
				className="absolute top-1/2 -translate-y-1/2 w-[calc(100%-50px)] flex items-center sm:gap-1.5 truncate"
				title={typeof selectedItem.label === "string" ? selectedItem.label : ""}
			>
				{selectedItem.icon}
				<span className="truncate max-w-full">{selectedItem.label}</span>
			</div>
		);
	};

	const handleSelect = (currentValue: string) => {
		if (multiple) {
			setInternalValue((current) => {
				const values = Array.isArray(current) ? current : [];

				const next = values.includes(currentValue)
					? values.filter((value) => value !== currentValue)
					: [...values, currentValue];

				onValuesChange?.(next);
				return next;
			});
			return;
		}

		setInternalValue(currentValue);
		onValueChange?.(currentValue);
		setOpen(false);
	};

	return (
		<div
			className={cn(
				"relative grid w-full items-center gap-1.5",
				parentClassName,
			)}
		>
			{label && <Label required={required}>{label}</Label>}

			<div className="relative">
				{name &&
					(multiple ? (
						selectedValues.map((itemValue) => (
							<input
								key={itemValue}
								name={name}
								value={itemValue}
								required={required}
								className="translate-y-7 sr-only"
								onChange={(e) => handleSelect(e.target.value)}
							/>
						))
					) : (
						<input
							name={name}
							value={selectedValue}
							required={required}
							className="translate-y-7 sr-only"
							onChange={(e) => handleSelect(e.target.value)}
						/>
					))}

				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							role="combobox"
							aria-expanded={open}
							disabled={disabled}
							className={cn(
								"relative border border-border/80 bg-input/20 dark:bg-input/30 rounded-md px-3 h-7 w-full justify-between disabled:cursor-not-allowed",
								(multiple ? selectedValues.length === 0 : !selectedValue) &&
									"text-muted-foreground",
								selectedItem &&
									Array.isArray(selectedItem.label) &&
									selectedItem.label.length === 2 &&
									"max-sm:h-13",
								className,
							)}
						>
							<div className="min-w-0 w-0 flex-1 overflow-hidden pr-6 text-left text-xs">
								{renderButtonContent()}
							</div>
							<IconChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>

					<PopoverContent className={cn("w-86", menuClassName)}>
						<Command className="bg-transparent" filter={filterItems}>
							{searchable && <CommandInput placeholder="Search .." />}

							<CommandList className="z-50 max-h-60 overflow-y-auto">
								<CommandEmpty>No option found</CommandEmpty>
								<CommandGroup>
									{items.map((item, index) => (
										<div key={index} className={index !== 0 ? "pt-1" : ""}>
											<CommandItem
												value={item.value}
												onSelect={handleSelect}
												className={cn(
													isSelected(item.value) &&
														"bg-primary hover:bg-accent",
												)}
											>
												{renderItemContent(item)}
												{isSelected(item.value) && (
													<IconCheck className="size-4 absolute right-2 top-1/2 -translate-y-1/2" />
												)}
											</CommandItem>
										</div>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}

export { Select, type SelectOption };
