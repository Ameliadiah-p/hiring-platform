import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import verifiedImg from "../assets/verified.svg";

export default function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to jobs page after 5 seconds
    const timer = setTimeout(() => {
      navigate("/jobs");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
        {/* Verified Image */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <img
            src={verifiedImg}
            alt="Success"
            className="w-40 sm:w-64 h-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          🎉 Your application was sent!
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base mb-4 leading-relaxed">
          Congratulations! You've taken the first step towards a rewarding career at Rakamin.
        </p>

        <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
          We look forward to learning more about you during the application process.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => navigate("/jobs")}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-md transition cursor-pointer text-sm sm:text-base"
          >
            Back to Job List
          </button>
          <button
            onClick={() => navigate("/")}
            className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-md transition cursor-pointer text-sm sm:text-base"
          >
            Go to Home
          </button>
        </div>

        {/* Auto redirect message */}
        <p className="text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8">
          Redirecting to job list in a few seconds...
        </p>
      </div>
    </div>
  );
}
