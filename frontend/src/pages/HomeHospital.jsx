import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/apiservice";
import { FaShare, FaArrowLeft } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeHospital = () => {
  const { hospitalId } = useParams();
  const [hospitalData, setHospitalData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/hospital/${hospitalId}`);
        if (res.ok) {
          const data = await res.json();
          setHospitalData(data);
        } else {
          setError("Failed to fetch hospital data");
        }
      } catch (error) {
        setError("Error fetching hospital data");
      }
    };

    fetchHospitalData();
  }, [hospitalId]);

  const shareHospital = () => {
    const deepLink = `${window.location.origin}/hospital/${hospitalId}`;
    if (navigator.share) {
      navigator.share({
        title: "Check out this hospital",
        text: "I found this hospital and thought you might be interested.",
        url: deepLink,
      });
    } else {
      alert(`Shareable URL: ${deepLink}`);
    }
  };

  if (error) {
    return <div className="text-red-600 text-center py-10 text-lg">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <button
          className="flex items-center text-gray-600 hover:text-gray-800 transition duration-300"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft size={18} className="mr-2" />
          <span>Back</span>
        </button>
        <button
          className="flex items-center text-blue-600 hover:text-blue-800 transition duration-300"
          onClick={shareHospital}
        >
          <FaShare size={18} className="mr-2" />
          <span>Share</span>
        </button>
      </div>
      <ToastContainer />

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {hospitalData?.name}
        </h1>

        {hospitalData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hospital Images */}
            <div className="flex flex-wrap items-start">
              <div className="w-full md:w-2/3 mb-4 md:mb-0">
                <img
                  src={hospitalData.photos[0]}
                  alt="Main Photo"
                  className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md transition-transform transform hover:scale-105"
                />
              </div>
              <div className="flex flex-wrap w-full md:w-1/3 md:pl-4">
                {hospitalData.photos.slice(1, 5).map((photo, index) => (
                  <div
                    key={index}
                    className="w-1/2 mb-4 p-1 transition-transform transform hover:scale-105"
                  >
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Hospital Details */}
            <div className="text-gray-700 space-y-4">
              <p className="text-lg">
                <strong>City:</strong> {hospitalData.location}
              </p>
              <p className="text-lg">
                <strong>Capacity:</strong> {hospitalData.capacity}
              </p>
              <p className="text-lg">
                <strong>Number of Beds:</strong> {hospitalData.beds}
              </p>
              <p className="text-lg">
                <strong>Specialties:</strong>{" "}
                {hospitalData.specialties.length > 0
                  ? hospitalData.specialties.join(", ")
                  : "N/A"}
              </p>
              <p className="text-lg">
                <strong>Emergency Services:</strong>{" "}
                {hospitalData.emergency_services ? (
                  <span className="text-green-600 font-semibold">Available</span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    Not Available
                  </span>
                )}
              </p>
              <p className="text-lg">
                <strong>Email:</strong> {hospitalData.contact?.email || "N/A"}
              </p>
              <p className="text-lg">
                <strong>Phone:</strong> {hospitalData.contact?.phone || "N/A"}
              </p>
            </div>
          </div>
        )}

        {/* Map Section */}
        {hospitalData?.mapUrl && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Location Map</h3>
            <div className="rounded-lg overflow-hidden shadow-md">
              <iframe
                src={hospitalData.mapUrl}
                width="100%"
                height="400"
                className="w-full"
                style={{ border: 0 }}
                allowFullScreen
                title="Hospital Location"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeHospital;
