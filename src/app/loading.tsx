import { RefreshIcon } from "@/components/Icons";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <RefreshIcon className="w-8 h-8 text-brand-500 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">Carregando...</p>
      </div>
    </div>
  );
}
