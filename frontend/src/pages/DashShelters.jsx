// import React, { useState, useEffect } from "react";
// import { MdSearch } from "react-icons/md";
// import { TextInput, Card, Button } from "flowbite-react";
// import { useSelector } from "react-redux";
// import { BASE_URL } from "../api/apiservice";
// import { Link } from "react-router-dom";

// const DashShelters = () => {
//   const { currentUser } = useSelector((state) => state.user);
//   const [shelters, setShelters] = useState([]);
//   const [searchLocation, setSearchLocation] = useState("");

//   useEffect(() => {
//     fetchShelters();
//   }, []);

//   const fetchShelters = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/shelter/`);
//       if (res.ok) {
//         const data = await res.json();
//         setShelters(data);
//       } else {
//         console.error("Failed to fetch shelters:", res.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching shelters:", error.message);
//     }
//   };

//   useEffect(() => {
//     if (searchLocation.trim() !== "") {
//       fetchSheltersByLocation(searchLocation);
//     } else {
//       fetchShelters();
//     }
//   }, [searchLocation]);

//   const fetchSheltersByLocation = async (location) => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/shelter/location/${location}`);
//       if (res.ok) {
//         const data = await res.json();
//         setShelters(data);
//       } else {
//         console.error("Failed to fetch shelters by location:", res.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching shelters by location:", error.message);
//     }
//   };

//   const handleSearch = () => {
//     fetchSheltersByLocation(searchLocation);
//   };

//   return (
//     <div className="flex flex-col justify-center items-center">
//       <h1 className="text-3xl font-extrabold text-gray-900 mt-8">Shelters</h1>
//       <p className="italic text-lg text-gray-700 mb-8">
//         "In the face of disaster, recovery begins with shelter and hope."
//       </p>
//       <div className="flex items-center">
//         <div className="relative w-full max-w-lg">
//           <TextInput
//             className="w-full pl-10"
//             type="text"
//             placeholder="Search Shelters..."
//             value={searchLocation}
//             onChange={(e) => setSearchLocation(e.target.value)}
//           />
//           <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
//             <MdSearch className="text-gray-400" onClick={handleSearch} />
//           </div>
//         </div>
//         {currentUser.user.role === "admin" && (
//           <Link to="/shelter">
//             <Button className="ml-2"> Add</Button>
//           </Link>
//         )}
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 ml-4">
//         {shelters.map((shelter) => (
//           <div className="max-w-xs" key={shelter._id}>
//             <Link to={`/shelter/${shelter._id}`}>
//               <Card className="h-full">
//                 <img
//                   src={shelter.photos[0]}
//                   alt={shelter.name}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-4">
//                   <h5 className="text-xl font-bold tracking-tight text-gray-900">
//                     {shelter.name}
//                   </h5>
//                   <p className="text-sm text-gray-600">{shelter.location}</p>
//                 </div>
//               </Card>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DashShelters;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BASE_URL } from "../config";

const DashShelter = () => {
  const [shelters, setShelters] = useState([]);
  const [csvShelters, setCsvShelters] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");

  // Fetch MongoDB shelters
  const fetchShelters = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/shelter/`);
      console.log("✅ MongoDB shelters fetched:", response.data);
      setShelters(response.data);
    } catch (error) {
      console.error("❌ Error fetching MongoDB shelters:", error);
    }
  };

  // Fetch CSV shelters
  const fetchCsvShelters = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/shelter/csv`);
      console.log("✅ CSV shelters fetched:", response.data);
      setCsvShelters(response.data);
    } catch (error) {
      console.error("❌ Error fetching CSV shelters:", error);
    }
  };

  // Fetch by search location
  const fetchSheltersByLocation = async (location) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/shelter/search/${location}`);
      console.log("🔍 Searched shelters:", response.data);
      setShelters(response.data);
      setCsvShelters([]); // Optional: hide CSV shelters when searching
    } catch (error) {
      console.error("❌ Error searching shelters:", error);
    }
  };

  useEffect(() => {
    fetchShelters();
    fetchCsvShelters();
  }, []);

  useEffect(() => {
    if (searchLocation.trim() !== "") {
      fetchSheltersByLocation(searchLocation);
    } else {
      fetchShelters();
      fetchCsvShelters();
    }
  }, [searchLocation]);

  const handleSearchChange = (e) => {
    setSearchLocation(e.target.value);
  };

  const allShelters = [
    ...shelters.map((shelter) => ({ ...shelter, source: "mongodb" })),
    ...csvShelters.map((shelter) => ({ ...shelter, source: "csv" })),
  ];

  console.log("📦 Combined shelters:", allShelters);

  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-red-900 text-white">
      <Navbar />

      <div className="mt-6 w-full max-w-xl px-4">
        <input
          type="text"
          value={searchLocation}
          onChange={handleSearchChange}
          placeholder="Search shelters by location..."
          className="w-full p-3 rounded-lg shadow text-black"
        />
      </div>

      {allShelters.length === 0 ? (
        <p className="text-lg mt-10">🔍 No shelters found...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {allShelters.map((shelter, index) => (
            <div
              key={`${shelter._id || shelter.id || index}`}
              className="bg-white text-black rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <Link
                to={`/shelter/${shelter.source === "csv" ? `csv/${shelter.id}` : shelter._id}`}
              >
                <img
                  src={shelter.photos?.[0] || "https://via.placeholder.com/400x250.png?text=No+Image"}
                  alt={shelter.name || "Unnamed Shelter"}
                  className="w-full h-48 object-cover"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/400x250.png?text=No+Image")}
                />
                <div className="p-4">
                  <h2 className="font-bold text-xl">{shelter.name || "Unnamed Shelter"}</h2>
                  <p className="text-sm text-gray-600">{shelter.location || "Unknown location"}</p>
                  <p className="mt-2 text-xs italic text-gray-500">
                    Source: {shelter.source === "csv" ? "CSV File" : "MongoDB"}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashShelter;
