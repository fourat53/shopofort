import { Input as BaseInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InputProps = React.ComponentProps<"input"> & { label?: string };

export function Input({ required, ...props }: InputProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<Label required={required}>{props.label}</Label>
			<BaseInput {...props}></BaseInput>
		</div>
	);
}
