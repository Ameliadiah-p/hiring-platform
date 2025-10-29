import { useNavigate } from "react-router-dom";

type JobDetailProps = {
  id: number;
  logo: string;
  title: string;
  company: string;
  type: string;
  description: string[];
};

export default function JobDetail({
  id,
  logo,
  title,
  company,
  type,
  description,
}: JobDetailProps) {
  const navigate = useNavigate();

  return (
    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <img src={logo} alt={company} className="w-10 h-10 rounded-md object-contain flex-shrink-0" />
          <div className="min-w-0">
            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-md font-medium inline-block">
              {type}
            </span>
            <h2 className="text-base sm:text-lg font-semibold mt-2 break-words">{title}</h2>
            <p className="text-gray-500 text-sm break-words">{company}</p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/apply/${id}`)}
          className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-medium px-4 py-2 rounded-md cursor-pointer transition w-full sm:w-auto flex-shrink-0"
        >
          Apply
        </button>
      </div>

      <ul className="list-disc list-inside text-gray-700 text-xs sm:text-sm leading-relaxed space-y-1 mt-4">
        {description.map((item, i) => (
          <li key={i} className="break-words">{item}</li>
        ))}
      </ul>
    </div>
  );
}
