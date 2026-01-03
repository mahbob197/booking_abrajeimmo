type AdminStatsProps = {
  totalProducts: number;
  totalUsers: number;
  totalReservations: number;
  confirmedReservations: number;
  pendingReservations: number;
};

export function AdminStats({
  totalProducts,
  totalUsers,
  totalReservations,
  confirmedReservations,
  pendingReservations
}: AdminStatsProps) {

  const stats: {
    name: string;
    value: number;
    icon: string;
    color: string;
    description: string;
  }[] = [
    {
      name: "Produits",
      value: totalProducts,
      icon: "📦",
      color: "bg-blue-500",
      description: "Total des hébergements",
    },
    {
      name: "Utilisateurs",
      value: totalUsers,
      icon: "👥",
      color: "bg-green-500",
      description: "Utilisateurs inscrits",
    },
    {
      name: "Réservations",
      value: totalReservations,
      icon: "📅",
      color: "bg-purple-500",
      description: "Total des réservations",
    },
    {
      name: "Confirmées",
      value: confirmedReservations,
      icon: "✅",
      color: "bg-emerald-500",
      description: "Réservations confirmées",
    },
    {
      name: "En attente",
      value: pendingReservations,
      icon: "⏳",
      color: "bg-yellow-500",
      description: "Réservations en attente",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white overflow-hidden shadow rounded-lg border border-gray-100"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-md ${stat.color} bg-opacity-10`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>

              <div className="ml-4 w-full">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
