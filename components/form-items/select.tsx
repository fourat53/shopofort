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
	value?: string;
	defaultValue?: string;
	autoDefaultValue?: boolean;
	onValueChange?: (value: string) => void;
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
	onValueChange,
	disabled,
	className,
	parentClassName,
	items = [],
	searchable = true,
	menuClassName,
	isDefaultOpen,
}: SelectProps) {
	const [open, setOpen] = useState(isDefaultOpen || false);
	const [internalValue, setInternalValue] = useState(defaultValue ?? "");

	const selectedValue = value ?? internalValue;

	useEffect(() => {
		if (value === undefined && defaultValue !== undefined) {
			setInternalValue(defaultValue);
		}
	}, [defaultValue, value]);

	useEffect(() => {
		if (autoDefaultValue && !selectedValue && items.length > 0) {
			const firstValue = items[0].value;

			setInternalValue(firstValue);
			onValueChange?.(firstValue);
		}
	}, [autoDefaultValue, selectedValue, items, onValueChange]);

	const selectedItem = items.find((item) => item.value === selectedValue);

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
				<div className="absolute top-1/2 -translate-y-1/2 w-[calc(100%-50px)] flex max-sm:flex-col gap-1.5 max-sm:items-start justify-between">
					<p
						className="truncate max-w-full sm:max-w-[55%]"
						title={String(item.label[0])}
					>
						{item.label[0]}
					</p>
					<p
						className="sm:text-right text-muted-foreground truncate max-w-full sm:max-w-[45%]"
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
		if (!selectedItem) {
			return placeholder || "Select an option";
		}

		if (Array.isArray(selectedItem.label) && selectedItem.label.length === 2) {
			return (
				<div className="absolute top-1/2 -translate-y-1/2 w-[calc(100%-50px)] flex max-sm:flex-col sm:gap-1.5 items-start sm:items-center sm:justify-between">
					<p
						className="truncate max-w-full sm:max-w-[55%]"
						title={String(selectedItem.label[0])}
					>
						{selectedItem.label[0]}
					</p>
					<p
						className="sm:text-right text-muted-foreground truncate max-w-full sm:max-w-[45%]"
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
				{name && <input type="hidden" name={name} value={selectedValue} />}

				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							role="combobox"
							aria-expanded={open}
							disabled={disabled}
							className={cn(
								"relative bg-input/20 dark:bg-input/30 rounded-md px-3 h-7 w-full justify-between disabled:cursor-not-allowed border border-mist-400/60 dark:border-mist-700/80",
								!selectedValue && "text-muted-foreground",
								selectedItem &&
									Array.isArray(selectedItem.label) &&
									selectedItem.label.length === 2 &&
									"max-sm:h-13",
								className,
							)}
						>
							<div className="text-xs truncate flex-1 text-left">
								{renderButtonContent()}
							</div>

							<IconChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>

					<PopoverContent className={menuClassName}>
						<Command className="bg-transparent" filter={filterItems}>
							{searchable && <CommandInput placeholder="Search.." />}

							<CommandList>
								<CommandEmpty>No option found</CommandEmpty>
								<CommandGroup>
									{items.map((item, index) => (
										<CommandItem
											key={index}
											value={item.value}
											className={cn(
												index !== 0 && "cursor-pointer mt-0.5",
												selectedValue === item.value && "bg-primary",
											)}
											onSelect={handleSelect}
										>
											{renderItemContent(item)}

											{selectedValue === item.value && (
												<IconCheck className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2" />
											)}
										</CommandItem>
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
