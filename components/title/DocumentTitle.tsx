"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export default function DocumentTitle() {
	const [title, setTitle] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const updateTitle = () => {
			const cleanedTitle = document.title.replace("Shopofort - ", "").trim();

			if (cleanedTitle) {
				setTitle(cleanedTitle);
				setIsLoading(false);
			}
		};

		updateTitle();

		const titleElement = document.querySelector("title");
		if (!titleElement) return;

		const observer = new MutationObserver(updateTitle);
		observer.observe(titleElement, {
			childList: true,
			characterData: true,
			subtree: true,
		});

		return () => observer.disconnect();
	}, []);

	if (isLoading || !title) {
		return <Skeleton className="h-7 w-50" />;
	}

	return <p>{title}</p>;
}
