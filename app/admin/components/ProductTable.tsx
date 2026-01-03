"use client";

import Link from "next/link";
import Image from "next/image";
import { activateProduct, deleteProduct } from "./actions";

interface ProductTableProps {
  products: any[];
}

export function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prix
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ville
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Images
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Réservations
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Création
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition duration-150">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <Image
                      className="h-10 w-10 rounded-lg object-cover"
                      src={product.image || "/placeholder.png"}
                      alt={product.title}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 line-clamp-1 max-w-xs">
                      {product.title}
                    </div>
                    <div className="text-sm text-gray-500">ID: {product.id}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.price} MAD
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.city}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {product.images?.length || 0}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {product._count?.reservations || 0}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(product.createdAt).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Link
                  href={`/products/${product.id}`}
                  className="text-blue-600 hover:text-blue-900 transition duration-150"
                >
                  Voir
                </Link>
                <Link
                  href={`/admin/products/edit/${product.id}`}
                  className="text-yellow-600 hover:text-yellow-900 transition duration-150"
                >
                  Modifier
                </Link>
                <form action={deleteProduct} className="inline">
                  <input type="hidden" name="id" value={product.id} />
                  <button
                    type="submit"
                    className="text-red-600 hover:text-red-900 transition duration-150"
                    onClick={(e) => {
                      if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
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
