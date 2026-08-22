"use client";

import { useEffect } from "react";
import PageTitle from "./PageTitle";

export default function DocumentTitle() {
	const title = PageTitle();

	useEffect(() => {
		document.title = "Shopofort - " + title;
	}, [title]);

	return null;
}
