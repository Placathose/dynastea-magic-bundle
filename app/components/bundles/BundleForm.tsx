import {
  Page,
  Layout,
  Card,
  Form,
  FormLayout,
  TextField,
  Button,
  Select,
  Banner,
} from "@shopify/polaris";
import { useState } from "react";
import type { Bundle } from "../../types/bundle";

interface BundleFormProps {
  onSubmit: (data: Omit<Bundle, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  initialData?: Partial<Bundle>;
  isSubmitting?: boolean;
  error?: string;
  shopId: string;
}

export function BundleForm({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
  error,
  shopId,
}: BundleFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [discountedPrice, setDiscountedPrice] = useState(
    initialData?.discountedPrice?.toString() || ""
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      imageUrl,
      discountedPrice: parseFloat(discountedPrice),
      isActive,
      shopId,
      originalPrice: parseFloat(discountedPrice), // TODO: Calculate from products
      bundleProducts: [], // TODO: Add product selection
    });
  };

  return (
    <Page
      title={initialData ? "Edit Bundle" : "Create Bundle"}
      backAction={{ content: "Bundles", onAction: onCancel }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                {error && (
                  <Banner tone="critical">
                    <p>{error}</p>
                  </Banner>
                )}

                <TextField
                  label="Title"
                  value={title}
                  onChange={setTitle}
                  autoComplete="off"
                  requiredIndicator
                />

                <TextField
                  label="Description"
                  value={description}
                  onChange={setDescription}
                  multiline={3}
                  autoComplete="off"
                />

                <TextField
                  label="Image URL"
                  value={imageUrl}
                  onChange={setImageUrl}
                  autoComplete="off"
                />

                <TextField
                  label="Discounted Price"
                  type="number"
                  value={discountedPrice}
                  onChange={setDiscountedPrice}
                  prefix="$"
                  autoComplete="off"
                  requiredIndicator
                />

                <Select
                  label="Status"
                  options={[
                    { label: "Active", value: "true" },
                    { label: "Inactive", value: "false" },
                  ]}
                  value={isActive.toString()}
                  onChange={(value) => setIsActive(value === "true")}
                />

                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <Button onClick={onCancel}>Cancel</Button>
                  <Button variant="primary" submit loading={isSubmitting}>
                    {initialData ? "Save Changes" : "Create Bundle"}
                  </Button>
                </div>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
} 