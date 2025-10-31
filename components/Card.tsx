export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border rounded-2xl p-4 shadow-sm bg-white">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
