"use client";

import { useState, useEffect } from "react";

export default function DocumentTitle() {
  const [title, setTitle] = useState("");

  const updateTitle = () => {
    setTitle(document.title.replace("Shopofort - ", ""));
  };

  useEffect(() => {
    updateTitle();

    const titleElement = document.querySelector("title");
    if (!titleElement) return;

    const observer = new MutationObserver(updateTitle);
    observer.observe(titleElement, { childList: true });

    return () => observer.disconnect();
  }, []);

  return title;
}
