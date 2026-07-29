"use client";

import { IconUpload, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface ImageUploadProps {
	images: File[];
	onChange: (files: File[]) => void;
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDivClick = () => {
		fileInputRef.current?.click();
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			onChange([...images, ...selectedFiles]);
		}
		e.target.value = "";
	};

	const removeImage = (indexToRemove: number) => {
		onChange(images.filter((_, index) => index !== indexToRemove));
	};

	useEffect(() => {
		return () => {
			images.forEach((image) =>
				URL.revokeObjectURL(URL.createObjectURL(image)),
			);
		};
	}, [images]);

	return (
		<div>
			<label className="block text-sm font-medium mb-2 mt-2">
				Product Images
			</label>

			{/* Hidden file input */}
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleImageChange}
				multiple
				accept="image/*"
				className="hidden"
			/>

			<div className="flex flex-wrap gap-4 items-center">
				{/* Clickable Upload Dropzone */}
				<div
					onClick={handleDivClick}
					className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-mist-300 dark:border-mist-700 rounded-lg cursor-pointer hover:bg-mist-100 dark:hover:bg-zinc-800 transition-colors"
				>
					<IconUpload className="w-6 h-6 text-gray-400 mb-1" />
					<span className="text-xs text-gray-500">Upload</span>
				</div>

				{/* Image Previews */}
				{images.map((img, idx) => (
					<div
						key={idx}
						className="relative w-24 h-24 border border-mist-300 dark:border-mist-700 rounded-lg overflow-hidden group"
					>
						<Image
							src={URL.createObjectURL(img)}
							alt={`Preview ${idx}`}
							fill
							className="object-cover"
						/>
						<button
							type="button"
							onClick={() => removeImage(idx)}
							className="hover:cursor-pointer absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<IconX className="w-3 h-3" />
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
