import { IconShoppingBag } from "@tabler/icons-react";
import clsx from "clsx";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
	OrderStatus,
	ProductColor,
	type ProductSize,
} from "@/lib/entity/types";

function ColorsCell({ value }: { value: ProductColor[] }) {
	if (value.length === 0) return "-";

	return (
		<div className="w-full grid grid-cols-4 justify-between items-center gap-1">
			{[...value]
				.sort((a, b) => a.localeCompare(b))
				.map((item, index) => (
					<Badge
						key={index}
						className={clsx(
							"w-full bg-muted",
							item === ProductColor.Red && "text-red-700 dark:text-red-400",
							item === ProductColor.Green &&
								"text-green-700 dark:text-green-400",
							item === ProductColor.Blue && "text-blue-700 dark:text-blue-400",
							item === ProductColor.Yellow &&
								"text-yellow-700 dark:text-yellow-400",
							item === ProductColor.Purple &&
								"text-purple-200/60 text-purple-700 dark:text-purple-400",
							item === ProductColor.Orange &&
								"text-orange-700 dark:text-orange-400",
							item === ProductColor.Pink && "text-pink-700 dark:text-pink-400",
							item === ProductColor.White &&
								"text-neutral-400 dark:text-neutral-100",
							item === ProductColor.Gray &&
								"text-neutral-500 dark:text-neutral-300",
							item === ProductColor.Black &&
								"text-neutral-900 dark:text-neutral-400",
						)}
					>
						{item}
					</Badge>
				))}
		</div>
	);
}

function SizesCell({ value }: { value: ProductSize[] }) {
	if (value.length === 0) return "-";
	return (
		<div className="flex items-center gap-1.5">
			{value.map((item, index) => (
				<div key={index} className="rounded-full bg-muted px-1.5 border">
					{item}
				</div>
			))}
		</div>
	);
}

function ImageCell({ value, small }: { value: string; small?: boolean }) {
	const imageSize = small ? 32 : 58;

	if (value.length === 0)
		return (
			<div
				className="rounded-md border flex flex-col items-center justify-center bg-muted/60"
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

	return (
		<Image
			src={String(value)}
			alt={String(value)}
			width={1000}
			height={1000}
			loading="eager"
			className="rounded-md object-cover"
			style={{
				height: imageSize + "px",
				width: imageSize + "px",
				minWidth: imageSize + "px",
			}}
		/>
	);
}

function ImagesCell({ value, small }: { value: string[]; small?: boolean }) {
	return (
		<div className="h-14.5 flex gap-2 overflow-y-auto">
			{value.map((item, index) => (
				<ImageCell key={index} value={item} small={small} />
			))}
		</div>
	);
}

function OrderStatusCell({ value }: { value: string }) {
	return (
		<Badge
			className={clsx(
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
		</Badge>
	);
}

export { ColorsCell, ImageCell, ImagesCell, OrderStatusCell, SizesCell };
