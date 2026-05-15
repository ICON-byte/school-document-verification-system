type StatCardTone = "primary" | "success" | "warning" | "muted";

interface StatCardProps {
  icon: string;
  label?: string;
  title?: string;
  value: number;
  description?: string;
  tone?: StatCardTone;
}

const toneStyles: Record<StatCardTone, string> = {
  primary: "bg-blue-100 text-[#6699ff]",
  success: "bg-blue-100 text-[#6699ff]",
  warning: "bg-blue-100 text-[#6699ff]",
  muted: "bg-blue-100 text-[#6699ff]",
};

const StatCard = ({
  icon,
  label,
  title,
  value,
  description,
  tone = "primary",
}: StatCardProps) => {
  const heading = title ?? label;

  return (
    <div className="group bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{heading}</p>

          <h3 className="text-3xl font-bold mt-2">{value}</h3>

          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>

        <div
          className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${toneStyles[tone]}`}
        >
          <i
            className={`${icon} text-2xl transition-transform duration-300 group-hover:scale-125`}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
