"use client";

import { IconUpload, IconX } from "@tabler/icons-react";
import { clsx } from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";

type ImageItem = string | File;

interface ImageUploadProps {
	name?: string;
	label?: string;
	images: ImageItem[];
	onChange: (images: ImageItem[]) => void;
	className?: string;
	required?: boolean;
	multiple?: boolean;
}

function ImageUpload({
	name,
	label,
	images,
	onChange,
	className,
	required,
	multiple = false,
}: ImageUploadProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDivClick = () => {
		fileInputRef.current?.click();
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			onChange(
				multiple ? [...images, ...selectedFiles] : selectedFiles.slice(0, 1),
			);
		}
		e.target.value = "";
	};

	const removeImage = (indexToRemove: number) => {
		onChange(images.filter((_, index) => index !== indexToRemove));
	};

	return (
		<div className={className}>
			<Label className="pb-1.5" required={required}>
				{label}
			</Label>

			<input
				name={name}
				type="file"
				ref={fileInputRef}
				onChange={handleImageChange}
				multiple={multiple}
				accept="image/*"
				className="sr-only"
				required={required}
			/>

			<div
				className={
					multiple || images.length > 1
						? "w-full grid grid-cols-3 gap-2"
						: "w-full flex justify-center"
				}
			>
				{images.map((item, idx) => (
					<ImagePreview
						key={idx}
						item={item}
						onRemove={() => removeImage(idx)}
					/>
				))}

				{(multiple || (!multiple && images.length === 0)) && (
					<button
						type="button"
						onClick={handleDivClick}
						className={clsx(
							"size-28 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer hover:bg-mist-100 dark:hover:bg-mist-800 transition-colors",
							multiple && images.length % 3 === 0 && "w-full col-span-3",
							multiple && images.length % 3 === 1 && "w-full col-span-2",
						)}
					>
						<IconUpload className="size-6 text-mist-400 mb-1" />
						<span className="text-xs text-mist-500">Upload</span>
					</button>
				)}
			</div>
		</div>
	);
}

function ImagePreview({
	item,
	onRemove,
}: {
	item: ImageItem;
	onRemove: () => void;
}) {
	const isFile = item instanceof File;
	const [objectUrl] = useState<string | null>(() =>
		isFile ? URL.createObjectURL(item) : null,
	);

	useEffect(() => {
		return () => {
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [objectUrl]);

	const src = isFile ? objectUrl : item;

	return (
		<div className="relative group">
			{src ? (
				<Image
					src={src}
					alt={isFile ? item.name : `Image ${src}`}
					width={1000}
					height={1000}
					className="size-28 object-cover border rounded-xl"
				/>
			) : null}
			<button
				type="button"
				onClick={onRemove}
				className="hover:cursor-pointer absolute top-1 right-1 bg-mist-800/80 hover:bg-mist-800 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
			>
				<IconX className="size-3" />
			</button>
		</div>
	);
}

export { type ImageItem, ImageUpload };
