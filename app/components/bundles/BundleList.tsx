import {
  Page,
  Layout,
  Card,
  ResourceList,
  ResourceItem,
  Text,
  Badge,
  EmptyState,
} from "@shopify/polaris";
import type { Bundle } from "../../types/bundle";

interface BundleListProps {
  bundles: Bundle[];
  onCreateBundle: () => void;
  onViewBundle: (id: string) => void;
}

export function BundleList({ bundles, onCreateBundle, onViewBundle }: BundleListProps) {
  return (
    <Page
      title="Bundles"
      primaryAction={{
        content: "Create bundle",
        onAction: onCreateBundle,
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            {bundles.length > 0 ? (
              <ResourceList
                items={bundles}
                renderItem={(bundle) => (
                  <ResourceItem
                    id={bundle.id}
                    accessibilityLabel={`View details for ${bundle.title}`}
                    name={bundle.title}
                    onClick={() => onViewBundle(bundle.id)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <Text as="p" variant="bodyMd" fontWeight="bold">
                          {bundle.title}
                        </Text>
                        <div style={{ marginTop: "4px" }}>
                          <Text as="p" variant="bodySm" tone="subdued">
                            {bundle.description || "No description"}
                          </Text>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <Text as="p" variant="bodyMd">
                          ${bundle.discountedPrice.toFixed(2)}
                        </Text>
                        <Badge tone={bundle.isActive ? "success" : "critical"}>
                          {bundle.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </ResourceItem>
                )}
              />
            ) : (
              <EmptyState
                heading="Create your first bundle"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                action={{
                  content: "Create bundle",
                  onAction: onCreateBundle,
                }}
              >
                <p>Create bundles to offer your customers special package deals.</p>
              </EmptyState>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
} 