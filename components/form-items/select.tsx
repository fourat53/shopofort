import { Label } from "@/components/ui/label";
import {
	Select as BaseSelect,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SelectOption = {
	label: string;
	value: string;
	disabled?: boolean;
};

type SelectProps = React.ComponentPropsWithoutRef<typeof BaseSelect> & {
	label?: string;
	placeholder?: string;
	items: SelectOption[];
	className?: string;
	triggerClassName?: string;
};

function Select({
	label,
	placeholder = "Select an option...",
	items,
	className,
	triggerClassName,
	...props
}: SelectProps) {
	return (
		<div className={cn(" flex flex-col gap-1.5", className)}>
			{label && (
				<Label>
					{label}
					{props.required && <span className="text-destructive"> *</span>}
				</Label>
			)}

			<BaseSelect {...props}>
				<SelectTrigger className={cn("w-full", triggerClassName)}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{items.map((item) => (
						<SelectItem
							key={item.value}
							value={item.value}
							disabled={item.disabled}
						>
							{item.label}
						</SelectItem>
					))}
				</SelectContent>
			</BaseSelect>
		</div>
	);
}

export { Select, type SelectOption };
