import React, { useState } from "react";
import { Label, TextInput, Button, Select } from "flowbite-react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../api/apiservice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreatePlan = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    familyMembers: [
      {
        name: "",
        age: "",
        gender: "",
        relationship: "",
        specialNeeds: "",
      },
      {
        name: "",
        age: "",
        gender: "",
        relationship: "",
        specialNeeds: "",
      },
    ],
    emergencyContacts: [
      {
        name: "",
        phone: "",
        relationship: "",
        email: "",
      },
      {
        name: "",
        phone: "",
        relationship: "",
        email: "",
      },
    ],
    medicalInformation: {
      type: "Medical Information",
      allergies: [""],
      medications: [""],
      medicalConditions: [""],
    },
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFamilyMemberChange = (index, name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      familyMembers: prevData.familyMembers.map((member, i) =>
        i === index ? { ...member, [name]: value } : member
      ),
    }));
  };

  const handleEmergencyContactChange = (index, name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      emergencyContacts: [
        ...prevData.emergencyContacts.slice(0, index),
        { ...prevData.emergencyContacts[index], [name]: value },
        ...prevData.emergencyContacts.slice(index + 1),
      ],
    }));
  };



  const handleMedicalChange = (index, field, value) => {
    setFormData((prevData) => {
      const newMedicalInformation = { ...prevData.medicalInformation };

      if (field === "type") {
        newMedicalInformation.type = value;
      } else {
        const updatedArray = [...newMedicalInformation[field]];
        updatedArray[index] = value;
        newMedicalInformation[field] = updatedArray;
      }

      return {
        ...prevData,
        medicalInformation: newMedicalInformation,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${BASE_URL}/api/plans/user/${currentUser.user._id}/emergencyplan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit form data");
      }
      console.log("Form data submitted successfully");
      toast.success("Form data submitted successfully");
      navigate("/plans");
    } catch (error) {
      console.error("Error submitting form data:", error.message);
      toast.error("Error submitting form data");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8">Create Emergency Plan</h1>
      <form onSubmit={handleSubmit}>
        {/* Family Members */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Family Members</h2>
          {formData.familyMembers.map((member, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
            >
              <div>
                <Label htmlFor={`name${index}`}>Name</Label>
                <TextInput
                  type="text"
                  id={`name${index}`}
                  name={`name${index}`}
                  value={member.name}
                  onChange={(e) =>
                    handleFamilyMemberChange(index, "name", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor={`age${index}`}>Age</Label>
                <TextInput
                  type="text"
                  id={`age${index}`}
                  name={`age${index}`}
                  value={member.age}
                  onChange={(e) =>
                    handleFamilyMemberChange(index, "age", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor={`gender${index}`}>Gender</Label>
                <Select
                  id={`gender${index}`}
                  name={`gender${index}`}
                  value={member.gender}
                  onChange={(e) =>
                    handleFamilyMemberChange(index, "gender", e.target.value)
                  }
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Contacts */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {formData.emergencyContacts.map((contact, index) => (
              <div key={index} className="mb-4">
                <Label htmlFor={`emergencyContactName${index}`}>
                  Emergency Contact Name
                </Label>
                <TextInput
                  type="text"
                  id={`emergencyContactName${index}`}
                  name={`emergencyContactName${index}`}
                  value={contact.name}
                  onChange={(e) =>
                    handleEmergencyContactChange(index, "name", e.target.value)
                  }
                />
                <Label htmlFor={`emergencyContactPhone${index}`}>Phone</Label>
                <TextInput
                  type="text"
                  id={`emergencyContactPhone${index}`}
                  name={`emergencyContactPhone${index}`}
                  value={contact.phone}
                  onChange={(e) =>
                    handleEmergencyContactChange(index, "phone", e.target.value)
                  }
                />
                <Label htmlFor={`emergencyContactRelationship${index}`}>
                  Relationship
                </Label>
                <Select
                  id={`emergencyContactRelationship${index}`}
                  name={`emergencyContactRelationship${index}`}
                  value={contact.relationship}
                  onChange={(e) =>
                    handleEmergencyContactChange(
                      index,
                      "relationship",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select Relationship</option>
                  <option value="Friend">Friend</option>
                  <option value="Family">Family</option>
                  <option value="Neighbor">Neighbor</option>
                </Select>
                <Label htmlFor={`emergencyContactEmail${index}`}>Email</Label>
                <TextInput
                  type="email"
                  id={`emergencyContactEmail${index}`}
                  name={`emergencyContactEmail${index}`}
                  value={contact.email}
                  onChange={(e) =>
                    handleEmergencyContactChange(index, "email", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Medical Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Medical Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="medicalType">Medical Type</Label>
              <TextInput
                type="text"
                id="medicalType"
                name="medicalType"
                value={formData.medicalInformation.type}
                onChange={(e) => handleMedicalChange(0, "type", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="allergies">Allergies</Label>
              <TextInput
                type="text"
                id="allergies"
                name="allergies"
                value={formData.medicalInformation.allergies[0]}
                onChange={(e) =>
                  handleMedicalChange(0, "allergies", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="medications">Medications</Label>
              <TextInput
                type="text"
                id="medications"
                name="medications"
                value={formData.medicalInformation.medications[0]}
                onChange={(e) =>
                  handleMedicalChange(0, "medications", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="medicalConditions">Medical Conditions</Label>
              <TextInput
                type="text"
                id="medicalConditions"
                name="medicalConditions"
                value={formData.medicalInformation.medicalConditions[0]}
                onChange={(e) =>
                  handleMedicalChange(0, "medicalConditions", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Notes</h2>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <TextInput
              type="text"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>

        <Button type="submit" color="success">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CreatePlan;
