"use client";

import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { type ReactNode, useEffect, useState } from "react";
import SmallLoader from "@/components/loaders/small-loader";
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
import type { StringNumber } from "@/lib/entity/types";
import { cn } from "@/lib/utils";

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
	onValueChange?: (value: string | undefined) => void;
	onValuesChange?: (values: string[]) => void;
	disabled?: boolean;
	className?: string;
	parentClassName?: string;
	items?: SelectOption[];
	searchable?: boolean;
	isDefaultOpen?: boolean;
	loading?: boolean;
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
	isDefaultOpen,
	searchable = true,
	loading = false,
}: SelectProps) {
	const [open, setOpen] = useState(isDefaultOpen || false);
	const [internalValue, setInternalValue] = useState<string | string[]>(
		defaultValue ?? (multiple ? [] : ""),
	);

	const selectedValue = multiple ? "" : (value ?? (internalValue as string));

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

	const selectedItem = multiple
		? undefined
		: items.find((item) => item.value === selectedValue);

	const selectedItems = multiple
		? items.filter((item) => selectedValues.includes(item.value))
		: [];

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

		if (selectedValue === currentValue) {
			setInternalValue("");
			onValueChange?.(undefined);
			setOpen(false);
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
				<Popover open={open} onOpenChange={setOpen} modal={true}>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							role="combobox"
							aria-expanded={open}
							disabled={disabled}
							className={cn(
								"relative border border-border/80 bg-input/20 dark:bg-input/30 rounded-md px-3 h-7 w-full justify-between disabled:cursor-not-allowed",
								selectedItem &&
									Array.isArray(selectedItem.label) &&
									selectedItem.label.length === 2 &&
									"max-sm:h-13",
								className,
							)}
						>
							<div className="min-w-0 w-0 flex-1 overflow-hidden pr-6 text-left text-xs">
								<ButtonContent
									multiple={multiple}
									selectedItems={selectedItems}
									selectedItem={selectedItem}
									placeholder={placeholder}
								/>
							</div>
							<IconChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="p-0 w-80 sm:w-88">
						<Command className="bg-transparent" filter={filterItems}>
							{searchable && <CommandInput placeholder="Search options" />}
							<CommandList className="max-h-60 overflow-y-auto overflow-x-hidden">
								{loading ? (
									<SmallLoader className="h-60" />
								) : (
									<>
										<CommandEmpty className="h-60">
											No options found.
										</CommandEmpty>
										<CommandGroup className="p-1">
											{items.map((item) => (
												<CommandItem
													key={item.value}
													value={item.value}
													onSelect={handleSelect}
													className={cn(
														isSelected(item.value) &&
															"bg-primary hover:bg-primary/90 text-white hover:text-white",
													)}
												>
													<ItemContent item={item} />
													{isSelected(item.value) && (
														<IconCheck className="size-4 absolute right-2 top-1/2 -translate-y-1/2" />
													)}
												</CommandItem>
											))}
										</CommandGroup>
									</>
								)}
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}

interface ButtonContentProps {
	multiple: boolean;
	selectedItems: SelectOption[];
	selectedItem?: SelectOption;
	placeholder?: string;
}

function ButtonContent({
	multiple,
	selectedItems,
	selectedItem,
	placeholder,
}: ButtonContentProps) {
	if (multiple) {
		if (selectedItems.length === 0) return placeholder || "Select options";
		const labels = selectedItems.map((item) => {
			return Array.isArray(item.label)
				? item.label.join(" - ")
				: String(item.label);
		});
		return (
			<span title={labels.join(", ")} className="block w-full truncate">
				{labels.join(", ")}
			</span>
		);
	}
	if (!selectedItem) return placeholder || "Select an option";
	if (Array.isArray(selectedItem.label) && selectedItem.label.length === 2) {
		return (
			<div className="absolute top-1/2 -translate-y-1/2 w-[calc(100%-38px)] flex max-sm:flex-col sm:gap-1.5 items-start sm:items-center sm:justify-between">
				<p
					title={String(selectedItem.label[0])}
					className="truncate max-w-full sm:max-w-[50%]"
				>
					{selectedItem.label[0]}
				</p>

				<p
					title={String(selectedItem.label[1])}
					className="truncate max-w-full sm:max-w-[50%] sm:text-right"
				>
					{selectedItem.label[1]}
				</p>
			</div>
		);
	}
	return (
		<div
			title={String(selectedItem.label) || undefined}
			className="absolute top-1/2 -translate-y-1/2 w-[calc(100%-38px)] flex items-center sm:gap-1.5 truncate"
		>
			{selectedItem.icon}
			<span className="truncate max-w-full">{selectedItem.label}</span>
		</div>
	);
}

function ItemContent({ item }: { item: SelectOption }) {
	if (Array.isArray(item.label) && item.label.length === 2) {
		return (
			<div className="text-xs absolute top-1/2 -translate-y-1/2 w-[calc(100%-36px)] flex max-sm:flex-col sm:gap-1.5 sm:items-center sm:justify-between">
				<p
					title={String(item.label[0])}
					className="truncate max-w-full sm:max-w-[50%]"
				>
					{item.label[0]}
				</p>

				<p
					title={String(item.label[1])}
					className="truncate max-w-full sm:max-w-[50%] sm:text-right"
				>
					{item.label[1]}
				</p>
			</div>
		);
	}
	return (
		<div
			title={String(item.label) || undefined}
			className="absolute top-1/2 -translate-y-1/2 w-full flex items-center sm:gap-1.5 truncate"
		>
			{item.icon}
			<span className="truncate max-w-full">{item.label}</span>
		</div>
	);
}

export { Select, type SelectOption };
