import type { APIContext } from "astro";

export async function GET({ params, request, locals }) {
  const KV = locals.runtime.env.MAIN_KV;

  const randomNumber = Math.random();
  await KV.put("random_number", `${randomNumber}`);

  return new Response(
    JSON.stringify({
      random_number: randomNumber,
    })
  );
}
