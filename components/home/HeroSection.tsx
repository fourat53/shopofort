import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
	return (
		<section className="h-screen bg-linear-to-br from-sidebar dark:from-background via-muted dark:via-muted/50 to-primary/15 dark:to-primary/10 flex items-center justify-center">
			<div className="container px-4 flex flex-col gap-4 text-center max-w-5xl z-10">
				<div className="ml-auto w-fit animate-fade-in-up inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
					<div className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
					New Summer Collection 2026
				</div>
				<h1 className="animate-fade-in-up text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground delay-100">
					Elevate Your{" "}
					<span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-chart-2">
						Style.
					</span>
				</h1>
				<p className="animate-fade-in-up mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed text-center delay-200">
					Discover the latest trends in fashion and tech. Premium quality,
					modern aesthetics, and unparalleled comfort designed for the modern
					lifestyle.
				</p>
				<div className="pt-4 animate-fade-in-up flex flex-col justify-center gap-4 delay-300 sm:flex-row">
					<Button
						variant="outline"
						className="h-12 px-6 text-base transition-transform hover:-translate-y-0.5"
					>
						View Lookbook
					</Button>
					<Button className="h-12 px-6 text-base transition-transform hover:-translate-y-0.5">
						Shop Now <IconArrowRight className="ml-2 size-4" />
					</Button>
				</div>
			</div>
			{/* Decorative elements */}
			<div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]" />
			<div className="absolute -top-24 -left-24 size-96 rounded-full bg-primary/15 blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
			<div className="absolute top-1/2 -right-24 size-120 -translate-y-1/2 rounded-full bg-chart-2/20 	blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
		</section>
	);
}
