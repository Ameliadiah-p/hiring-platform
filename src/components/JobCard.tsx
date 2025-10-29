type JobCardProps = {
  logo: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  isActive?: boolean;
  onClick?: () => void;
};

export default function JobCard({
  logo,
  title,
  company,
  location,
  salary,
  isActive,
  onClick,
}: JobCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex gap-3 items-start border rounded-lg p-4 mb-3 cursor-pointer transition
        ${isActive ? "border-[#00A7A7] bg-[#F9FEFE]" : "border-gray-200 hover:border-[#00A7A7]/50"}`}
    >
      {/* Company Logo */}
      <img src={logo} alt={company} className="w-10 h-10 rounded-md object-contain" />

      {/* Job Info */}
      <div className="flex flex-col flex-1">
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        <p className="text-sm text-gray-500">{company}</p>

        <div className="mt-2 space-y-1 text-xs text-gray-500">
          <p>{location}</p>
          <p className="font-medium text-gray-700">{salary}</p>
        </div>
      </div>
    </div>
  );
}
