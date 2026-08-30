import { format, parseISO, isValid } from "date-fns";

function formatDate(date: string | Date): string {
	const dateObj = new Date(date);

	if (Number.isNaN(dateObj.getTime())) {
		console.warn("Invalid date time provided:", date);
		return "Invalid Date";
	}

	return format(dateObj, "MMM d, yyyy, HH:mm:ss");
}

function isValidDate(dateStr: string): boolean {
	const parsedDate = parseISO(dateStr);
	return isValid(parsedDate) && dateStr.includes("T");
}

export { formatDate, isValidDate };
