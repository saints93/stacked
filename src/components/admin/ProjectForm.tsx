"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Testimonial = {
  picture: string;
  name: string;
  subtitle: string;
  quote: string;
};

type ProjectFormData = {
  name: string;
  slug: string;
  published: boolean;
  featuredOnHomepage: boolean;
  homepageOrder: number;
  heroImages: string[]; // 1–2 hero images used on home + project page
  galleryImages: string[]; // arbitrary number of gallery images
  // Legacy fields kept for compatibility with existing JSON
  mainImage?: string;
  images?: string[];
  service: string;
  year: string;
  shortDescription: string;
  overviewHtml: string;
  challengesHtml: string;
  websiteLink: string;
  testimonial: Testimonial;
  nextProjectSlug: string;
};

type Props = {
  initialData?: ProjectFormData;
  isEditing?: boolean;
  allProjects?: { slug: string; name: string }[];
};

const defaultData: ProjectFormData = {
  name: "",
  slug: "",
  published: false,
  featuredOnHomepage: false,
  homepageOrder: 999,
  heroImages: [],
  galleryImages: [],
  mainImage: "",
  images: [],
  service: "",
  year: new Date().getFullYear().toString(),
  shortDescription: "",
  overviewHtml: "<h3>Overview</h3>\n<p>Describe the project overview here...</p>",
  challengesHtml: "<h3>Challenges</h3>\n<p>Describe the challenges faced...</p>",
  websiteLink: "",
  testimonial: {
    picture: "",
    name: "",
    subtitle: "",
    quote: "",
  },
  nextProjectSlug: "",
};

function normalizeInitialData(initial?: ProjectFormData): ProjectFormData {
  if (!initial) return defaultData;

  const heroImages =
    initial.heroImages && initial.heroImages.length > 0
      ? initial.heroImages
      : initial.mainImage
      ? [initial.mainImage]
      : [];

  const galleryImages =
    initial.galleryImages && initial.galleryImages.length > 0
      ? initial.galleryImages
      : initial.images ?? [];

  return {
    ...defaultData,
    ...initial,
    heroImages,
    galleryImages,
    mainImage: initial.mainImage ?? heroImages[0] ?? "",
    images: initial.images ?? galleryImages,
  };
}

