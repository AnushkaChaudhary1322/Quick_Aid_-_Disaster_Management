// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { BASE_URL } from "../../api/apiservice";
// import { FaEdit, FaTrash, FaShare } from "react-icons/fa";
// import { useSelector } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaArrowLeft } from "react-icons/fa";

// const ShowShelter = () => {
//   const { shelterId } = useParams();
//   const [shelterData, setShelterData] = useState(null);
//   const [error, setError] = useState(null);
//   const { currentUser } = useSelector((state) => state.user);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchShelterData = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/api/shelter/${shelterId}`);
//         if (res.ok) {
//           const data = await res.json();
//           setShelterData(data);
//         } else {
//           setError("Failed to fetch shelter data");
//         }
//       } catch (error) {
//         setError("Error fetching shelter data");
//       }
//     };

//     fetchShelterData();
//   }, [shelterId]);

//   const handleDelete = async () => {
//     if (window.confirm("Are you sure you want to delete this shelter?")) {
//       try {
//         const res = await fetch(`${BASE_URL}/api/shelter/${shelterId}`, {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         if (res.ok) {
//           toast.success("Shelter deleted successfully!");
//           navigate("/shelters");
//         } else {
//           toast.error("Failed to delete shelter");
//         }
//       } catch (error) {
//         toast.error("Error deleting shelter");
//       }
//     }
//   };

//   const shareShelter = () => {
//     const deepLink = `${window.location.origin}/shelter/${shelterId}`;
//     if (navigator.share) {
//       navigator.share({
//         title: "Check out this shelter",
//         text: "I found this shelter and thought you might be interested.",
//         url: deepLink,
//       });
//     } else {
//       alert(`Shareable URL: ${deepLink}`);
//     }
//   };

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <ToastContainer />
//       <div className="mb-4">
//         <button
//           className="flex items-center text-gray-600 hover:text-gray-800"
//           onClick={() => window.history.back()}
//         >
//           <FaArrowLeft className="mr-2" /> Back
//         </button>
//       </div>
//       {shelterData ? (
//         <div className="bg-gray-100 rounded-lg shadow-md p-8 relative">
//           {currentUser.user.role === "admin" && (
//             <div className="absolute top-0 right-0 flex items-center space-x-4">
//               <button
//                 className="text-gray-600 hover:text-gray-800"
//                 onClick={handleDelete}
//               >
//                 <FaTrash size={"1.5em"} color="red" />
//               </button>
//             </div>
//           )}
//           <div className="absolute top-0 right-0 mt-2 mr-2 flex items-center space-x-4">
//             <button
//               className="text-gray-600 hover:text-gray-800 mt-10"
//               onClick={shareShelter}
//             >
//               <FaShare size={"1.5em"} />
//             </button>
//           </div>

//           <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
//             {shelterData.name}
//           </h1>

//           <div className="flex flex-wrap items-start mb-8">
//             <div className="w-full md:w-1/2 mb-4 md:mb-0">
//               <img
//                 src={shelterData.photos[0]}
//                 alt="Main Photo"
//                 className="w-full h-auto rounded-lg shadow-lg"
//               />
//             </div>
//             <div className="flex flex-wrap w-full md:w-1/2 md:pl-4">
//               {shelterData.photos.slice(1, 5).map((photo, index) => (
//                 <div
//                   key={index}
//                   className="w-1/2 mb-4 p-1 transition-transform transform hover:scale-105"
//                 >
//                   <img
//                     src={photo}
//                     alt={`Photo ${index + 1}`}
//                     className="w-full h-auto rounded-lg shadow-lg"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="text-gray-700 mb-6">
//             <p className="mb-4">
//               <span className="font-semibold">Location:</span>{" "}
//               {shelterData.location}
//             </p>
//             <p className="mb-4">
//               <span className="font-semibold">Description:</span>{" "}
//               {shelterData.description}
//             </p>
//           </div>

//           <div className="border-t border-gray-300 pt-6">
//             <p className="text-gray-700 mb-2">
//               <span className="font-semibold">Contact:</span>{" "}
//               {shelterData.contact.email}, {shelterData.contact.phone}
//             </p>
//             <p className="text-gray-700 mb-2">
//               <span className="font-semibold">Capacity:</span>{" "}
//               {shelterData.capacity}
//             </p>
//             <p className="text-red-700">
//               <span className="font-semibold">Availability:</span>{" "}
//               {shelterData.availability ? "Available" : "Unavailable"}
//             </p>
//           </div>

//           <div className="mt-8">
//             <h2 className="text-xl font-semibold mb-2">Map</h2>
//             <iframe
//               src={shelterData.mapUrl}
//               width="100%"
//               height="450"
//               style={{ border: 0 }}
//               allowFullScreen
//               title="Shelter Map"
//             ></iframe>
//           </div>
//         </div>
//       ) : (
//         <p className="text-center text-gray-700">Loading...</p>
//       )}
//     </div>
//   );
// };

// export default ShowShelter;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/apiservice";
import { FaMapMarkerAlt } from "react-icons/fa";

const ShowShelter = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/shelter`);
        const data = await response.json();
        setShelters(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shelters:", error);
        setLoading(false);
      }
    };

    fetchShelters();
  }, []);

  const handleViewShelter = (shelterId, isCsv) => {
    if (isCsv) {
      navigate(`/shelter/csv/${shelterId}`);
    } else {
      navigate(`/shelter/${shelterId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Available Shelters
      </h1>
      {loading ? (
        <p className="text-center text-gray-700">Loading shelters...</p>
      ) : shelters.length === 0 ? (
        <p className="text-center text-gray-700">No shelters found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shelters.map((shelter) => (
            <div
              key={shelter._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={
                  shelter.isCsv
                    ? "https://via.placeholder.com/400x200.png?text=Shelter"
                    : shelter.photos?.[0] ||
                      "https://via.placeholder.com/400x200.png?text=Shelter"
                }
                alt="Shelter"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {shelter.name}
                </h2>
                <p className="text-gray-600 mb-2">
                  <FaMapMarkerAlt className="inline-block mr-1" />
                  {shelter.location}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Capacity:</span>{" "}
                  {shelter.capacity}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">Availability:</span>{" "}
                  {shelter.availability ? "Available" : "Unavailable"}
                </p>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                  onClick={() =>
                    handleViewShelter(shelter._id || shelter.id, shelter.isCsv)
                  }
                >
                  View Shelter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowShelter;
