import { getCollection } from "astro:content";

export async function GET({ params, request }) {
  const locs = (await getCollection("posts"))
    .filter((post) => !post.data.unlisted)
    .map(
      (post) => `
        <url>
            <loc>https://omranjamal.me/blog/${post.slug}</loc>
        </url>
    `
    );

  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?>' +
      `
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
            xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
            ${locs.join("\n")}
        </urlset>
      `,
    {
      headers: {
        "Content-Type": "application/xml",
      },
    }
  );
}