import { json, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // Get the session first
    const { admin, session } = await authenticate.admin(request);
    
    if (!session) {
      console.log("No session found, redirecting to auth");
      return redirect("/auth");
    }

    console.log("Session found, making GraphQL request...");
    const response = await admin.graphql(`
      query {
        shop {
          name
        }
        products(first: 50) {
          nodes {
            title
            images(first: 1) {
              nodes {
                id
                url
                altText
              }
            }
          }
        }
      }
    `);

    const responseData = await response.json();
    console.log("Shop name:", responseData.data?.shop?.name);

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }

    const {
      data: {
        products: { nodes },
      },
    } = responseData;

    // Flatten and filter out products without images
    const images = nodes
      .flatMap((product: any) => product.images.nodes)
      .filter((image: any) => image.url)
      .map((image: any) => ({
        id: image.id,
        url: image.url,
        altText: image.altText || "Product image",
      }));

    console.log("Successfully fetched images:", images.length);
    return json({ images });
  } catch (error: unknown) {
    console.error("Detailed error in product-images API:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // If it's an authentication error, redirect to auth
    if (error instanceof Response && error.status === 302) {
      return redirect("/auth");
    }

    return json(
      { error: `Failed to fetch product images: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}; 