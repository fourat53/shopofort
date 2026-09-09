import {
	IconArrowRight,
	IconLogin,
	IconSearch,
	IconShoppingBag,
	IconShoppingCart,
	IconStarFilled,
	IconTrendingUp,
	IconUser,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { getCategoriesPage } from "@/actions/CategoryActions";
import { getProductsPage } from "@/actions/ProductActions";
import { Input } from "@/components/form-items/input";
import { Button } from "@/components/ui/button";
import type { Category, Product } from "@/lib/entity/types";

export default async function Home() {
	const categories = await getCategoriesPage(1, "asc", "id", {}, 4);
	const products = await getProductsPage(1, "asc", "id", {}, 8);

	return (
		<div className="bg-card">
			{/* Navigation */}
			<nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/60 dark:bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
				<div className="flex h-16 items-center justify-between px-4">
					<div className="flex items-center gap-2">
						<IconShoppingBag className="h-7 w-7 text-primary" />
						<span className="text-2xl font-black tracking-tighter text-primary">
							Shopofort
						</span>
					</div>
					<div className="hidden md:flex gap-8 text-sm font-semibold">
						<Link
							href="#"
							className="transition-colors hover:text-primary text-foreground/80"
						>
							Men
						</Link>
						<Link
							href="#"
							className="transition-colors hover:text-primary text-foreground/80"
						>
							Women
						</Link>
						<Link
							href="#"
							className="transition-colors hover:text-primary text-foreground/80"
						>
							Kids
						</Link>
						<Link
							href="#"
							className="transition-colors hover:text-primary text-foreground/80"
						>
							Accessories
						</Link>
					</div>
					<div className="flex items-center gap-2">
						<Button variant="ghost" icon={<IconSearch className="size-4" />} />
						<Button variant="ghost" icon={<IconUser className="size-4" />} />
						<Button variant="ghost" className="relative">
							<IconShoppingCart />
							<div className="absolute right-1.5 top-1.5 flex size-1.5 rounded-full bg-destructive" />
						</Button>
						<Button variant="ghost">
							<Link href="/admin/dashboard">
								<IconLogin className="rotate-180" />
							</Link>
						</Button>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
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
					<p className="animate-fade-in-up mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed delay-200 text-center delay-200">
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

			{/* Categories */}
			<section className="p-12">
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
					<div>
						<h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
							Shop by Category
						</h2>
						<p className="text-muted-foreground">
							Find exactly what you're looking for
						</p>
					</div>
					<Button
						variant="ghost"
						className="hover:bg-primary/10 hover:text-primary self-start md:self-auto"
					>
						View All <IconArrowRight className="ml-2 size-4" />
					</Button>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{categories.map((category: Category, index: number) => (
						<div
							key={category.id}
							className="group relative overflow-hidden rounded-3xl border bg-linear-to-br from-background to-muted/30 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
						>
							<div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
							<div className="relative z-10 flex flex-col h-full">
								<div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
									<span className="font-bold text-lg">{index + 1}</span>
								</div>
								<h3 className="text-2xl font-bold mb-2 capitalize">
									{category.name}
								</h3>
								<p className="text-sm text-muted-foreground capitalize font-medium">
									{category.audience}
								</p>

								<div className="mt-12 flex justify-end">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border shadow-sm text-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
										<IconArrowRight className="size-4" />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Products */}
			<section className="p-12 pt-0">
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
							<IconTrendingUp className="h-6 w-6" />
						</div>
						<div>
							<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
								Trending Now
							</h2>
							<p className="text-muted-foreground mt-1">
								Our most popular items this week
							</p>
						</div>
					</div>
					<Button
						variant="ghost"
						className="hover:bg-primary/10 hover:text-primary self-start md:self-auto"
					>
						View All <IconArrowRight className="ml-2 size-4" />
					</Button>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
					{products.map((product: Product) => (
						<div
							key={product.id}
							className="group flex flex-col bg-transparent"
						>
							<div className="relative aspect-4/5 rounded-3xl bg-card overflow-hidden border shadow-sm transition-all duration-300 group-hover:shadow-md mb-4">
								{product.images?.[0] ? (
									<Image
										src={product.images[0]}
										alt={product.name}
										fill
										className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
									/>
								) : (
									<div className="flex flex-col h-full w-full items-center justify-center text-muted-foreground/50 bg-muted/20">
										<IconShoppingBag className="h-12 w-12 mb-2 opacity-50" />
										<span className="text-sm font-medium">No Image</span>
									</div>
								)}

								{/* Quick add button overlay */}
								<div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
									<Button className="w-full shadow-lg gap-2 rounded-xl h-11">
										<IconShoppingCart className="size-4" /> Add to Cart
									</Button>
								</div>

								{/* Badge */}
								{product.inventory < 10 && (
									<div className="absolute top-4 left-4 rounded-full bg-destructive/90 backdrop-blur text-destructive-foreground px-3 py-1 text-xs font-bold shadow-sm">
										Low Stock
									</div>
								)}
							</div>

							<div className="flex flex-col px-1">
								<div className="flex justify-between items-start mb-1">
									<div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
										{product.brand || "Generic"}
									</div>
									<div className="flex items-center text-amber-500">
										<IconStarFilled className="h-3 w-3" />
										<span className="text-xs font-medium ml-1 text-foreground/70">
											4.8
										</span>
									</div>
								</div>
								<h3 className="font-bold text-lg mb-1 leading-tight line-clamp-1 group-hover:text-primary transition-colors">
									{product.name}
								</h3>
								<div className="mt-1 flex items-center gap-2">
									<span className="font-black text-xl">
										${Number(product.price).toFixed(2)}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Newsletter */}
			<section className="p-12 flex flex-col gap-4 border-y text-center">
				<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
					Join Our Newsletter
				</h2>
				<p className="text-muted-foreground max-w-2xl mx-auto">
					Subscribe to get special offers, free giveaways, and
					once-in-a-lifetime deals.
				</p>
				<form className="pb-2 w-full flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
					<Input
						type="email"
						placeholder="Enter your email"
						className="h-10 text-sm rounded-xl"
					/>
					<Button className="h-10 text-sm px-4">Subscribe</Button>
				</form>
			</section>

			{/* Footer */}
			<footer className="px-12">
				<div className="p-12 pr-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
					<div className="col-span-2 lg:col-span-2">
						<div className="flex items-center gap-2 mb-6">
							<IconShoppingBag className="size-8 text-primary" />
							<span className="text-2xl font-black tracking-tighter">
								Shopofort
							</span>
						</div>
						<p className="text-muted-foreground max-w-xs mb-6 leading-relaxed text-sm">
							The ultimate destination for modern fashion, accessories, and the
							latest tech gadgets.
						</p>
					</div>

					<div>
						<h4 className="font-bold mb-4">Shop</h4>
						<ul className="space-y-3 text-sm text-muted-foreground">
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Men's Fashion
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Women's Fashion
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Kids & Babies
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Accessories
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="font-bold mb-4">Support</h4>
						<ul className="space-y-3 text-sm text-muted-foreground">
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Help Center
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Track Order
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Returns & Refunds
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Contact Us
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="font-bold mb-4">Company</h4>
						<ul className="space-y-3 text-sm text-muted-foreground">
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									About Us
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Careers
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="p-5 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
					<p>© 2026 Shopofort Inc. All rights reserved.</p>
					<div className="flex gap-4">
						<Link href="#" className="hover:text-primary">
							Facebook
						</Link>
						<Link href="#" className="hover:text-primary">
							Twitter
						</Link>
						<Link href="#" className="hover:text-primary">
							Instagram
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
