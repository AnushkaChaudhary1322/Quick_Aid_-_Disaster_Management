import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/apiservice";
import { FaShare, FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeShelter = () => {
  const { shelterId } = useParams();
  const navigate = useNavigate();

  const [shelterData, setShelterData] = useState(null);
  const [error, setError] = useState(null);

  const isCsv = shelterId.startsWith("csv-");

  useEffect(() => {
    const fetchShelterData = async () => {
      try {
        const endpoint = isCsv
          ? `${BASE_URL}/api/shelter/csv/${shelterId.replace("csv-", "")}`
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
    const deepLink = `${window.location.origin}/shelters/view/${shelterId}`;
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
              {shelterData.name || "Shelter Details"}
            </h1>

            <div className="flex flex-col md:flex-row items-start mb-8 gap-6">
              <div className="md:w-1/3 w-full">
                <img
                  src={
                    !isCsv && shelterData.photos?.length > 0
                      ? shelterData.photos[0]
                      : "https://i.pinimg.com/736x/5e/38/e9/5e38e9534dd87fce952231a9f791335d.jpg"
                  }
                  alt="Shelter"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>

              <div className="md:w-2/3 w-full text-gray-700">
                <p className="mb-4">
                  <span className="font-semibold">Location:</span>{" "}
                  {isCsv
                    ? shelterData.city || "Not specified"
                    : shelterData.location || "Not specified"}
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Description:</span>{" "}
                  {isCsv
                    ? shelterData.hotel_description ||
                    "No description available."
                    : shelterData.description || "No description available."}
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Contact:</span>{" "}
                  property_name@gmail.com, 9876543210
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Capacity:</span>{" "}
                  {isCsv
                    ? shelterData.room_count
                      ? Number(shelterData.room_count) * 10
                      : "Not specified"
                    : shelterData.capacity || "Not specified"}
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Availability:</span>{" "}
                  {isCsv ? "Available" : shelterData.availability ? "Available" : "Unavailable"}
                </p>
                {isCsv && (
                  <p className="mb-4">
                    <span className="font-semibold">Address:</span>{" "}
                    {shelterData.address || "Not available"}
                  </p>
                )}
              </div>
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
