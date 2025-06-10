import prisma from "../db.server";
import type { Bundle, CreateBundleInput } from "../types/bundle";

const convertDatesToStrings = (bundle: any): Bundle => ({
  ...bundle,
  createdAt: bundle.createdAt.toISOString(),
  updatedAt: bundle.updatedAt.toISOString(),
  bundleProducts: bundle.bundleProducts.map((bp: any) => ({
    ...bp,
    createdAt: bp.createdAt.toISOString(),
    updatedAt: bp.updatedAt.toISOString(),
  })),
});

export async function createBundle(shopId: string, input: CreateBundleInput): Promise<Bundle> {
  const bundle = await prisma.bundle.create({
    data: {
      shopId,
      title: input.title,
      description: input.description,
      imageUrl: input.imageUrl,
      originalPrice: input.originalPrice,
      discountedPrice: input.discountedPrice,
      bundleProducts: {
        create: input.bundleProducts.map(product => ({
          productId: product.productId,
          quantity: product.quantity,
        })),
      },
    },
    include: {
      bundleProducts: true,
    },
  });
  return convertDatesToStrings(bundle);
}

export async function listBundles(shopId: string): Promise<Bundle[]> {
  const bundles = await prisma.bundle.findMany({
    where: {
      shopId,
    },
    include: {
      bundleProducts: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return bundles.map(convertDatesToStrings);
} 