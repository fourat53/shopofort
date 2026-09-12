import { IconShoppingBag } from "@tabler/icons-react";
import Image from "next/image";
import { OrderStatus } from "@/lib/entity/types";
import clsx from "clsx";

interface ImageCellProps {
	value: string;
	tooltip?: boolean;
}

function ImageCell({ value, tooltip }: ImageCellProps) {
	const imageSize = tooltip ? 32 : 58;
	return value ? (
		<Image
			src={String(value)}
			alt={String(value)}
			width={1000}
			height={1000}
			loading="eager"
			className="rounded-xl"
			style={{ height: imageSize + "px", width: imageSize + "px" }}
		/>
	) : (
		<div
			className="rounded-xl border flex flex-col items-center justify-center bg-muted/60"
			style={{ height: imageSize + "px", width: imageSize + "px" }}
		>
			<IconShoppingBag
				className="size-5 opacity-50 text-muted-foreground"
				style={{
					height: imageSize / 2 + "px",
					width: imageSize / 2 + "px",
				}}
			/>
		</div>
	);
}

function OrderStatusCell({ value }: { value: string }) {
	return (
		<p
			className={clsx(
				"w-fit bg-accent rounded-full px-1.75",
				value === OrderStatus.PENDING &&
					"bg-yellow-200/40 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
				value === OrderStatus.PROCESSING &&
					"bg-blue-200/60 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
				value === OrderStatus.SHIPPED &&
					"bg-purple-200/60 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
				value === OrderStatus.DELIVERED &&
					"bg-green-200/60 text-green-700 dark:bg-green-900/30 dark:text-green-400",
				value === OrderStatus.CANCELLED &&
					"bg-red-200/60 text-red-700 dark:bg-red-900/30 dark:text-red-400",
			)}
		>
			{value}
		</p>
	);
}

export { ImageCell, OrderStatusCell };
