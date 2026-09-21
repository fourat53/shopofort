"use client";

import { IconSearch, IconShoppingBag, IconX } from "@tabler/icons-react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/form-items/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product, ProductColor } from "@/lib/entity/types";

const formatColorBadge = (color: ProductColor) => {
	const colorStyles: Record<ProductColor, string> = {
		Red: "bg-red-200/50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
		Green:
			"bg-green-200/50 dark:bg-green-900/30 text-green-600 dark:text-green-400",
		Blue: "bg-blue-200/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
		Yellow:
			"bg-yellow-200/50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
		Purple:
			"bg-purple-200/50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
		Orange:
			"bg-orange-200/50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
		Pink: "bg-pink-200/50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
		White:
			"bg-zinc-300/30 dark:bg-zinc-700/80 text-zinc-500/75 dark:text-zinc-200",
		Gray: "bg-zinc-300/50 dark:bg-zinc-700/40 text-zinc-500 dark:text-zinc-400",
		Black:
			"bg-zinc-300/90 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-400/75",
	};

	return (
		<Badge
			key={color}
			className={clsx("text-xs h-5 px-1.5 cursor-default", colorStyles[color])}
		>
			{color}
		</Badge>
	);
};

export default function SearchInput() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<Product[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const router = useRouter();

	const handleSubmit = useCallback(() => {
		if (query.trim()) {
			router.push(`/products?name=${encodeURIComponent(query.trim())}`);
			setIsOpen(false);
		}
	}, [query, router]);

	const fetchResults = useCallback(async (searchQuery: string) => {
		if (searchQuery.length < 2) {
			setResults([]);
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch(
				`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`,
			);
			const data = await response.json();
			setResults(data.products || []);
		} catch (error) {
			console.error("Search error:", error);
			setResults([]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setQuery(value);
		setIsOpen(value.length >= 2);

		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		debounceRef.current = setTimeout(() => {
			fetchResults(value);
		}, 500);
	};

	const handleFocus = () => {
		if (query.length >= 2 && results.length > 0) {
			setIsOpen(true);
		}
	};

	const handleBlur = () => {
		setTimeout(() => setIsOpen(false), 200);
	};

	const handleClear = () => {
		setQuery("");
		setResults([]);
		setIsOpen(false);
		inputRef.current?.focus();
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			setIsOpen(false);
			inputRef.current?.blur();
		}
		if (e.key === "Enter") {
			e.preventDefault();
			handleSubmit();
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative w-full sm:max-w-md" ref={dropdownRef}>
			<div className="relative flex items-center">
				<Input
					ref={inputRef}
					placeholder="Search"
					className="w-full h-8 rounded-r-none"
					value={query}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
				/>
				{query && (
					<Button
						variant="ghost"
						className="absolute right-9 size-7 rouneded-full bg-transparent"
						onClick={handleClear}
					>
						<IconX className="size-4" />
					</Button>
				)}
				<Button
					className="h-8 shadow-none rounded-lg rounded-l-none border-0"
					onClick={handleSubmit}
				>
					<IconSearch className="size-5" />
				</Button>
			</div>

			{isOpen && (results.length > 0 || isLoading) && (
				<div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-popover border border-border rounded-xl shadow-lg overflow-hidden">
					{isLoading ? (
						<div className="p-4 flex items-center justify-center gap-2">
							<div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
							<span className="text-sm text-muted-foreground">
								Searching...
							</span>
						</div>
					) : results.length > 0 ? (
						<div className="p-2 max-h-96 overflow-y-auto">
							{results.map((product) => (
								<Link
									key={product.id}
									href={`/products/${product.id}`}
									className="block p-2 hover:bg-primary/10 rounded-lg transition-colors"
									onClick={() => {
										setQuery("");
										setResults([]);
										setIsOpen(false);
									}}
								>
									<div className="flex gap-3">
										<div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-muted">
											{product.images?.[0] ? (
												<Image
													src={product.images[0]}
													alt={product.name}
													fill
													className="object-cover"
													sizes="64px"
												/>
											) : (
												<div className="flex items-center justify-center h-full w-full text-muted-foreground">
													<IconShoppingBag className="size-6 opacity-50" />
												</div>
											)}
										</div>
										<div className="flex-1 min-w-0 flex flex-col justify-between">
											<div>
												{product.brand && (
													<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
														{product.brand}
													</p>
												)}
												<h4 className="font-medium text-sm truncate">
													{product.name}
												</h4>
												<div className="flex flex-wrap gap-1 mt-1">
													{product.colors?.slice(0, 3).map(formatColorBadge)}
													{product.colors && product.colors.length > 3 && (
														<Badge
															variant="outline"
															className="text-xs h-5 px-1.5"
														>
															+{product.colors.length - 3}
														</Badge>
													)}
												</div>
												{product.sizes && product.sizes.length > 0 && (
													<div className="flex flex-wrap gap-1 mt-1">
														{product.sizes.slice(0, 4).map((size) => (
															<Badge
																key={size}
																variant="outline"
																className="text-xs h-5 px-1.5"
															>
																{size}
															</Badge>
														))}
														{product.sizes.length > 4 && (
															<Badge
																variant="outline"
																className="text-xs h-5 px-1.5"
															>
																+{product.sizes.length - 4}
															</Badge>
														)}
													</div>
												)}
											</div>
											<div className="flex items-center gap-2 mt-2">
												<span className="font-semibold text-sm">
													${Number(product.price).toFixed(2)}
												</span>
												{product.rating > 0 && (
													<span className="flex items-center gap-0.5 text-xs text-amber-500">
														<svg
															className="size-3 fill-current"
															viewBox="0 0 24 24"
															aria-label={`Rating: ${Number(product.rating).toFixed(1)}`}
														>
															<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
														</svg>
														{Number(product.rating).toFixed(1)}
													</span>
												)}
												{product.inventory < 10 && product.inventory > 0 && (
													<Badge
														variant="destructive"
														className="text-xs h-5 px-1.5"
													>
														Low Stock
													</Badge>
												)}
											</div>
										</div>
									</div>
								</Link>
							))}
						</div>
					) : query.length >= 2 ? (
						<div className="p-4 text-center text-muted-foreground text-sm">
							No products found for "{query}"
						</div>
					) : null}
				</div>
			)}
		</div>
	);
}