export default function ProjectForm({
  initialData,
  isEditing = false,
  allProjects = [],
}: Props) {
  const [formData, setFormData] = useState<ProjectFormData>(
    normalizeInitialData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUploadField, setCurrentUploadField] = useState<string>("");

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleChange(
    field: keyof ProjectFormData,
    value: string | boolean | number | string[] | undefined
  ) {
    setFormData((prev) => {
      const updated: ProjectFormData = { ...prev, [field]: value } as ProjectFormData;
      // Auto-generate slug from name if not editing
      if (field === "name" && !isEditing) {
        updated.slug = generateSlug((value as string) || "");
      }
      return updated;
    });
  }

  function handleTestimonialChange(field: keyof Testimonial, value: string) {
    setFormData((prev) => ({
      ...prev,
      testimonial: { ...prev.testimonial, [field]: value },
    }));
  }

  async function handleImageUpload(field: string) {
    setCurrentUploadField(field);
    fileInputRef.current?.click();
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(currentUploadField);
    setError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("projectSlug", formData.slug || "temp");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      // Update the appropriate field
      if (currentUploadField.startsWith("hero-")) {
        const index = parseInt(currentUploadField.split("-")[1], 10);
        const newHero = [...(formData.heroImages || [])];
        newHero[index] = data.url;
        handleChange("heroImages", newHero);
        // Keep legacy mainImage in sync with first hero image
        if (index === 0) {
          handleChange("mainImage", data.url);
        }
      } else if (currentUploadField.startsWith("gallery-")) {
        const index = parseInt(currentUploadField.split("-")[1], 10);
        const newGallery = [...(formData.galleryImages || [])];
        newGallery[index] = data.url;
        handleChange("galleryImages", newGallery);
        handleChange("images", newGallery);
      } else if (currentUploadField === "gallery-new") {
        const newGallery = [...(formData.galleryImages || []), data.url];
        handleChange("galleryImages", newGallery);
        handleChange("images", newGallery);
      } else if (currentUploadField === "testimonialPicture") {
        handleTestimonialChange("picture", data.url);
      }
    } catch (err) {
      setError("Failed to upload image");
      console.error(err);
    } finally {
      setUploadingField(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function addHeroImage() {
    if (formData.heroImages.length >= 2) return;
    handleChange("heroImages", [...formData.heroImages, ""]);
  }

  function removeHeroImage(index: number) {
    const newHero = formData.heroImages.filter((_, i) => i !== index);
    handleChange("heroImages", newHero);
    if (index === 0) {
      handleChange("mainImage", newHero[0] || "");
    }
  }

  function addGalleryImage() {
    handleChange("galleryImages", [...formData.galleryImages, ""]);
  }

  function removeGalleryImage(index: number) {
    const newGallery = formData.galleryImages.filter((_, i) => i !== index);
    handleChange("galleryImages", newGallery);
    handleChange("images", newGallery);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url = isEditing ? `/api/projects/${initialData?.slug}` : "/api/projects";
      const method = isEditing ? "PUT" : "POST";

      // Ensure legacy fields are in sync before sending
      const payload: ProjectFormData = {
        ...formData,
        mainImage: formData.heroImages[0] || formData.mainImage || "",
        images: formData.galleryImages,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Failed to save project");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const canAddHeroImage = formData.heroImages.length < 2;

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <style jsx>{`
        .project-form {
          max-width: 800px;
        }
        .form-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #111;
          border: 1px solid #222;
          border-radius: 8px;
        }
        .form-section-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #fff;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          color: #666;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 0.75rem;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 4px;
          color: #fff;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }
        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #666;
        }
        .form-textarea {
          min-height: 120px;
          resize: vertical;
          font-family: monospace;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .form-checkbox {
          width: 1rem;
          height: 1rem;
          accent-color: #fff;
        }
        .form-checkbox-label {
          font-size: 0.875rem;
          color: #fff;
        }
        .image-preview {
          margin-top: 0.5rem;
          position: relative;
        }
        .image-preview img {
          max-width: 200px;
          max-height: 150px;
          object-fit: cover;
          border-radius: 4px;
          background: #222;
        }
        .image-upload-btn {
          padding: 0.5rem 1rem;
          background: #222;
          border: 1px solid #333;
          border-radius: 4px;
          color: #fff;
          font-size: 0.75rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .image-upload-btn:hover {
          background: #333;
        }
        .image-upload-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .images-list {
          display: grid;
          gap: 1rem;
        }
        .image-item {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 0.5rem;
          align-items: center;
        }
        .remove-btn {
          padding: 0.5rem;
          background: #dc2626;
          border: none;
          border-radius: 4px;
          color: #fff;
          font-size: 0.75rem;
          cursor: pointer;
        }
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        .submit-btn {
          padding: 0.75rem 2rem;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .submit-btn:hover {
          opacity: 0.9;
        }
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .cancel-btn {
          padding: 0.75rem 2rem;
          background: transparent;
          border: 1px solid #333;
          border-radius: 4px;
          color: #fff;
          cursor: pointer;
          text-decoration: none;
        }
        .cancel-btn:hover {
          border-color: #666;
        }
        .error-message {
          padding: 1rem;
          background: #dc262620;
          border: 1px solid #dc2626;
          border-radius: 4px;
          color: #dc2626;
          margin-bottom: 1rem;
        }
        .hint {
          font-size: 0.75rem;
          color: #666;
          margin-top: 0.25rem;
        }
        .hero-images-grid {
          display: grid;
          gap: 1rem;
        }
        .hero-label {
          font-size: 0.75rem;
          color: #888;
        }
        
        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .project-form {
            max-width: 100%;
          }
          .form-section {
            padding: 1rem;
            margin-bottom: 1.5rem;
          }
          .form-section-title {
            font-size: 0.9rem;
          }
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .form-input,
          .form-textarea,
          .form-select {
            font-size: 16px; /* Prevent iOS zoom */
            padding: 0.65rem;
          }
          .form-textarea {
            min-height: 100px;
          }
          .form-checkbox-group {
            padding: 0.5rem 0;
          }
          .form-checkbox-label {
            font-size: 0.8rem;
          }
          .image-item {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          .image-item .form-input {
            width: 100%;
          }
          .image-item .image-upload-btn,
          .image-item .remove-btn {
            width: 100%;
            padding: 0.6rem;
            min-height: 44px;
          }
          .image-preview img {
            max-width: 100%;
            max-height: 200px;
          }
          .form-actions {
            flex-direction: column;
            gap: 0.75rem;
          }
          .submit-btn,
          .cancel-btn {
            width: 100%;
            padding: 0.85rem 1rem;
            text-align: center;
            min-height: 48px;
          }
        }
        
        @media (max-width: 480px) {
          .form-section {
            padding: 0.85rem;
            margin-bottom: 1.25rem;
            border-radius: 6px;
          }
          .form-section-title {
            font-size: 0.85rem;
            margin-bottom: 0.75rem;
          }
          .form-label {
            font-size: 0.7rem;
          }
          .form-input,
          .form-textarea,
          .form-select {
            padding: 0.6rem;
          }
          .hint {
            font-size: 0.65rem;
          }
          .hero-label {
            font-size: 0.7rem;
          }
          .image-upload-btn {
            font-size: 0.7rem;
          }
        }
      `}</style>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileSelected}
        accept="image/*,video/*"
        style={{ display: "none" }}
      />

      {error && <div className="error-message">{error}</div>}

      {/* Basic Info */}
      <div className="form-section">
        <h3 className="form-section-title">Basic Information</h3>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., Aurora"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Slug *</label>
            <input
              type="text"
              className="form-input"
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              placeholder="e.g., aurora"
              required
              readOnly={isEditing}
            />
            <p className="hint">URL: /projects/{formData.slug || "slug"}</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Service</label>
            <input
              type="text"
              className="form-input"
              value={formData.service}
              onChange={(e) => handleChange("service", e.target.value)}
              placeholder="e.g., UI/UX Design"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Year</label>
            <input
              type="text"
              className="form-input"
              value={formData.year}
              onChange={(e) => handleChange("year", e.target.value)}
              placeholder="e.g., 2024"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Short Description</label>
          <input
            type="text"
            className="form-input"
            value={formData.shortDescription}
            onChange={(e) => handleChange("shortDescription", e.target.value)}
            placeholder="Brief project description..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Website Link</label>
          <input
            type="url"
            className="form-input"
            value={formData.websiteLink}
            onChange={(e) => handleChange("websiteLink", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Publishing */}
      <div className="form-section">
        <h3 className="form-section-title">Publishing</h3>

        <div className="form-row">
          <div className="form-checkbox-group">
            <input
              type="checkbox"
              className="form-checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => handleChange("published", e.target.checked)}
            />
            <label htmlFor="published" className="form-checkbox-label">
              Published (visible on live site)
            </label>
          </div>
          <div className="form-checkbox-group">
            <input
              type="checkbox"
              className="form-checkbox"
              id="featured"
              checked={formData.featuredOnHomepage}
              onChange={(e) =>
                handleChange("featuredOnHomepage", e.target.checked)
              }
            />
            <label htmlFor="featured" className="form-checkbox-label">
              Featured on Homepage
            </label>
          </div>
        </div>

        {formData.featuredOnHomepage && (
          <div className="form-group" style={{ marginTop: "1rem" }}>
            <label className="form-label">Homepage Order</label>
            <input
              type="number"
              className="form-input"
              value={formData.homepageOrder}
              onChange={(e) =>
                handleChange(
                  "homepageOrder",
                  parseInt(e.target.value || "0", 10)
                )
              }
              min={1}
              style={{ width: "100px" }}
            />
            <p className="hint">Lower numbers appear first</p>
          </div>
        )}

        <div className="form-group" style={{ marginTop: "1rem" }}>
          <label className="form-label">Next Project</label>
          <select
            className="form-select"
            value={formData.nextProjectSlug}
            onChange={(e) => handleChange("nextProjectSlug", e.target.value)}
          >
            <option value="">-- Select next project --</option>
            {allProjects
              .filter((p) => p.slug !== formData.slug)
              .map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Hero Media */}
      <div className="form-section">
        <h3 className="form-section-title">Hero Media</h3>
        <p className="hero-label">
          Optional hero video plus a hero image poster used on the homepage
          animations and as the main hero visuals on the project page.
        </p>

        <div className="hero-images-grid">
          {formData.heroImages.map((img, index) => {
            const isVideo = /\.(mp4|webm|mov)$/i.test(img);
            return (
              <div key={index} className="form-group">
                <label className="form-label">
                  {index === 0 ? "Hero Video (optional)" : "Hero Image (poster)"}
                </label>
                {index === 0 ? (
                  <p className="hint">
                    MP4 / WEBM. If empty, the hero will use the static image only.
                  </p>
                ) : (
                  <p className="hint">
                    Static image used for the hero poster and all thumbnails.
                  </p>
                )}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    className="form-input"
                    value={img}
                    onChange={(e) => {
                      const newHero = [...formData.heroImages];
                      newHero[index] = e.target.value;
                      handleChange("heroImages", newHero);
                      if (index === 0) {
                        handleChange("mainImage", e.target.value);
                      }
                    }}
                    placeholder="https://... or /projects/... (image or video)"
                  />
                  <button
                    type="button"
                    className="image-upload-btn"
                    onClick={() => handleImageUpload(`hero-${index}`)}
                    disabled={uploadingField === `hero-${index}`}
                  >
                    {uploadingField === `hero-${index}` ? "Uploading..." : "Upload"}
                  </button>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeHeroImage(index)}
                  >
                    ×
                  </button>
                </div>
                {img && (
                  <div className="image-preview">
                    {isVideo ? (
                      <video
                        src={img}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                          maxWidth: "200px",
                          maxHeight: "150px",
                          borderRadius: 4,
                          backgroundColor: "#000",
                        }}
                      />
                    ) : (
                      <img
                        src={img}
                        alt={`Hero ${index + 1}`}
                        style={{
                          maxWidth: "200px",
                          maxHeight: "150px",
                          objectFit: "cover",
                          borderRadius: 4,
                          background: "#222",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {canAddHeroImage && (
          <button
            type="button"
            className="image-upload-btn"
            onClick={addHeroImage}
            style={{ marginTop: "1rem" }}
          >
            + Add Hero Image
          </button>
        )}
      </div>

      {/* Gallery Images */}
      <div className="form-section">
        <h3 className="form-section-title">Gallery Images</h3>
        <p className="hero-label">
          These images appear in a horizontal gallery at the bottom of the
          project page.
        </p>

        <div className="images-list">
          {formData.galleryImages.map((img, index) => (
            <div key={index} className="image-item">
              <input
                type="text"
                className="form-input"
                value={img}
                onChange={(e) => {
                  const newGallery = [...formData.galleryImages];
                  newGallery[index] = e.target.value;
                  handleChange("galleryImages", newGallery);
                  handleChange("images", newGallery);
                }}
                placeholder="Image URL..."
              />
              <button
                type="button"
                className="image-upload-btn"
                onClick={() => handleImageUpload(`gallery-${index}`)}
                disabled={uploadingField === `gallery-${index}`}
              >
                {uploadingField === `gallery-${index}` ? "..." : "Upload"}
              </button>
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeGalleryImage(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="image-upload-btn"
          onClick={addGalleryImage}
          style={{ marginTop: "1rem" }}
        >
          + Add Gallery Image
        </button>
      </div>

      {/* Content */}
      <div className="form-section">
        <h3 className="form-section-title">Content</h3>

        <div className="form-group">
          <label className="form-label">Overview (HTML)</label>
          <textarea
            className="form-textarea"
            value={formData.overviewHtml}
            onChange={(e) => handleChange("overviewHtml", e.target.value)}
            placeholder="<h3>Overview</h3><p>...</p>"
            rows={8}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Challenges (HTML)</label>
          <textarea
            className="form-textarea"
            value={formData.challengesHtml}
            onChange={(e) => handleChange("challengesHtml", e.target.value)}
            placeholder="<h3>Challenges</h3><p>...</p>"
            rows={8}
          />
        </div>
      </div>

      {/* Testimonial */}
      <div className="form-section">
        <h3 className="form-section-title">Testimonial</h3>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Client Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.testimonial.name}
              onChange={(e) => handleTestimonialChange("name", e.target.value)}
              placeholder="e.g., John Smith"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Client Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.testimonial.subtitle}
              onChange={(e) => handleTestimonialChange("subtitle", e.target.value)}
              placeholder="e.g., CEO"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Client Photo URL</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              className="form-input"
              value={formData.testimonial.picture}
              onChange={(e) => handleTestimonialChange("picture", e.target.value)}
              placeholder="https://..."
            />
            <button
              type="button"
              className="image-upload-btn"
              onClick={() => handleImageUpload("testimonialPicture")}
              disabled={uploadingField === "testimonialPicture"}
            >
              {uploadingField === "testimonialPicture" ? "..." : "Upload"}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Quote</label>
          <textarea
            className="form-textarea"
            value={formData.testimonial.quote}
            onChange={(e) => handleTestimonialChange("quote", e.target.value)}
            placeholder="What the client said about the project..."
            rows={3}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn" disabled={saving}>
          {saving ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
        </button>
        <a href="/admin" className="cancel-btn">
          Cancel
        </a>
      </div>
    </form>
  );
}
