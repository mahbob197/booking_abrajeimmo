"use client";

import Image from "next/image";
import { updateReservationStatus, deleteReservation } from "./actions";

interface ReservationTableProps {
  reservations: any[];
}

export function ReservationTable({ reservations }: ReservationTableProps) {
  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  const statusLabels: { [key: string]: string } = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    cancelled: 'Annulée',
    completed: 'Terminée',
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Réservation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dates & Personnes
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prix
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="hover:bg-gray-50 transition duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{reservation.id}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{reservation.user?.name}</div>
                <div className="text-sm text-gray-500">{reservation.user?.email}</div>
                <div className="text-sm text-gray-500">{reservation.user?.phone}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <Image
                      className="h-10 w-10 rounded-lg object-cover"
                      src={reservation.product?.image || "/placeholder.png"}
                      alt={reservation.product?.title}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-xs">
                      {reservation.product?.title}
                    </div>
                    <div className="text-sm text-gray-500">{reservation.product?.price} MAD/nuit</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  Du {new Date(reservation.startDate).toLocaleDateString('fr-FR')}
                </div>
                <div className="text-sm text-gray-900">
                  Au {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
                </div>
                <div className="text-sm text-gray-500">
                  {reservation.totalPersons || 1} personne(s)
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {reservation.totalPrice} MAD
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <form action={updateReservationStatus} className="inline">
                  <input type="hidden" name="id" value={reservation.id} />
                  <select
                    name="status"
                    defaultValue={reservation.status}
                    className={`text-xs font-semibold rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-opacity-50 ${
                      statusColors[reservation.status] || 'bg-gray-100 text-gray-800'
                    }`}
                    onChange={(e) => {
                      if (confirm(`Changer le statut en ${statusLabels[e.target.value]} ?`)) {
                        e.target.form?.requestSubmit();
                      } else {
                        e.target.value = reservation.status;
                      }
                    }}
                  >
                    <option value="pending" className="bg-white">En attente</option>
                    <option value="confirmed" className="bg-white">Confirmée</option>
                    <option value="cancelled" className="bg-white">Annulée</option>
                    <option value="completed" className="bg-white">Terminée</option>
                  </select>
                </form>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  className="text-blue-600 hover:text-blue-900 transition duration-150"
                  onClick={() => {
                    // Voir les détails de la réservation
                    alert(`Détails de la réservation #${reservation.id}`);
                  }}
                >
                  Détails
                </button>
                <form action={deleteReservation} className="inline">
                  <input type="hidden" name="id" value={reservation.id} />
                  <button
                    type="submit"
                    className="text-red-600 hover:text-red-900 transition duration-150"
                    onClick={(e) => {
                      if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Supprimer
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
