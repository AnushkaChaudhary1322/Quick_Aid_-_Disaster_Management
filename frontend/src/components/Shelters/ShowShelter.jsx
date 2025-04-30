import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../api/apiservice";
import { FaMapMarkerAlt } from "react-icons/fa";

const ShowShelter = () => {
  const { shelterId } = useParams();
  const [shelter, setShelter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelterDetails = async () => {
      try {
        const isCsv = shelterId.startsWith("csv-");
        const cleanId = isCsv ? shelterId.replace("csv-", "") : shelterId;

        const endpoint = isCsv
          ? `${BASE_URL}/api/shelter/csv/${cleanId}`
          : `${BASE_URL}/api/shelter/${cleanId}`;

        const res = await fetch(endpoint);
        const data = await res.json();
        setShelter({ ...data, isCsv });
      } catch (error) {
        console.error("❌ Error fetching shelter details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShelterDetails();
  }, [shelterId]);

  if (loading) {
    return <p className="text-center text-gray-700 mt-8">Loading shelter details...</p>;
  }

  if (!shelter) {
    return <p className="text-center text-red-600 mt-8">Shelter not found.</p>;
  }

  const fallbackImage = "https://i.pinimg.com/736x/5e/38/e9/5e38e9534dd87fce952231a9f791335d.jpg";
  const imageUrl = shelter.isCsv
    ? fallbackImage
    : shelter.photos?.[0] || fallbackImage;

  const capacity = shelter.capacity ?? "N/A";
  const availability = shelter.availability === true
    ? "Available"
    : shelter.availability === false
    ? "Unavailable"
    : "N/A";

  const contact = typeof shelter.contact === "string"
    ? shelter.contact
    : shelter.contact?.email || "N/A";

  const description = shelter.description || "No description provided.";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt="Shelter"
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            {shelter.name || "Unnamed Shelter"}
          </h1>
          <p className="text-gray-700 mb-2">
            <FaMapMarkerAlt className="inline-block mr-2 text-blue-500" />
            {shelter.location || "Unknown location"}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Capacity:</span> {capacity}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Availability:</span> {availability}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Contact:</span> {contact}
          </p>
          <p className="text-gray-700 mt-4">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowShelter;
