import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { BundleList } from "../components/bundles/BundleList";
import { createBundle, listBundles } from "../services/bundle.server";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Temporary mock shop ID for development
  const mockShopId = "dev-shop-1";
  
  // Ensure shop exists
  await prisma.shop.upsert({
    where: { id: mockShopId },
    update: {},
    create: {
      id: mockShopId,
      name: "Development Shop",
      accessToken: "mock-token",
    },
  });

  const bundles = await listBundles(mockShopId);
  return json({ bundles });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const mockShopId = "dev-shop-1";
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  
  await createBundle(mockShopId, {
    title: data.title as string,
    description: data.description as string,
    imageUrl: data.imageUrl as string,
    originalPrice: parseFloat(data.originalPrice as string),
    discountedPrice: parseFloat(data.discountedPrice as string),
    bundleProducts: [],
  });

  return redirect("/app/bundles");
};

export default function BundlesPage() {
  const { bundles } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <BundleList
      bundles={bundles}
      onCreateBundle={() => navigate("/app/bundles/new")}
      onViewBundle={(id) => navigate(`/app/bundles/${id}`)}
    />
  );
} 