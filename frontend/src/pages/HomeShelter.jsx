import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/apiservice";
import { FaShare, FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeShelter = () => {
  const { shelterId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [shelterData, setShelterData] = useState(null);
  const [error, setError] = useState(null);

  const isCsv = location.pathname.includes("/csv/");

  useEffect(() => {
    const fetchShelterData = async () => {
      try {
        const endpoint = isCsv
          ? `${BASE_URL}/api/shelter/csv/${shelterId}`
          : `${BASE_URL}/api/shelter/${shelterId}`;
        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          setShelterData(data);
        } else {
          setError("Failed to fetch shelter data");
        }
      } catch (error) {
        setError("Error fetching shelter data");
      }
    };

    fetchShelterData();
  }, [shelterId, isCsv]);

  const shareShelter = () => {
    const deepLink = `${window.location.origin}/shelter/${
      isCsv ? "csv/" : ""
    }${shelterId}`;
    if (navigator.share) {
      navigator.share({
        title: "Check out this shelter",
        text: "I found this shelter and thought you might be interested.",
        url: deepLink,
      });
    } else {
      alert(`Shareable URL: ${deepLink}`);
    }
  };

  if (error) {
    return <div className="text-red-600 text-center mt-10">Error: {error}</div>;
  }

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 mt-4 mr-4 flex items-center space-x-2">
        <span className="text-sm text-gray-600">Share</span>
        <button
          className="text-gray-600 hover:text-gray-800"
          onClick={shareShelter}
        >
          <FaShare size={18} />
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <ToastContainer />
        <div className="mb-4">
          <button
            className="flex items-center text-gray-600 hover:text-gray-800"
            onClick={() => navigate("/")}
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        </div>

        {shelterData ? (
          <div className="rounded-lg shadow-md p-8 relative">
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
              {shelterData.name}
            </h1>

            {!isCsv && shelterData.photos?.length > 0 ? (
              <div className="flex flex-wrap items-start mb-8">
                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                  <img
                    src={shelterData.photos[0]}
                    alt="Main Photo"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
                <div className="flex flex-wrap w-full md:w-1/2 md:pl-4">
                  {shelterData.photos.slice(1, 5).map((photo, index) => (
                    <div
                      key={index}
                      className="w-1/2 mb-4 p-1 transition-transform transform hover:scale-105"
                    >
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <img
                  src="https://via.placeholder.com/600x300.png?text=No+Image+Available"
                  alt="No Shelter Preview"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}

            <div className="text-gray-700 mb-6">
              <p className="mb-4">
                <span className="font-semibold">Location:</span>{" "}
                {shelterData.location || "Not specified"}
              </p>
              <p className="mb-4">
                <span className="font-semibold">Description:</span>{" "}
                {shelterData.description || "No description available."}
              </p>
            </div>

            <div className="border-t border-gray-300 pt-6">
              {shelterData.contact ? (
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Contact:</span>{" "}
                  {shelterData.contact.email}, {shelterData.contact.phone}
                </p>
              ) : (
                <>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Contact:</span>{" "}
                    {shelterData.email || "Not available"},{" "}
                    {shelterData.phone || "Not available"}
                  </p>
                </>
              )}

              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Capacity:</span>{" "}
                {shelterData.capacity || "Not specified"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Availability:</span>{" "}
                {shelterData.availability ? "Available" : "Unavailable"}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Map</h2>
              {!isCsv && shelterData.mapUrl ? (
                <iframe
                  src={shelterData.mapUrl}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  title="Shelter Map"
                ></iframe>
              ) : (
                <p className="text-gray-500 italic">
                  Map not available for this shelter.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-700">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default HomeShelter;
