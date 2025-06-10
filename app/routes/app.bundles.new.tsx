import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { BundleForm } from "../components/bundles/BundleForm";
import { createBundle } from "../services/bundle.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Temporary mock shop ID for development
  const mockShopId = "dev-shop-1";
  return json({ shopId: mockShopId });
};

export default function NewBundlePage() {
  const { shopId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await createBundle(shopId, data);
    navigate("/app/bundles");
  };

  return (
    <BundleForm
      onSubmit={handleSubmit}
      onCancel={() => navigate("/app/bundles")}
      shopId={shopId}
    />
  );
} 