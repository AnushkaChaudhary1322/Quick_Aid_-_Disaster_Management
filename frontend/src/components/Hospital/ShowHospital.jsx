import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/apiservice";
import { FaTrash, FaShare, FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

const ShowHospital = () => {
const { hospitalId } = useParams();
const [hospitalData, setHospitalData] = useState(null);
const [error, setError] = useState(null);
const { currentUser } = useSelector((state) => state.user);
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

const handleDelete = async () => {
if (window.confirm("Are you sure you want to delete this hospital?")) {
    try {
    const res = await fetch(`${BASE_URL}/api/hospital/${hospitalId}`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (res.ok) {
        toast.success("Hospital deleted successfully!");
        navigate("/hospital");
    } else {
        toast.error("Failed to delete hospital");
    }
    } catch (error) {
    toast.error("Error deleting hospital");
    }
}
};

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

return (
<div className="container mx-auto px-4 py-8">
    <ToastContainer />
    <button className="text-gray-600 hover:text-gray-800 mb-4 flex items-center" onClick={() => navigate(-1)}>
    <FaArrowLeft size={18} className="mr-2" /> Back
    </button>
    {hospitalData ? (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-center">{hospitalData.name}</h1>

        {/* Images */}
        <div className="flex flex-wrap items-start mb-8">
  <div className="w-full md:w-1/2 mb-4 md:mb-0">
    <img
      src={hospitalData.photos[0]}
      alt="Main Photo"
      className="w-full h-auto rounded-lg shadow-lg"
    />
  </div>
  <div className="flex flex-wrap w-full md:w-1/2 md:pl-4">
    {hospitalData.photos.slice(1, 5).map((photo, index) => (
      <div key={index} className="w-1/2 mb-4 p-1 transition-transform transform hover:scale-105">
        <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-auto rounded-lg shadow-lg" />
      </div>
    ))}
  </div>
        </div>


        {/* Hospital Details */}
        <div className="text-gray-700">
            <p className="mb-4 text-499663">
                <span className="font-semibold">City:</span> {hospitalData.location}
            </p>
            <p className="mb-4 text-499663">
                <span className="font-semibold">Capacity:</span> {hospitalData.capacity}
            </p>
            <p className="mb-4 text-499663">
                <span className="font-semibold">Number of Beds:</span>{" "}
                {hospitalData.beds}
            </p>
            <p className="mb-4 text-499663">
                <span className="font-semibold">Specialties:</span>{" "}
                {hospitalData.specialties.join(", ")}
            </p>
            <p className="mb-4 text-499663">
                <span className="font-semibold">Emergency Services:</span>{" "}
                {hospitalData.emergency_services
                ? "Available"
                : "Not Available"}
            </p>
            <p className="mb-4 text-499663">
                <span className="font-semibold">Email:</span>{" "}
                {hospitalData.email}
            </p>
            <p className="mb-4 text-499663">
                <span className="font-semibold">Contact Number:</span>{" "}
                {hospitalData.phone}
            </p>
            </div>

        {/* Map */}
        <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Map</h3>
            <iframe
            src={shelterData.mapUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            title="Hospital Location"
            ></iframe>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-4">
        <button onClick={shareHospital} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <FaShare className="inline-block mr-2" /> Share
        </button>
        {currentUser?.user?.role === "admin" && (
            <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
            <FaTrash className="inline-block mr-2" /> Delete
            </button>
        )}
        </div>
    </div>
    ) : error ? (
    <p className="text-red-500">{error}</p>
    ) : (
    <p>Loading...</p>
    )}
</div>
);
};

export default ShowHospital;
