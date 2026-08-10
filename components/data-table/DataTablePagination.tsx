"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
	getVisiblePages,
	pageHref,
	parsePage,
} from "@/components/data-table/PaginationParams";
import { buttonVariants } from "@/components/ui/button-variants";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationButtonProps {
	page: number;
	isActive: boolean;
	onClick: () => void;
}

function PaginationButton({ page, isActive, onClick }: PaginationButtonProps) {
	return (
		<button
			type="button"
			aria-current={isActive ? "page" : undefined}
			data-slot="pagination-link"
			data-active={isActive}
			onClick={onClick}
			className={buttonVariants({
				variant: isActive ? "default" : "ghost",
			})}
		>
			{page}
		</button>
	);
}

interface DataTablePaginationProps {
	basePath: string;
	totalPages: number;
	className?: string;
}

export default function DataTablePagination({
	basePath,
	totalPages,
	className,
}: DataTablePaginationProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const [pendingPage, setPendingPage] = useState<number | null>(null);

	const urlPage = parsePage(searchParams.get("page"), totalPages);
	const currentPage = pendingPage ?? urlPage;
	const visiblePages = getVisiblePages(currentPage, totalPages);

	useEffect(() => {
		if (pendingPage !== null && pendingPage === urlPage) {
			setPendingPage(null);
		}
	}, [pendingPage, urlPage]);

	useEffect(() => {
		const pagesToPrefetch = new Set([
			currentPage,
			currentPage - 1,
			currentPage + 1,
			1,
			totalPages,
		]);

		for (const page of pagesToPrefetch) {
			if (page >= 1 && page <= totalPages) {
				router.prefetch(pageHref(basePath, page, searchParams));
			}
		}
	}, [basePath, currentPage, router, totalPages, searchParams]);

	function navigate(page: number) {
		if (page < 1 || page > totalPages || page === currentPage) {
			return;
		}

		setPendingPage(page);
		startTransition(() => {
			router.push(pageHref(basePath, page, searchParams), { scroll: false });
		});
	}

	return (
		<Pagination
			aria-busy={isPending}
			className={cn("w-full flex justify-center", className)}
		>
			<PaginationContent className="w-80 sm:w-90 justify-between">
				<PaginationItem>
					<PaginationPrevious
						href={pageHref(basePath, currentPage - 1, searchParams)}
						aria-disabled={currentPage <= 1 || isPending}
						className={cn(
							(currentPage <= 1 || isPending) &&
								"pointer-events-none opacity-50",
						)}
						onClick={(event) => {
							event.preventDefault();
							navigate(currentPage - 1);
						}}
					/>
				</PaginationItem>

				{visiblePages.map((item) =>
					item.type === "ellipsis" ? (
						<PaginationItem key={`ellipsis-${item.key}`}>
							<PaginationEllipsis />
						</PaginationItem>
					) : (
						<PaginationItem key={item.page}>
							<PaginationButton
								page={item.page}
								isActive={item.page === currentPage}
								onClick={() => navigate(item.page)}
							/>
						</PaginationItem>
					),
				)}

				<PaginationItem>
					<PaginationNext
						href={pageHref(basePath, currentPage + 1, searchParams)}
						aria-disabled={currentPage >= totalPages || isPending}
						className={cn(
							(currentPage >= totalPages || isPending) &&
								"pointer-events-none opacity-50",
						)}
						onClick={(event) => {
							event.preventDefault();
							navigate(currentPage + 1);
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
