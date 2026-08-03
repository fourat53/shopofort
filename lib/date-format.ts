function isDate(value: unknown): value is Date | string {
	if (value instanceof Date) return true;
	return (
		typeof value === "string" &&
		/^\d{4}-\d{2}-\d{2}T/.test(value) &&
		!Number.isNaN(Date.parse(value))
	);
}

function formatDate(date: Date | string | null | undefined): string {
	if (!date) return "N/A";

	const dateObj = typeof date === "string" ? new Date(date) : date;

	if (Number.isNaN(dateObj.getTime())) {
		console.warn("Invalid date provided:", date);
		return "Invalid Date";
	}

	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(dateObj);
}

export { formatDate, isDate };
