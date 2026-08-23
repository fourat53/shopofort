"use client";

import { useLayoutEffect } from "react";
import PageTitle from "./PageTitle";

export default function DocumentTitle() {
	const title = PageTitle();

	useLayoutEffect(() => {
		document.title = "Shopofort - " + title;
	}, [title]);

	return null;
}
