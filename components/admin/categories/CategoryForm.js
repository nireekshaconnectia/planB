"use client";
import { useState, useEffect } from "react";
import styles from "./categoryForm.module.css";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const formatImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) {
    return url;
  }
  // Replace backslashes with forward slashes
  const formattedUrl = url.replace(/\\/g, "/");
  // Remove any leading slashes to avoid double slashes
  const cleanUrl = formattedUrl.replace(/^\/+/, "");
  return `${process.env.NEXT_PUBLIC_API_UPLOADS}/${cleanUrl}`;
};

export default function CategoryForm({ onSave, initialData = null, onClose }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    image: null,
    imagePreview: initialData?.imageUrl
      ? formatImageUrl(initialData.imageUrl)
      : "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  }, [status, session, router]);

  const validateImage = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error("Please upload a valid image file (JPEG, PNG, or WebP)");
    }

    if (file.size > maxSize) {
      throw new Error("Image size should be less than 5MB");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (status === "unauthenticated") {
      router.push("/admin");
      return;
    }

    if (!session?.user?.token) {
      setError("No authentication token found. Please login again.");
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("description", formData.description.trim());

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const url = initialData 
    ? `${process.env.NEXT_PUBLIC_API_URL}/category/${initialData.id}`
    : `${process.env.NEXT_PUBLIC_API_URL}/category`;

      const response = await fetch(url, {
        method: initialData ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin");
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(responseData.message || "Failed to save category");
      }

      if (responseData.status === "success") {
        onSave();
        onClose();
        if (!initialData) {
          setFormData({
            name: "",
            description: "",
            image: null,
            imagePreview: "",
          });
        }
      } else {
        throw new Error("Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      setError(error.message || "Failed to save category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.fieldGroup}>
        <label>Category Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter category name"
          required
        />
      </div>

      <div className={styles.fieldGroup}>
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter category description"
          required
        />
      </div>

      <div className={styles.fieldGroup}>
        <label>Category Image</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              try {
                validateImage(file);
                setFormData((prev) => ({
                  ...prev,
                  image: file,
                  imagePreview: URL.createObjectURL(file),
                }));
              } catch (error) {
                setError(error.message);
              }
            }
          }}
        />
        {formData.imagePreview && (
          <div className={styles.imagePreview}>
            <Image
              src={formData.imagePreview}
              alt="Preview"
              width={60}
              height={60}
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      <div className={styles.buttonGroup}>
        <button type="button" onClick={onClose} className={styles.cancelButton}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
