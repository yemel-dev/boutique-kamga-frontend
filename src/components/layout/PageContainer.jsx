import Sidebar from "./Sidebar";

export default function PageContainer({ title, children }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-slate-100 mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
}