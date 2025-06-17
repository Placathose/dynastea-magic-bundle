import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { BundleForm } from "../components/bundles/BundleForm";
import { createBundle } from "../services/bundle.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Temporary mock shop ID for development
  const mockShopId = "dev-shop-1";
  return json({ shopId: mockShopId });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const shopId = formData.get("shopId") as string;
  const bundleData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    imageUrl: formData.get("imageUrl") as string,
    discountedPrice: parseFloat(formData.get("discountedPrice") as string),
    isActive: formData.get("isActive") === "true",
    originalPrice: parseFloat(formData.get("discountedPrice") as string), // TODO: Calculate from products
    bundleProducts: [], // TODO: Add product selection
  };

  try {
    await createBundle(shopId, bundleData);
    return redirect("/app/bundles");
  } catch (error) {
    return json({ error: "Failed to create bundle" }, { status: 400 });
  }
};

export default function NewBundlePage() {
  const { shopId } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const handleSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("shopId", shopId);
    Object.entries(data).forEach(([key, value]: [string, unknown]) => {
      formData.append(key, String(value));
    });
    submit(formData, { method: "post" });
  };

  return (
    <BundleForm
      onSubmit={handleSubmit}
      onCancel={() => window.location.href = "/app/bundles"}
      shopId={shopId}
    />
  );
} 