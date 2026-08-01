"use client";

import { useEffect, useState } from "react";

export default function DocumentTitle() {
	const [title, setTitle] = useState<string>("");

	useEffect(() => {
		const updateTitle = () => {
			setTitle(document.title.replace("Shopofort - ", ""));
		};

		updateTitle();

		const titleElement = document.querySelector("title");
		if (!titleElement) return;

		const observer = new MutationObserver(updateTitle);
		observer.observe(titleElement, { childList: true });

		return () => observer.disconnect();
	}, []);

	return title;
}
