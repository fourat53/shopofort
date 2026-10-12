import { getFieldName } from "@/lib/functions/client";

function ValidationError(
	mode: "create" | "edit",
	entityName: string,
	fieldErrors: Record<string, string>,
) {
	return (
		<>
			<p>
				Failed to {mode} {entityName}.
			</p>
			{Object.entries(fieldErrors).map(([field, message]) => (
				<p key={field} className="text-muted-foreground">
					{getFieldName(field)}: {message}
				</p>
			))}
		</>
	);
}

export { ValidationError };
