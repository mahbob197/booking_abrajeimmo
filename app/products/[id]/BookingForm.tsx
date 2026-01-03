"use client";

import { useState } from "react";

type Props = {
  productId: number;
  price: number;
};

export default function BookingForm({ productId, price }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [totalPersons, setTotalPersons] = useState(1);

  // Upload files
  const [cinFile, setCinFile] = useState<File | null>(null);
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [contractFile, setContractFile] = useState<File | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // calcul nuits
      const nights =
        startDate && endDate
          ? (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24)
          : 0;

      const totalPrice = nights > 0 ? nights * price : price;

      // FormData pour uploader fichiers
      const fd = new FormData();
      fd.append("productId", String(productId));
      fd.append("startDate", startDate);
      fd.append("endDate", endDate);
      fd.append("totalPrice", String(totalPrice));

      fd.append("fullName", fullName);
      fd.append("phone", phone);
      fd.append("address", address);
      fd.append("totalPersons", String(totalPersons));

      if (cinFile) fd.append("cinFile", cinFile);
      if (passportFile) fd.append("passportFile", passportFile);
      if (contractFile) fd.append("contractFile", contractFile);

      const res = await fetch("/api/reservations", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Erreur lors de la réservation");
      } else {
        setMessage("Réservation créée avec succès !");
      }
    } catch (err) {
      setMessage("Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow space-y-4">
      <h2 className="text-lg font-semibold">Réserver ce logement</h2>

      {message && (
        <p className="text-sm text-blue-600 font-medium">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* INFOS CLIENT */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Nom complet"
            className="w-full border rounded px-3 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Téléphone"
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Adresse"
            className="w-full border rounded px-3 py-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <input
            type="number"
            min={1}
            placeholder="Nombre total de personnes"
            className="w-full border rounded px-3 py-2"
            value={totalPersons}
            onChange={(e) => setTotalPersons(Number(e.target.value))}
            required
          />
        </div>

        {/* DATES */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600">Date d'arrivée</label>
            <input
              type="date"
              className="w-full rounded border px-2 py-1"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Date de départ</label>
            <input
              type="date"
              className="w-full rounded border px-2 py-1"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* UPLOAD DOCUMENTS */}
        <div className="space-y-2">
          <label className="block text-xs text-gray-600">
            Carte d'identité (CIN)
          </label>
          <input
            type="file"
            onChange={(e) => setCinFile(e.target.files?.[0] || null)}
          />

          <label className="block text-xs text-gray-600">
            Passeport
          </label>
          <input
            type="file"
            onChange={(e) => setPassportFile(e.target.files?.[0] || null)}
          />

          <label className="block text-xs text-gray-600">
            Contrat signé
          </label>
          <input
            type="file"
            onChange={(e) => setContractFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Réservation..." : "Réserver"}
        </button>
      </form>
    </div>
  );
}
