import { IconShoppingBag } from "@tabler/icons-react";
import clsx from "clsx";
import Image from "next/image";
import {
	OrderStatus,
	ProductColor,
	type ProductSize,
} from "@/lib/entity/types";

function ColorsCell({ value }: { value: ProductColor[] }) {
	if (value.length === 0) return "-";

	return (
		<div className="w-full grid grid-cols-4 justify-between items-center gap-1.5">
			{
				// [...value]
				// 	.sort((a, b) => a.localeCompare(b))
				value.map((item, index) => (
					<p
						key={index}
						className={clsx(
							"w-full text-center rounded-full py-px px-1.5",
							item === ProductColor.Red &&
								"bg-red-200/60 text-red-700 dark:bg-red-900/30 dark:text-red-400",
							item === ProductColor.Green &&
								"bg-green-200/60 text-green-700 dark:bg-green-900/30 dark:text-green-400",
							item === ProductColor.Blue &&
								"bg-blue-200/60 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
							item === ProductColor.Yellow &&
								"bg-yellow-200/40 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
							item === ProductColor.Purple &&
								"bg-purple-200/60 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
							item === ProductColor.Orange &&
								"bg-orange-200/60 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
							item === ProductColor.Pink &&
								"bg-pink-200/60 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
							item === ProductColor.White &&
								"bg-neutral-600/60 text-white dark:bg-neutral-100/60 dark:text-black",
							item === ProductColor.Gray &&
								"bg-gray-200/60 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400",
							item === ProductColor.Black &&
								"bg-neutral-400/60 text-black dark:bg-neutral-400/60 dark:text-black",
						)}
					>
						{item}
					</p>
				))
			}
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
		<p
			className={clsx(
				"w-22 text-center rounded-full px-1.5",
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

export { ColorsCell, ImageCell, ImagesCell, OrderStatusCell, SizesCell };
