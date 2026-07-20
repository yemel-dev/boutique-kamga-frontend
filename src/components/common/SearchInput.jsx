import { Search } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg w-full sm:w-64 bg-white"
      />
    </div>
  );
}