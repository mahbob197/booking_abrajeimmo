"use client";

type TabProps = {
  id: string;
  name: string;
  count: number;
  icon: string;
};

export default function AdminTabs({ tabs }: { tabs: TabProps[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border mb-6">
      <nav className="flex space-x-6 px-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className="flex items-center py-4 text-sm font-medium text-gray-700 hover:text-blue-600"
            onClick={() =>
              document.getElementById(tab.id)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
            <span className="ml-2 bg-gray-200 px-2 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
