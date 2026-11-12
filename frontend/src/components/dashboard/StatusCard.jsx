const StatusCard = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </h2>
        </div>

        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}>
          {Icon && <Icon className={`text-2xl ${iconColor}`} />}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;