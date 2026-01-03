"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();

      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("password", form.password);

      if (avatarFile) fd.append("avatar", avatarFile);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur création compte");
      } else {
        router.push("/");
      }
    } catch {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-2xl font-bold">Créer un compte</h1>

      {error && <p className="mb-2 text-sm text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar Upload */}
        <div>
          <label className="text-sm text-gray-700">Avatar</label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setAvatarFile(file);
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />

          {preview && (
            <img
              src={preview}
              alt="Aperçu"
              className="mt-2 w-24 h-24 rounded-full object-cover border"
            />
          )}
        </div>

        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Nom complet"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Téléphone (optionnel)"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
        />
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Mot de passe"
          type="password"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>
    </div>
  );
}
