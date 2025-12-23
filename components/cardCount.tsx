import { LucideIcon } from "lucide-react";

interface CardCountProps {
  icon: LucideIcon;
  label: string;
  value?: number;
}

const CardCount = ({ icon: Icon, label, value }: CardCountProps) => {
  return (
    <div className="border p-4 w-64 rounded-lg">
      <div className="flex items-center gap-6">
        <Icon className="text-blue-500 w-8 h-8" />
        <div>
          <div className="text-md">{label}</div>
          <div className="font-bold text-2xl">{value ?? 0}</div>
        </div>
      </div>
    </div>
  );
};

export default CardCount;
