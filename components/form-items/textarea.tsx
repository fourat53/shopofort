import { Label } from "@/components/ui/label";
import { Textarea as BaseTextArea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TextAreaProps = React.ComponentProps<"textarea"> & {
	label?: string;
	parentClassName?: string;
};

export function TextArea({
	required,
	parentClassName,
	label,
	...props
}: TextAreaProps) {
	return (
		<div className={cn("w-full", parentClassName)}>
			{label && (
				<Label required={required} className="pb-1.5">
					{label}
				</Label>
			)}
			<BaseTextArea required={required} {...props} />
		</div>
	);
}
