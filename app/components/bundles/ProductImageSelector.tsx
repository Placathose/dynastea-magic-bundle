import { useState } from "react";
import {
  ResourceList,
  ResourceItem,
  Thumbnail,
  Text,
  Spinner,
  EmptyState,
  Button,
  Modal,
  Frame,
} from "@shopify/polaris";
import { ImageIcon } from "@shopify/polaris-icons";

interface ProductImage {
  id: string;
  url: string;
  altText: string;
}

interface ProductImageSelectorProps {
  onSelect: (imageUrl: string) => void;
  selectedImageUrl?: string;
}

export function ProductImageSelector({ onSelect, selectedImageUrl }: ProductImageSelectorProps) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchProductImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/app/api/product-images");
      if (!response.ok) {
        throw new Error("Failed to fetch product images");
      }
      const data = await response.json();
      setImages(data.images);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
    fetchProductImages();
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleImageSelect = (url: string) => {
    onSelect(url);
    handleModalClose();
  };

  const modalMarkup = (
    <Modal
      open={modalOpen}
      onClose={handleModalClose}
      title="Select Product Image"
      primaryAction={{
        content: "Close",
        onAction: handleModalClose,
      }}
      size="large"
    >
      <Modal.Section>
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <Spinner accessibilityLabel="Loading product images" size="large" />
          </div>
        ) : error ? (
          <EmptyState
            heading="Error loading images"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>{error}</p>
          </EmptyState>
        ) : images.length === 0 ? (
          <EmptyState
            heading="No product images found"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>Add some products with images to your store to use them in bundles.</p>
          </EmptyState>
        ) : (
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <ResourceList
              items={images}
              renderItem={(item) => {
                const { id, url, altText } = item;
                const isSelected = url === selectedImageUrl;

                return (
                  <ResourceItem
                    id={id}
                    onClick={() => handleImageSelect(url)}
                    media={
                      <div style={isSelected ? { border: "2px solid #008060", borderRadius: "4px" } : undefined}>
                        <Thumbnail
                          source={url}
                          alt={altText}
                          size="large"
                        />
                      </div>
                    }
                    accessibilityLabel={`Select image: ${altText}`}
                  >
                    <Text as="p" variant="bodyMd" fontWeight="bold">
                      {altText}
                    </Text>
                  </ResourceItem>
                );
              }}
            />
          </div>
        )}
      </Modal.Section>
    </Modal>
  );

  return (
    <Frame>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button
          icon={ImageIcon}
          onClick={handleModalOpen}
          variant="primary"
        >
          Select Image
        </Button>
        {selectedImageUrl && (
          <div style={{ width: "100px", height: "100px", position: "relative" }}>
            <img
              src={selectedImageUrl}
              alt="Selected product"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
          </div>
        )}
      </div>
      {modalMarkup}
    </Frame>
  );
} 