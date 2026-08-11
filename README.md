This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](https://shopofort-b91s.vercel.app in prod) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

<!-- Biome auto sort imports -->

pnpm biome format --write .

- update selects options for create and edit buttons
- refactpr edit create and delete to have the same structure
- add select multiple to update or delete multiple entities

- TO DO :
  <!-- products and users page -->
  1. fix upload images in product and user table create and edit.
  <!-- dashboard page -->
  2. make a dashboard design with shadcn UI and display statistics by using the most relevent data from the database.
  <!-- table filtering and sorting -->
  3. add the ability to sort from server any table columns in DataTable by adding arrows to the table header.
  - Note: the sorting and filtering should should work together (update the get function for each table) and should update the pagination from server (new total pages and reset current page to 1).



Important: Since I don't have AWS S3 account, the images are saved locally.