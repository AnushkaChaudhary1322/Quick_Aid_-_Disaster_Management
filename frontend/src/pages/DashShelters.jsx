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
      const newCsvShelters = allData.filter((shelter) => !shelter._id && shelter.accessId); // ✅ Ensure accessId exists

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

  // Search shelters by location (both MongoDB + CSV)
  const fetchSheltersByLocation = async (location) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/shelter/combined?location=${location}`);
      const allData = response.data?.data || [];

      const mongoData = allData.filter((shelter) => shelter._id);
      const csvData = allData.filter((shelter) => !shelter._id && shelter.accessId); // ✅ Only valid CSV shelters

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

  // Handle search input
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

  // Merge MongoDB and CSV shelters
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
        <p className="text-lg mt-10">No shelters found...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 w-full max-w-screen-xl">
          {allShelters.map((shelter, index) => {
            if (shelter.source === "csv" && !shelter.accessId) return null; 

            const isLast = index === allShelters.length - 1 && shelter.source === "csv";
            const shelterKey = shelter._id || shelter.accessId || index;
            const shelterLink =
              shelter.source === "csv"
                ? `/shelter/csv-${shelter.accessId}`
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
                      "https://i.pinimg.com/736x/5e/38/e9/5e38e9534dd87fce952231a9f791335d.jpg"
                    }
                    alt={shelter.name || "Unnamed Shelter"}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://i.pinimg.com/736x/5e/38/e9/5e38e9534dd87fce952231a9f791335d.jpg";
                    }}
                  />
                  <div className="p-4">
                    <h2 className="font-bold text-xl">
                      {shelter.name || "Unnamed Shelter"}
                    </h2>
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
