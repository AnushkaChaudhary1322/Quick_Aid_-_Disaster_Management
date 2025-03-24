import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput, Button } from "flowbite-react";
import { BASE_URL } from "../../api/apiservice";
import { FaArrowLeft, FaCloudUploadAlt } from "react-icons/fa";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase";

const AddHospital = () => {
const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",  
    beds: "",
    specialties: "",
    availability: true,
    contact: {
        email: "",
        phone: "",
    },
    emergency_services: false,
    photos: [],
    mapUrl: "",
});

const [uploading, setUploading] = useState(false);
const [error, setError] = useState(null);
const navigate = useNavigate();

const handleChange = (e) => {
const { name, value, type, checked } = e.target;
if (name.startsWith("contact.")) {
    setFormData({
    ...formData,
    contact: {
        ...formData.contact,
        [name.split(".")[1]]: value,
    },
    });
} else {
    setFormData({
    ...formData,
    [name]: type === "checkbox" ? checked : value,
    });
}
};

// const handleFileUpload = async (file) => {
// setUploading(true);
// const storage = getStorage(app);
// const fileName = new Date().getTime() + "-" + file.name;
// const storageRef = ref(storage, fileName);
// const uploadTask = uploadBytesResumable(storageRef, file);

// uploadTask.on(
//     "state_changed",
//     null,
//     (error) => {
//     console.error("Error uploading file:", error.message);
//     setError("Failed to upload image.");
//     setUploading(false);
//     },
//     () => {
//     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//         setFormData((prev) => ({
//         ...prev,
//         photos: [...prev.photos, downloadURL],  
//         }));
//         setUploading(false);
//     });
//     }
// );
// };

const handleFileUpload = async (file) => {
    if (!file) return;
    
    setUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        null,
        (error) => {
            console.error("Error uploading file:", error.message);
            setError("Failed to upload image.");
            setUploading(false);
        },
        async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setFormData((prev) => ({
                ...prev,
                photos: [...prev.photos, downloadURL], // Correctly updating the photos array
            }));
            setUploading(false);
        }
    );
};


// const handleSubmit = async (e) => {
// e.preventDefault();
// setError(null);
// try {
//     const res = await fetch(`${BASE_URL}/api/hospital/`, {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//     body: JSON.stringify({
//         ...formData,
//         specialties: formData.specialties.split(",").map((s) => s.trim()),
//     }),
//     });

//     if (res.ok) {
//     navigate("/dashboard?tab=hospitals");
//     } else {
//     throw new Error("Failed to add hospital.");
//     }
// } catch (error) {
//     console.error("Error adding hospital:", error.message);
//     setError(error.message);
// }
// };

const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
        const response = await fetch(`${BASE_URL}/api/hospital/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Keep authentication
            },
            body: JSON.stringify({
                ...formData,
                specialties: formData.specialties.split(",").map((s) => s.trim()), // Keep correct formatting
                photos: formData.photos.filter(photo => photo), // Ensure valid URLs are sent
            }),
        });

        const data = await response.json();
        if (response.ok) {
            navigate("/hospital");
        } else {
            throw new Error(data.message || "Failed to add hospital.");
        }
    } catch (error) {
        console.error("Error adding hospital:", error.message);
        setError(error.message);
    }
};


return (
<div>
    {/* Back Button */}
    <Button color="primary" className="flex items-center mb-4" onClick={() => window.history.back()}>
    <FaArrowLeft className="mr-2" /> Back
    </Button>

    {/* Hospital Form */}
    <div className="flex flex-col items-center justify-center h-full">
    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
        Add Hospital
        </h2>

        {/* Upload Photo */}
        <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">
            Upload Hospital Photos:
        </label>
        <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500">
            <FaCloudUploadAlt className="text-gray-500 text-4xl" />
            <span className="text-sm text-gray-500">{uploading ? "Uploading..." : "Click to upload"}</span>
            <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                required
            />
            </label>
        </div>
        {formData.photos.length > 0 && (
            <div className="mt-2">
                <p className="text-gray-600 text-sm">Uploaded Images:</p>
                <div className="flex flex-wrap gap-2">
                    {formData.photos.map((photo, index) => (
                        <img
                            key={index}
                            src={photo}
                            alt={`Uploaded ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-md"
                        />
                    ))}
                </div>
            </div>
        )}
        </div>

        {/* Hospital Details */}
        <TextInput name="name" placeholder="Hospital Name" value={formData.name} onChange={handleChange} required className="mb-4" />

        <TextInput name="location" placeholder="Location" value={formData.location} onChange={handleChange} required className="mb-4" />

        <TextInput name="capacity" type="number" placeholder="Capacity" value={formData.capacity} onChange={handleChange} required className="mb-4" />

        <TextInput name="beds" type="number" placeholder="Number of Beds" value={formData.beds} onChange={handleChange} required className="mb-4" />

        <TextInput name="mapUrl" type="text" placeholder="Map URL (Google Maps iframe)" value={formData.mapUrl} onChange={handleChange} required className="mb-4" />

        <TextInput name="specialties" placeholder="Specialties (comma-separated)" value={formData.specialties} onChange={handleChange} required className="mb-4" />

        <TextInput name="contact.email" type="email" placeholder="Contact Email" value={formData.contact.email} onChange={handleChange} required className="mb-4" />

        <TextInput name="contact.phone" type="tel" placeholder="Contact Phone" value={formData.contact.phone} onChange={handleChange} required className="mb-4" />

        {/* Emergency Services Checkbox */}
        <div className="mb-4">
        <label className="flex items-center text-gray-700 font-semibold">
            <input type="checkbox" name="emergency_services" checked={formData.emergency_services} onChange={handleChange} className="mr-2" />
            Emergency Services Available
        </label>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2">
        Add Hospital
        </Button>
    </form>
    </div>
</div>
);
};

export default AddHospital;
