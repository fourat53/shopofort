import { Input as BaseInput } from "../ui/input";
import { Label } from "../ui/label";

type InputProps = React.ComponentProps<"input"> & { label?: string };

export function Input({ ...props }: InputProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<Label>
				{props.label}
				{props.required && <span className="text-destructive"> *</span>}
			</Label>
			<BaseInput {...props}></BaseInput>
		</div>
	);
}
