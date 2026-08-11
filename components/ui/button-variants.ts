import { cva } from "class-variance-authority";

export const buttonVariants = cva(
	"group/button inline-flex shrink-0 items-center justify-center rounded-xl bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 shadow-[0px_0px_4px_0.5px_rgba(20,38,41,0.5)]",
	{
		variants: {
			variant: {
				default:
					"bg-primary border border-mist-50 text-primary-foreground hover:bg-primary/80",
				primary:
					"bg-chart-4 dark:bg-muted-foreground border border-mist-200 dark:border-mist-800 text-mist-200 dark:text-mist-800 hover:bg-chart-3 hover:dark:bg-ring",
				secondary:
					"bg-sidebar-border dark:bg-secondary border border-mist-950 dark:border-mist-50 text-secondary-foreground hover:bg-chart-1 hover:dark:bg-sidebar-accent",
				outline:
					"bg-foreground/90 dark:bg-sidebar-accent border border-mist-50 text-mist-50 hover:bg-chart-4 hover:dark:bg-muted-foreground hover:dark:text-mist-800",
				ghost:
					"w-fit shadow-none hover:bg-muted hover:text-foreground hover:dark:bg-muted/50",
				destructive:
					"bg-destructive/10 dark:bg-destructive/10 border border-destructive text-destructive hover:bg-destructive/20 hover:dark:bg-destructive/30 focus-visible:border-destructive/40 focus-visible:ring-destructive/20  dark:focus-visible:ring-destructive/40",
				link: "w-fit border-none shadow-none text-primary underline-offset-4 hover:underline",
			},
			size: {
				default:
					"h-8 gap-1 px-2 text-sm has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
				xs: "h-5 gap-1 rounded-sm px-2 text-[0.625rem] has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-2.5",
				sm: "h-6 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3",
				lg: "h-9 gap-1 px-2.5 text-sm/relaxed has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-4",
				icon: "size-7.5 [&_svg:not([class*='size-'])]:size-3.5",
				"icon-xs": "size-5 rounded-sm [&_svg:not([class*='size-'])]:size-2.5",
				"icon-sm": "size-6 [&_svg:not([class*='size-'])]:size-3",
				"icon-lg": "size-8 [&_svg:not([class*='size-'])]:size-4",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);
