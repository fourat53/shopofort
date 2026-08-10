import { Button } from "@/components/ui/button";

const colors = [
	"background",
	"foreground",
	"card",
	"card-foreground",
	"popover",
	"popover-foreground",
	"primary",
	"primary-foreground",
	"secondary",
	"secondary-foreground",
	"muted",
	"muted-foreground",
	"accent",
	"accent-foreground",
	"destructive",
	"border",
	"input",
	"ring",
	"chart-1",
	"chart-2",
	"chart-3",
	"chart-4",
	"chart-5",
	"sidebar",
	"sidebar-foreground",
	"sidebar-primary",
	"sidebar-primary-foreground",
	"sidebar-accent",
	"sidebar-accent-foreground",
	"sidebar-border",
	"sidebar-ring",
] as const;

const variants = [
	"default",
	"primary",
	"secondary",
	"outline",
	"ghost",
	"link",
] as const;

export default function ColorsPage() {
	return (
		<main className="flex flex-col gap-4">
			<div className="grid grid-cols-2 gap-4 pb-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
				{colors.map((color) => (
					<div
						key={color}
						className="flex flex-col gap-2 p-2 border rounded-lg shadow-sm bg-card"
					>
						<div
							className="w-full h-20 border rounded-md dark:border-white/10"
							style={{ backgroundColor: `var(--${color})` }}
						/>

						<span className="font-mono text-xs font-medium text-center truncate text-card-foreground">
							{color}
						</span>
					</div>
				))}
			</div>

			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
				{variants.map((variant) => (
					<Button key={variant} variant={variant}>
						{variant}
					</Button>
				))}
			</div>
		</main>
	);
}
