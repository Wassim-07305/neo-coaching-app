const stats = [
  { value: "+100", label: "Femmes accompagnees" },
  { value: "5", label: "Entreprises accompagnees" },
  { value: "30 ans", label: "d'experience" },
];

export function StatsSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100"
            >
              <div className="font-heading text-4xl sm:text-5xl font-bold text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 text-base sm:text-lg font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
