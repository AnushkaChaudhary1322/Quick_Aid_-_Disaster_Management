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
        navigate("/hospitals");
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
    navigator.share({ title: "Check out this hospital", text: "I found this hospital and thought you might be interested.", url: deepLink });
} else {
    alert(`Shareable URL: ${deepLink}`);
}
};

return (
<div className="container mx-auto px-4 py-8">
    <ToastContainer />
    <button className="text-gray-600 hover:text-gray-800 mb-4" onClick={() => navigate(-1)}>
    <FaArrowLeft size={18} /> Back
    </button>
    {hospitalData ? (
    <div className="bg-gray-100 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-6 text-center">{hospitalData.name}</h1>
        <p><strong>Area:</strong> {hospitalData.area}</p>
        <p><strong>City:</strong> {hospitalData.city}</p>
        <p><strong>Address:</strong> {hospitalData.address}</p>
        <p><strong>Specialties:</strong> {hospitalData.specialties.join(", ")}</p>
        <button onClick={shareHospital}><FaShare /></button>
        {currentUser?.user?.role === "admin" && <button onClick={handleDelete}><FaTrash color="red" /></button>}
    </div>
    ) : <p>Loading...</p>}
</div>
);
};

export default ShowHospital;
