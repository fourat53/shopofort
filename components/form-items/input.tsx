import { Input as BaseInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
	label?: string;
	parentClassName?: string;
};

export function Input({
	required,
	parentClassName,
	label,
	...props
}: InputProps) {
	return (
		<div className={cn("w-full", parentClassName)}>
			{label && (
				<Label required={required} className="pb-1.5">
					{label}
				</Label>
			)}
			<BaseInput required={required} {...props} />
		</div>
	);
}
