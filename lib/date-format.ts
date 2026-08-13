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

function formatDateTime(date: Date | string | null | undefined): string {
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
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	}).format(dateObj);
}

function dateFormat(date: Date | undefined) {
	if (!date) return "";

	return date.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

function isValidDate(date: Date | undefined) {
	if (!date) return false;

	return !Number.isNaN(date.getTime());
}

export { dateFormat, formatDate, formatDateTime, isDate, isValidDate };
