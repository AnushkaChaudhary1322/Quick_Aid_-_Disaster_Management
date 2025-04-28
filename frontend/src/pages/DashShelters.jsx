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

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../api/apiservice";

const DashShelter = () => {
  const [shelters, setShelters] = useState([]);
  const [csvShelters, setCsvShelters] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [csvPage, setCsvPage] = useState(1);
  const [hasMoreCsv, setHasMoreCsv] = useState(true);
  const observer = useRef();

  // Fetch MongoDB shelters
  const fetchShelters = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/shelter/`);
      setShelters(response.data);
    } catch (error) {
      console.error("❌ Error fetching MongoDB shelters:", error);
    }
  };

  // Fetch paginated CSV shelters from /combined (filtering out MongoDB)
  const fetchCsvShelters = async (page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/shelter/combined?page=${page}&limit=10`);
      const allData = response.data?.data || [];
      const newCsvShelters = allData.filter((shelter) => !shelter._id);

      if (newCsvShelters.length === 0) {
        setHasMoreCsv(false);
      } else {
        setCsvShelters((prev) => [...prev, ...newCsvShelters]);
      }
    } catch (error) {
      console.error("❌ Error fetching CSV shelters:", error);
      setHasMoreCsv(false);
    }
  };

  // Search shelters (both MongoDB + CSV) using /combined endpoint
  const fetchSheltersByLocation = async (location) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/shelter/combined?location=${location}`);
      const allData = response.data?.data || [];

      const mongoData = allData.filter((shelter) => shelter._id);
      const csvData = allData.filter((shelter) => !shelter._id);

      setShelters(mongoData);
      setCsvShelters(csvData);
      setHasMoreCsv(false); // Disable infinite scroll while searching
    } catch (error) {
      console.error("❌ Error searching shelters:", error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchShelters();
    fetchCsvShelters(1);
  }, []);

  // Handle search
  useEffect(() => {
    if (searchLocation.trim() !== "") {
      fetchSheltersByLocation(searchLocation);
    } else {
      fetchShelters();
      setCsvShelters([]);
      setCsvPage(1);
      setHasMoreCsv(true);
      fetchCsvShelters(1);
    }
  }, [searchLocation]);

  // Infinite scroll observer
  const lastShelterRef = useCallback(
    (node) => {
      if (!hasMoreCsv) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchCsvShelters(csvPage + 1);
          setCsvPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [csvPage, hasMoreCsv]
  );

  const handleSearchChange = (e) => {
    setSearchLocation(e.target.value);
  };

  const allShelters = [
    ...shelters.map((shelter) => ({ ...shelter, source: "mongodb" })),
    ...csvShelters.map((shelter) => ({ ...shelter, source: "csv" })),
  ];

  return (
    <div className="min-h-screen flex flex-col justify-start items-center text-white">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 w-full max-w-screen-xl">
          {allShelters.map((shelter, index) => {
            const isLast = index === allShelters.length - 1 && shelter.source === "csv";
            const shelterKey = shelter._id || shelter.id || index;
            const shelterLink =
              shelter.source === "csv" && shelter.id
                ? `/shelter/csv-${shelter.id}`
                : `/shelter/${shelter._id}`;

            return (
              <div
                key={shelterKey}
                ref={isLast ? lastShelterRef : null}
                className="bg-white text-black rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <Link to={shelterLink}>
                  <img
                    src={
                      shelter.photos?.[0] ||
                      "https://i.pinimg.com/736x/1d/8e/a2/1d8ea29930228f56fb6baabf12f7ff71.jpg"
                    }
                    alt={shelter.name || "Unnamed Shelter"}
                    className="w-full h-48 object-cover"
                    onError={(e) =>
                      (e.target.src =
                        "https://i.pinimg.com/736x/35/f5/35/35f5351d4931bf8cbce805957d03c186.jpg")
                    }
                  />
                  <div className="p-4">
                    <h2 className="font-bold text-xl">{shelter.name || "Unnamed Shelter"}</h2>
                    <p className="text-sm text-gray-600">
                      {shelter.location || "Unknown location"}
                    </p>
                    <p className="mt-2 text-xs italic text-gray-500">
                      Source: {shelter.source === "csv" ? "CSV File" : "MongoDB"}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashShelter;
