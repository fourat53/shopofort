import { Input as BaseInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
	label?: string;
	parentClassName?: string;
};

export function Input({ required, parentClassName, ...props }: InputProps) {
	return (
		<div className={cn("w-full flex flex-col gap-1.5", parentClassName)}>
			<Label required={required}>{props.label}</Label>
			<BaseInput required={required} {...props}></BaseInput>
		</div>
	);
}
