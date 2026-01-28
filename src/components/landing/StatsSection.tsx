export function StatsSection() {
  const stats = [
    { value: '500+', label: 'Faculty Members' },
    { value: '10K+', label: 'CPS Entries' },
    { value: '6', label: 'Departments' },
    { value: '98%', label: 'Approval Rate' },
  ];

  return (
    <section className="py-16 bg-[hsl(220,60%,20%)]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[hsl(45,93%,55%)] mb-2">
                {stat.value}
              </div>
              <div className="text-white/80 text-lg">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
