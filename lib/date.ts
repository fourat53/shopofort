function isValidDate(value: unknown): boolean {
	if (value instanceof Date) {
		return !Number.isNaN(value.getTime());
	}

	if (typeof value === "string") {
		const date = new Date(value);
		return !Number.isNaN(date.getTime());
	}

	return false;
}

export { isValidDate };
