"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    latitude: "",
    longitude: "",
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);

  const [previewMain, setPreviewMain] = useState("");
  const [previewsGallery, setPreviewsGallery] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ============================
  // 📤 SUBMIT FORM WITH MULTIPLE FILES
  // ============================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();

      // TEXT FIELDS
      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value);
      });

      // MAIN IMAGE
      if (mainImage) fd.append("mainImage", mainImage);

      // GALLERY IMAGES
      gallery.forEach((file) => fd.append("gallery", file));

      // SEND TO BACKEND
      const res = await fetch("/api/products", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur serveur");
      } else {
        router.push(`/products/${data.id}`);
      }
    } catch (err) {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 text-2xl font-bold">Nouveau produit</h1>

      {error && <p className="mb-2 text-sm text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* FIELDS */}
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Titre"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />

        <textarea
          className="w-full rounded border px-3 py-2"
          placeholder="Description"
          rows={4}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />

        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Prix (MAD)"
          type="number"
          value={form.price}
          onChange={(e) => updateField("price", e.target.value)}
        />

        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Ville"
          value={form.city}
          onChange={(e) => updateField("city", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="Latitude"
            value={form.latitude}
            onChange={(e) => updateField("latitude", e.target.value)}
          />
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="Longitude"
            value={form.longitude}
            onChange={(e) => updateField("longitude", e.target.value)}
          />
        </div>

        {/* MAIN IMAGE */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            Image principale
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setMainImage(f);
                setPreviewMain(URL.createObjectURL(f));
              }
            }}
          />
          {previewMain && (
            <img
              src={previewMain}
              className="mt-3 w-48 h-48 object-cover rounded"
            />
          )}
        </div>

        {/* MULTIPLE GALLERY IMAGES */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            Galerie (plusieurs images)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                const files = Array.from(e.target.files);
                setGallery(files);
                setPreviewsGallery(files.map((f) => URL.createObjectURL(f)));
              }
            }}
          />

          {/* PREVIEWS */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {previewsGallery.map((src, i) => (
              <img
                key={i}
                src={src}
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 w-full"
        >
          {loading ? "Enregistrement..." : "Créer"}
        </button>
      </form>
    </div>
  );
}
