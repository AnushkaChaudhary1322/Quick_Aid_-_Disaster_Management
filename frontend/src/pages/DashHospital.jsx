import React, { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import { TextInput, Card, Button } from "flowbite-react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../api/apiservice";
import { Link } from "react-router-dom";

const DashHospital = () => {
const { currentUser } = useSelector((state) => state.user);
const [hospitals, setHospitals] = useState([]);
const [searchLocation, setSearchLocation] = useState("");

useEffect(() => {
fetchHospitals();
}, []);

const fetchHospitals = async () => {
try {
    const res = await fetch(`${BASE_URL}/api/hospital/`);
    if (res.ok) {
    const data = await res.json();
    setHospitals(data);
    } else {
    console.error("Failed to fetch hospitals:", res.statusText);
    }
} catch (error) {
    console.error("Error fetching hospitals:", error.message);
}
};

useEffect(() => {
if (searchLocation.trim() !== "") {
    fetchHospitalsByLocation(searchLocation);
} else {
    fetchHospitals();
}
}, [searchLocation]);

const fetchHospitalsByLocation = async (location) => {
try {
    const res = await fetch(`${BASE_URL}/api/hospital/location/${location}`);
    if (res.ok) {
    const data = await res.json();
    setHospitals(data);
    } else {
    console.error("Failed to fetch hospitals by location:", res.statusText);
    }
} catch (error) {
    console.error("Error fetching hospitals by location:", error.message);
}
};

const handleSearch = () => {
fetchHospitalsByLocation(searchLocation);
};

return (
<div className="flex flex-col justify-center items-center">
    <h1 className="text-3xl font-extrabold text-gray-900 mt-8">Hospitals</h1>
    <p className="italic text-lg text-gray-700 mb-8">
    "In times of need, hospitals serve as the heart of healing."
    </p>
    <div className="flex items-center">
    <div className="relative w-full max-w-lg">
        <TextInput
        className="w-full pl-10"
        type="text"
        placeholder="Search Hospitals..."
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
        <MdSearch className="text-gray-400" onClick={handleSearch} />
        </div>
    </div>
    {currentUser.user.role === "admin" && (
        <Link to="/add-hospital">
        <Button className="ml-2"> Add</Button>
        </Link>
    )}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 ml-4">
    {hospitals.map((hospital) => (
        <div className="max-w-xs" key={hospital._id}>
        <Link to={`/hospital/${hospital._id}`}>
            <Card className="h-full">
            <img
                src={hospital.photos[0]}
                alt="Main Photo"
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h5 className="text-xl font-bold tracking-tight text-gray-900">
                {hospital.name}
                </h5>
                <p className="text-sm text-gray-600">{hospital.location}</p>
            </div>
            </Card>
        </Link>
        </div>
    ))}
    </div>
</div>
);
};

export default DashHospital;
