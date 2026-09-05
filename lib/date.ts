import { format } from "date-fns";

function isValidDate(value: unknown): boolean {
	if (value instanceof Date) {
		return !Number.isNaN(value.getTime());
	}

	if (typeof value !== "string") {
		return false;
	}

	const isoDateRegex =
		/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

	if (!isoDateRegex.test(value)) {
		return false;
	}

	return !Number.isNaN(new Date(value).getTime());
}

function formatDate(value: string | Date): string {
	return format(new Date(value), "MMM d, yyyy");
}

function formatDateTime(value: string | Date): string {
	return format(new Date(value), "MMM d, yyyy, hh:mm:ss a");
}

function dateTimeFormat(value: string | Date, time: boolean): string {
	return time ? formatDateTime(value) : formatDate(value);
}

function formatTime(value: string | Date): string {
	return format(new Date(value), "hh:mm:ss a");
}

export { dateTimeFormat, formatDate, formatDateTime, formatTime, isValidDate };
