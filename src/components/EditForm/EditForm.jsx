import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./form_Style.css";
import API_BASE_URL from "../../../apiConfig";
import Loading from "../loading/Loading";

import "./EditForm.css";

const EditForm = ({
  onClose,
  onback,
  onAddIdol,
  station,
  setStation,
  idolData,
}) => {
  // const previdolid = stationidol[-1].idol_id;
  const stationId = station.stationId;
  const [formType, setFormType] = useState(0);
  const [propertyType, setPropertyType] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messagecolor, setMessagecolor] = useState("");
  const [isOthers, setIsOthers] = useState(false);
  const [junctions, setJunctions] = useState([{ place: "", coords: "" }]);
  const [formData, setFormData] = useState({});
  const [hamletVillages, setHamletVillages] = useState([]);
  const organizationOptions = station.defaultOrganization;
  // const idolData = station.stationIdol.find((e) => e.idol_id === idolId);
  const stationDetails = station.motherVillage;
  const startPoints = station.defaultStartPoints.map((e) => e.place);
  const JunctionPoints = station.defaultJunctionPoints.map((e) => e);
  const IntermediateJunctionPoints = idolData.intermediateJunctionPoints.map(
    (e) => e
  );

  useEffect(() => {
    if (idolData) {
      const formatDate = (mongoDate) =>
        mongoDate ? new Date(mongoDate).toISOString().split("T")[0] : "";

      setFormData({
        ...idolData,
        setupDate: formatDate(idolData.setupDate),
        immersionDate: formatDate(idolData.immersionDate),
      });

      const motherVillageName = idolData.motherVillage; // This should be a string
      if (motherVillageName && stationDetails[motherVillageName]) {
        const selectedVillages = stationDetails[motherVillageName].map(
          (e) => e.place
        );
        setHamletVillages(selectedVillages);
      }
      if (IntermediateJunctionPoints) {
        setJunctions(IntermediateJunctionPoints);
      }
    }
  }, [idolData, stationDetails]);
  console.log(formData);

  const endPoints = station.defaultEndPoints.map((e) => e.place);

  const motherVillages = Object.keys(stationDetails);

  const handleChange = (e) => {
    const { name, value, type, files, id } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "number" ? parseInt(value, 10) : value,
    }));

    if (id === "motherVillage") {
      const selectedHamletVillages = stationDetails[value];
      if (Array.isArray(selectedHamletVillages)) {
        setHamletVillages(
          selectedHamletVillages.map((village) => village.place)
        );
      } else {
        console.error("Expected an array but got:", selectedHamletVillages);
      }
    }
    if (name === "placeOfInstallation" && value === "others") {
      setIsOthers(true);
    } else if (id === "idolLocation") {
      setIsOthers(false);
    }
    if (id === "hamletVillage") {
      const selectedHamlet = stationDetails[formData.motherVillage].find(
        (village) => village.place === value
      );
      if (selectedHamlet) {
        setFormData((prevState) => ({
          ...prevState,
          hamletCoords: selectedHamlet.coords,
        }));
      }
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    let requiredFields = [];
    formData.typeOfInstaller === "private"
      ? (requiredFields = ["motherVillage", "licence", "typeOfInstaller"])
      : (requiredFields = [
          "motherVillage",
          "placeOfInstallation",
          "licence",
          "typeOfInstaller",
        ]);
    const isFormValid = requiredFields.every((field) => formData[field]);

    if (!isFormValid) {
      alert("Please fill out all required fields.");
      return;
    }

    if (formData.typeOfInstaller === "private") {
      if (formData.hamletVillage) {
        setFormData((prevState) => ({
          ...prevState,
          placeOfInstallation: formData.hamletVillage,
        }));
      }
    }

    setFormType((prevFormType) => prevFormType + 1);
  };

  const handleNext1 = (e) => {
    e.preventDefault();

    const requiredFields = [
      "permission.police",
      "permission.fireService",
      "permission.TNEB",
      "facility.electricalEquipment",
      "facility.lightingFacility",
      "facility.CCTVFacility",
      "property.type",
    ];

    const isFormValid = requiredFields.every((field) => {
      const fieldParts = field.split(".");
      let currentValue = formData;

      for (const part of fieldParts) {
        if (currentValue.hasOwnProperty(part)) {
          currentValue = currentValue[part];
        } else {
          return false;
        }
      }

      // Adjust validation for `property.type`
      if (field === "property.type") {
        return currentValue !== ""; // Ensure it's not an empty string
      }

      return currentValue === true || currentValue === false;
    });

    console.log(isFormValid);

    if (!isFormValid) {
      alert("Please fill out all required fields.");
      return;
    }

    if (formData.typeOfInstaller === "private") {
      if (formData.hamletVillage) {
        setFormData((prevState) => ({
          ...prevState,
          placeOfInstallation: formData.hamletVillage,
        }));
      }
    }

    setFormType((prevFormType) => prevFormType + 1);
  };
  const handlePrev = (e) => {
    e.preventDefault();
    setFormType((prevFormType) => prevFormType - 1);
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleJunctionChange = (index, e) => {
    const selectedOption = IntermediateJunctionPoints.find(
      (option) => option.place === e.target.value
    );
    setJunctions((prevJunctions) =>
      prevJunctions.map((junction, i) =>
        i === index ? selectedOption : junction
      )
    );
  };

  const handleAddJunction = (e) => {
    e.preventDefault();
    setJunctions([...junctions, { place: "", coords: "" }]);
  };

  const handleRemoveJunction = (index) => {
    const updatedJunctions = junctions.filter((_, i) => i !== index);
    setJunctions(updatedJunctions);
  };

  const handleChange1 = (e) => {
    const { name, value, type, id } = e.target;

    setFormData((prevState) => {
      if (type === "radio") {
        const [section, key] = name.split(".");
        return {
          ...prevState,
          [section]: {
            ...prevState[section],
            [key]: value === "yes",
          },
        };
      } else if (id === "propertyDescription") {
        return {
          ...prevState,
          property: {
            ...prevState.property,
            description: value,
          },
        };
      } else if (id === "propertyTypeSelect") {
        setPropertyType(value);
        return {
          ...prevState,
          property: {
            ...prevState.property,
            type: value,
          },
        };
      } else if (id === "commonoption") {
        return {
          ...prevState,
          shed: {
            ...prevState.shed,
            type: value,
          },
        };
      } else if (id === "shedDescription") {
        return {
          ...prevState,
          shed: {
            ...prevState.shed,
            description: value,
          },
        };
      } else {
        return { ...prevState, [name]: value };
      }
    });
  };

  const handleChange2 = (e) => {
    const { name, value, type, id } = e.target;

    if (
      type === "radio" &&
      (id === "individual" ||
        id === "group" ||
        id === "RTOYes" ||
        id === "RTONo")
    ) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else if (id === "transport") {
      const [section, key] = name.split(".");
      setFormData((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [key]: value,
        },
      }));
    } else if (type === "radio") {
      const [section, key] = name.split(".");
      setFormData((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [key]: value === "yes",
        },
      }));
    } else if (id === "DefaultJunctionPoint") {
      const selectedJunction = JunctionPoints.find(
        (junction) => junction.place === value
      );

      if (selectedJunction) {
        setFormData((prevState) => ({
          ...prevState,
          startJunctionPoint: {
            place: selectedJunction.place,
            coords: selectedJunction.coords,
          },
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleVolunteerChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const newVolunteers = [...prevState.volunteers];
      newVolunteers[index] = { ...newVolunteers[index], [name]: value };
      return { ...prevState, volunteers: newVolunteers };
    });
  };

  const handleAddVolunteer = (e) => {
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      volunteers: [
        ...prevState.volunteers,
        { name: "", mobileNo: "", address: "" },
      ],
    }));
  };

  const handleRemoveVolunteer = (e) => {
    e.preventDefault();
    if (formData.volunteers.length > 6) {
      setFormData((prevState) => ({
        ...prevState,
        volunteers: prevState.volunteers.slice(0, -1),
      }));
    } else {
      return;
    }
  };

  const [updatedFormData, setUpdatedFormData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowLoading(true);
    setMessage("");
    setMessagecolor("");

    const requiredFields = [
      "modeOfTransport.vehicleType",
      "modeOfTransport.vehicleDescription",
      "processionBy",
      "immersionSafety.barricade",
      "immersionSafety.lighting",
      "immersionSafety.safetyByFireService",
      "immersionSafety.PASystem",
      "RTOpermission",
      "sensitivity",
      "immersionDate",
    ];

    const missingFields = requiredFields.filter((field) => {
      const parts = field.split(".");
      let currentValue = formData;

      for (const part of parts) {
        if (currentValue[part] === undefined) return true;
        currentValue = currentValue[part];
      }

      return currentValue === "" || currentValue === undefined;
    });
    console.log(missingFields);

    if (missingFields.length > 0) {
      alert(`${missingFields} is not filled`);
      setShowLoading(false);
      return;
    }

    if (formData.typeOfInstaller === "private" && formData.hamletVillage) {
      setFormData((prevState) => ({
        ...prevState,
        placeOfInstallation: formData.hamletVillage,
      }));
    }

    let selectedStart = formData.typeOfInstaller === "private"
    ? formData.placeOfInstallation
    : station.defaultStartPoints.find(
        (e) => e.place === formData.placeOfInstallation
      );

  const selectedEnd = station.defaultEndPoints.find(
    (e) => e.place === formData.placeOfImmersion
  );
      
    const intermediatejun = junctions?.map((junction) => junction);

    if (selectedEnd && selectedStart) {
      const nextIdolId = formData.idol_id;

      setUpdatedFormData({
        ...formData,
        idol_id: nextIdolId,
        endCoords: selectedEnd.coords,
        startCoords: selectedStart.coords,
        intermediateJunctionPoints: intermediatejun,
        stationName: station.stationLocation,
        stationDivision: station.stationDivision,
        stationDistrict: station.stationDistrict,
      });
    } else {
      alert("Location Details are not filled Properly.");
      setShowLoading(false); // Stop loading if locations are not found
      return; // Prevent further execution
    }
  };

  useEffect(() => {
    if (updatedFormData) {
      if (isOthers) {
        setFormData((prevState) => ({
          ...prevState,
          placeOfInstallation: formData.hamletVillage,
        }));
      }

      const postData = async () => {
        try {
          const response = await axios.put(
            `${API_BASE_URL}/stations/${stationId}/${idolData.idol_id}/updateidol`,
            updatedFormData
          );
          setMessagecolor("warning");
          setMessage("updating....");
          console.log("Data sent successfully: " + response.data.idol);
          const newidol = response.data.idol;
          setStation((prevStation) => {
            const updatedIdols = prevStation.stationIdol.map((idol) =>
              idol.idol_id === newidol.idol_id ? newidol : idol
            );
            return {
              ...prevStation,
              stationIdol: updatedIdols,
            };
          });
          setMessagecolor("success");
          setMessage("update success..");
          setTimeout(() => onClose(), 3000);
        } catch (error) {
          setMessagecolor("danger");
          setMessage(error.message);
          console.log("Error: " + error);
        } finally {
          setShowLoading(false);
          console.log(updatedFormData);
        }
      };

      postData();
    }
  }, [updatedFormData]);

  return (
    <div className="main my-5">
      {showLoading && <Loading />}
      <div className="form-container">
        <div className="form__close__btn btn" onClick={onClose}>
          &times;
        </div>
        {formType === 0 && (
          <div className="logo-container">
            <p className="h1 text-center">
              Vinayagar Chathurthi Pre-Installation
            </p>
          </div>
        )}
        {formType === 1 && (
          <div className="logo-container">
            <p className="h1 text-center">Vinayagar Chathurthi Installation</p>
          </div>
        )}
        {formType === 2 && (
          <div className="logo-container">
            <p className="h1 text-center">
              Vinayagar Chathurthi Procession & Immersion
            </p>
          </div>
        )}
        <form className="form h6 mx-4" onSubmit={handleSubmit}>
          {formType === 0 && (
            <div>
              <div>
                <label htmlFor="Applicant details " className="h5">
                  Applicant Details
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="ApplicantName">Applicant Name</label>
                <input
                  type="text"
                  id="ApplicantName"
                  name="applicantName"
                  className="form-control"
                  placeholder="Enter Applicant Name"
                  value={formData.applicantName ? formData.applicantName : ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="ApplicantPhNum">Applicant phone number</label>
                <input
                  type="number"
                  id="ApplicantPhNum"
                  name="applicantPhNum"
                  className="form-control"
                  placeholder="Enter applicant phone number"
                  value={formData.applicantPhNum ? formData.applicantPhNum : ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="ApplicantAddress">Applicant Address</label>
                <input
                  type="text"
                  id="ApplicantAddress"
                  name="applicantAddress"
                  className="form-control"
                  placeholder="Enter Applicant Address"
                  value={
                    formData.applicantAddress ? formData.applicantAddress : ""
                  }
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="commonoption">Installer Type</label>
                <div>
                  <select
                    className="form-control"
                    onChange={handleChange}
                    id="typeOfInstaller"
                    value={
                      formData.typeOfInstaller ? formData.typeOfInstaller : ""
                    }
                    name="typeOfInstaller"
                  >
                    <option value="">Select Option</option>
                    <option value="private">Private</option>
                    <option value="public">Private at a Public place</option>
                    <option value="organization">
                      Organization at a Public place
                    </option>
                  </select>
                </div>
                {formData.typeOfInstaller === "organization" && (
                  <select
                    className="form-control"
                    onChange={handleChange}
                    id="Organization"
                    value={formData.organizationName || ""}
                    name="organizationName"
                  >
                    <option value="">Select an option</option>
                    {organizationOptions.map((value, index) => (
                      <option key={index}>{value}</option>
                    ))}
                  </select>
                )}
              </div>
              <br />

              <div className="form-group">
                <label htmlFor="Mother_Village">
                  Mother Village <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  className="form-control"
                  name="motherVillage"
                  onChange={handleChange}
                  id="motherVillage"
                  value={formData.motherVillage || ""}
                  required
                >
                  <option value="">Select an option</option>
                  {motherVillages.map((values, index) => (
                    <option key={index} value={values}>
                      {values}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="hamletVillage">Hamlet Village</label>
                <select
                  className="form-control"
                  name="hamletVillage"
                  onChange={handleChange}
                  id="hamletVillage"
                  value={formData.hamletVillage || ""}
                >
                  <option value="">Select an option</option>
                  {hamletVillages.map((values, index) => (
                    <option key={index} value={values}>
                      {values}
                    </option>
                  ))}
                </select>
              </div>
              {formData.typeOfInstaller === "private" ? (
                <div className="form-group">
                  <label htmlFor="Location">
                    Location of Idol <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="idolLocation"
                    name="placeOfInstallation"
                    className="form-control"
                    placeholder="Enter the Location"
                    value={`${formData.hamletVillage}`}
                    onChange={handleChange}
                    readOnly
                    required
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="Location">
                    Location of Idol <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    id="idolLocation"
                    name="placeOfInstallation"
                    className="form-control"
                    placeholder="Enter the Location"
                    required
                    value={
                      formData.placeOfInstallation
                        ? formData.placeOfInstallation
                        : ""
                    }
                    onChange={handleChange}
                  >
                    <option value="">Select an option</option>
                    {startPoints.map((values, index) => (
                      <option key={index} value={values}>
                        {values}
                      </option>
                    ))}
                    <option value="others" id="others">
                      others(new location)
                    </option>
                  </select>
                  {isOthers && (
                    <input
                      type="text"
                      id="otherLocation"
                      name="otherLocation"
                      className="form-control"
                      placeholder="Enter the Location"
                    />
                  )}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="date">Date of Installation</label>
                <input
                  type="date"
                  id="setupDate"
                  name="setupDate"
                  className="form-control"
                  placeholder="Enter the Date"
                  value={formData.setupDate ? formData.setupDate : ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="Height">Idol Height </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  className="form-control"
                  placeholder="Enter the Height"
                  value={formData.height ? formData.height : ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>
                  Idol License <span style={{ color: "red" }}>*</span>
                </label>
                <div className="row" id="radioDiv">
                  <div className="col-sm-6">
                    <input
                      type="radio"
                      className="btn-check form-control"
                      name="licence"
                      id="commoncrowdoptionbtn1"
                      autoComplete="off"
                      value="yes"
                      required
                      onChange={handleRadioChange}
                      checked={formData.licence === "yes" ? true : false}
                    />
                    <label
                      className="btn btn-light"
                      htmlFor="commoncrowdoptionbtn1"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="col-sm-6">
                    <input
                      type="radio"
                      className="btn-check form-control"
                      name="licence"
                      id="commoncrowdoptionbtn2"
                      autoComplete="off"
                      value="no"
                      required
                      checked={formData.licence === "no" ? true : false}
                      onChange={handleRadioChange}
                    />
                    <label
                      className="btn btn-light"
                      htmlFor="commoncrowdoptionbtn2"
                    >
                      No
                    </label>
                  </div>
                </div>
              </div>

              <button
                className="form-submit-btn"
                type="next"
                onClick={handleNext}
              >
                Save & Next
              </button>
            </div>
          )}
          {formType === 1 && (
            <div>
              {/* Permissions Section */}
              <div className="form-group">
                <label htmlFor="Location" className="h5">
                  License & Provision
                </label>

                {/* Police Permission */}
                <div className="form-group">
                  <label>
                    Police permission is granted or not?{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="row" id="radioDiv">
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="permission.police"
                        value="yes"
                        id="policePermissionYes"
                        required
                        onChange={handleChange1}
                        checked={
                          formData.permission.police === true ? true : false
                        }
                        autoComplete="off"
                      />
                      <label
                        className="btn btn-light"
                        htmlFor="policePermissionYes"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="permission.police"
                        value="no"
                        required
                        id="policePermissionNo"
                        checked={
                          formData.permission.police === false ? true : false
                        }
                        onChange={handleChange1}
                        autoComplete="off"
                      />
                      <label
                        className="btn btn-light"
                        htmlFor="policePermissionNo"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {/* Fire Service Permission */}
                <div className="form-group">
                  <label>
                    Fire Service permission is granted or not?{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="row" id="radioDiv">
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="permission.fireService"
                        value="yes"
                        id="firePermissionYes"
                        onChange={handleChange1}
                        autoComplete="off"
                        required
                        checked={
                          formData.permission.fireService === true
                            ? true
                            : false
                        }
                      />
                      <label
                        className="btn btn-light"
                        htmlFor="firePermissionYes"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="permission.fireService"
                        required
                        value="no"
                        id="firePermissionNo"
                        onChange={handleChange1}
                        autoComplete="off"
                        checked={
                          formData.permission.fireService === false
                            ? true
                            : false
                        }
                      />
                      <label
                        className="btn btn-light"
                        htmlFor="firePermissionNo"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {/* TNEB Permission */}
                <div className="form-group">
                  <label>
                    TNEB permission is granted or not?{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="row" id="radioDiv">
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="permission.TNEB"
                        value="yes"
                        required
                        id="tnebPermissionYes"
                        checked={
                          formData.permission.TNEB === true ? true : false
                        }
                        onChange={handleChange1}
                        autoComplete="off"
                      />
                      <label
                        className="btn btn-light"
                        htmlFor="tnebPermissionYes"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="permission.TNEB"
                        value="no"
                        required
                        id="tnebPermissionNo"
                        onChange={handleChange1}
                        checked={
                          formData.permission.TNEB === false ? true : false
                        }
                        autoComplete="off"
                      />
                      <label
                        className="btn btn-light"
                        htmlFor="tnebPermissionNo"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {/* Electrical Equipment Insulation */}
                <div className="form-group">
                  <label>
                    Electrical equipment is insulated or not?{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="row" id="radioDiv">
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="facility.electricalEquipment"
                        id="electricalInsulatedYes"
                        autoComplete="off"
                        value="yes"
                        required
                        checked={
                          formData.facility.electricalEquipment === true
                            ? true
                            : false
                        }
                        onChange={handleChange1}
                      />
                      <label
                        className="btn btn-light"
                        htmlFor="electricalInsulatedYes"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="facility.electricalEquipment"
                        id="electricalInsulatedNo"
                        autoComplete="off"
                        required
                        value="no"
                        checked={
                          formData.facility.electricalEquipment === false
                            ? true
                            : false
                        }
                        onChange={handleChange1}
                      />
                      <label
                        className="btn btn-light"
                        htmlFor="electricalInsulatedNo"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {/* Lighting Facility */}
                <div className="form-group">
                  <label htmlFor="">
                    Lighting Facility is available or not?{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="row" id="radioDiv">
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        required
                        className="btn-check form-control"
                        name="facility.lightingFacility"
                        id="lightingAvailableYes"
                        autoComplete="off"
                        value="yes"
                        checked={
                          formData.facility.lightingFacility === true
                            ? true
                            : false
                        }
                        onChange={handleChange1}
                      />
                      <label
                        className="btn btn-light"
                        htmlFor="lightingAvailableYes"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="facility.lightingFacility"
                        id="lightingAvailableNo"
                        autoComplete="off"
                        value="no"
                        required
                        checked={
                          formData.facility.lightingFacility === false
                            ? true
                            : false
                        }
                        onChange={handleChange1}
                      />
                      <label
                        className="btn btn-light"
                        htmlFor="lightingAvailableNo"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {/* CCTV Facility */}
                <div className="form-group">
                  <label>
                    CCTV facility is available or not?{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="row" id="radioDiv">
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        required
                        className="btn-check form-control"
                        name="facility.CCTVFacility"
                        id="cctvAvailableYes"
                        autoComplete="off"
                        value="yes"
                        checked={
                          formData.facility.CCTVFacility === true ? true : false
                        }
                        onChange={handleChange1}
                      />
                      <label
                        className="btn btn-light"
                        htmlFor="cctvAvailableYes"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="facility.CCTVFacility"
                        id="cctvAvailableNo"
                        autoComplete="off"
                        value="no"
                        required
                        checked={
                          formData.facility.CCTVFacility === false
                            ? true
                            : false
                        }
                        onChange={handleChange1}
                      />
                      <label
                        className="btn btn-light"
                        htmlFor="cctvAvailableNo"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group row mt-3">
                <label className="h5">
                  Place / Properties <span style={{ color: "red" }}>*</span>
                </label>
                <div className="col-md-12">
                  <select
                    className="form-control subForecastOption"
                    id="propertyTypeSelect"
                    onChange={handleChange1}
                    value={formData.property.type ? formData.property.type : ""}
                  >
                    <option value="">Select place / properties</option>
                    <option value="Private">Private</option>
                    <option value="Government">Government</option>
                  </select>
                  <div className="col-md-12 my-2">
                    <label>Description</label>
                    <input
                      className="form-control"
                      id="propertyDescription"
                      placeholder={
                        propertyType === "Private"
                          ? "Enter Patta number"
                          : "Enter Dept. name, Permission status"
                      }
                      value={
                        formData.property.description
                          ? formData.property.description
                          : ""
                      }
                      onChange={handleChange1}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group row mt-3">
                <label className="h5">Shed Type</label>
                <div>
                  <select
                    className="form-control"
                    id="commonoption"
                    name="shed.type"
                    onChange={handleChange1}
                    value={formData.shed.type ? formData.shed.type : ""}
                  >
                    <option value="">Select shed type</option>
                    <option value="Flammable">Flammable</option>
                    <option value="Non-Flammable">Non-Flammable</option>
                  </select>
                  <div className="col-md-12 my-2">
                    <label>Description</label>
                    <input
                      className="form-control"
                      id="shedDescription"
                      name="shed.description"
                      placeholder="Shed Description"
                      onChange={handleChange1}
                      value={
                        formData.shed.description
                          ? formData.shed.description
                          : ""
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Volunteer Details */}
              <label className="h5">Volunteer Details</label>
              {formData.volunteers.map((volunteer, index) => (
                <div
                  className="row d-flex align-items-center row mt-1"
                  key={index}
                >
                  <div className="col-md-2">
                    <label htmlFor={`volunteer${index + 1}`}>
                      V{index + 1}
                    </label>
                  </div>
                  <div className="col-md-3">
                    <input
                      className="form-control"
                      name="name"
                      value={volunteer.name}
                      placeholder="Name"
                      onChange={(e) => handleVolunteerChange(index, e)}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      className="form-control"
                      name="mobileNo"
                      value={volunteer.mobileNo}
                      placeholder="Mobile No"
                      onChange={(e) => handleVolunteerChange(index, e)}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      className="form-control"
                      name="address"
                      value={volunteer.address}
                      placeholder="Address"
                      onChange={(e) => handleVolunteerChange(index, e)}
                    />
                  </div>
                </div>
              ))}
              <div className="d-flex w-100 g-2 ">
                <button
                  className="btn btn-light nextBtn"
                  type="next"
                  onClick={handleAddVolunteer}
                >
                  Add Volunteer
                </button>
                <button
                  className="btn btn-light prevBtn"
                  type="next"
                  onClick={handleRemoveVolunteer}
                >
                  Remove Volunteer
                </button>
              </div>
              <br />
              <div className="d-flex align-items-center justify-content-around g-2">
                <button
                  className="form-submit-btn prevBtn"
                  type="next"
                  onClick={handlePrev}
                >
                  Previous
                </button>
                <button
                  className="form-submit-btn nextBtn"
                  type="next"
                  onClick={handleNext1}
                >
                  Save & Next
                </button>
              </div>
            </div>
          )}
          {formType === 2 && (
            <div>
              <div className="form-group">
                <label htmlFor="date" className="h5">
                  Date of Immersion
                </label>
                <input
                  type="date"
                  id="date"
                  name="immersionDate"
                  className="form-control"
                  placeholder="Enter the Date"
                  value={formData.immersionDate}
                  onChange={handleChange2}
                />
              </div>

              <div className="form-group">
                <label htmlFor="vehicleType" className="h5">
                  Transport
                </label>
                <div className="form-group row mt-1">
                  <label className="h6">
                    Type of Vehicle <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="col-md-12">
                    <select
                      name="modeOfTransport.vehicleType"
                      className="form-control subForecastOption"
                      value={formData.modeOfTransport.vehicleType}
                      onChange={handleChange2}
                      id="transport"
                      required
                    >
                      <option value="" disabled>
                        Select Vehicle Type
                      </option>
                      <option value="two-wheeler">Two-Wheeler</option>
                      <option value="four-wheeler-open">
                        Four-Wheeler (Open Top)
                      </option>
                      <option value="four-wheeler-closed">
                        Four-Wheeler (Closed Top)
                      </option>
                    </select>

                    <div className="col-md-12 my-2">
                      <label>
                        Description <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        required
                        name="modeOfTransport.vehicleDescription"
                        placeholder="Enter Vehicle make and model"
                        value={formData.modeOfTransport.vehicleDescription}
                        onChange={handleChange2}
                        id="transport"
                      />
                    </div>

                    <div className="col-md-12 my-2">
                      <label>Driver License</label>
                      <input
                        className="form-control"
                        name="modeOfTransport.driverLicense"
                        placeholder="Enter Driver's License number"
                        value={formData.modeOfTransport.driverLicense}
                        onChange={handleChange2}
                        id="transport"
                      />
                    </div>

                    <div className="col-md-12 my-2">
                      <label>Driver Name</label>
                      <input
                        className="form-control"
                        name="modeOfTransport.driverName"
                        placeholder="Enter Driver's name"
                        value={formData.modeOfTransport.driverName}
                        onChange={handleChange2}
                        id="transport"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      Procession by <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="row" id="radioDiv">
                      <div className="col-sm-6">
                        <input
                          type="radio"
                          className="btn-check form-control"
                          name="processionBy"
                          id="individual"
                          value="individual"
                          required
                          onChange={handleChange2}
                          checked={
                            formData.processionBy === "individual"
                              ? true
                              : false
                          }
                        />
                        <label className="btn btn-light" htmlFor="individual">
                          Individual
                        </label>
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="radio"
                          className="btn-check form-control"
                          name="processionBy"
                          required
                          id="group"
                          value="group"
                          onChange={handleChange2}
                          checked={
                            formData.processionBy === "group" ? true : false
                          }
                        />
                        <label className="btn btn-light" htmlFor="group">
                          Group
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group row mt-1">
                <label className="h5">Sensitivity </label>

                <div className="form-group">
                  <label htmlFor="sensitivity">
                    Select Route Sensitivity{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div>
                    <select
                      className="form-control"
                      onChange={handleChange}
                      id="sensitivity"
                      value={formData.sensitivity ? formData.sensitivity : ""}
                      name="sensitivity"
                      required
                    >
                      <option value="">Select Option</option>
                      <option value="Nonsensitive">Non-sensitve</option>
                      <option value="Sensitive">Sensitive</option>
                      <option value="Hyper-Sensitive">Hyper-Sensitive</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Are there Mosque and Church in the Procession route?{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="row" id="radioDiv">
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        required
                        className="btn-check form-control"
                        name="isChurchMosque"
                        id="isChurchMosque1"
                        autoComplete="off"
                        value="yes"
                        onChange={handleRadioChange}
                        checked={
                          formData.isChurchMosque === "yes" ? true : false
                        }
                      />
                      <label
                        className="btn btn-light"
                        htmlFor="isChurchMosque1"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="isChurchMosque"
                        id="isChurchMosque2"
                        autoComplete="off"
                        value="no"
                        checked={
                          formData.isChurchMosque === "no" ? true : false
                        }
                        onChange={handleRadioChange}
                      />
                      <label
                        className="btn btn-light"
                        htmlFor="isChurchMosque2"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group row mt-1">
                <label className="h5">Route</label>

                {formData.typeOfInstaller === "private" ? (
                  <div className="form-group">
                    <label htmlFor="Location">
                      Starting Points <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="placeOfInstallation"
                      name="placeOfInstallation"
                      className="form-control"
                      placeholder="Enter the Location"
                      value={`${formData.hamletVillage}`}
                      onChange={() => console.log("private changed")}
                      readOnly
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label htmlFor="Location">
                      Starting Points <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      id="placeOfInstallation"
                      name="placeOfInstallation"
                      className="form-control"
                      placeholder="Enter the Location"
                      value={
                        formData.placeOfInstallation
                          ? formData.placeOfInstallation
                          : ""
                      }
                      onChange={handleChange}
                    >
                      <option value="">Select an option</option>
                      {startPoints.map((values, index) => (
                        <option key={index} value={values}>
                          {values}
                        </option>
                      ))}
                      <option value="others" id="others">
                        others(new location)
                      </option>
                    </select>
                    {isOthers && (
                      <input
                        type="text"
                        id="otherLocation"
                        name="otherLocation"
                        className="form-control"
                        placeholder="Enter the Location"
                      />
                    )}
                  </div>
                )}

                <div className="form-group ">
                  <label htmlFor="placeOfImmersion" className="col-3">
                    Place of Immersion
                  </label>
                  <select
                    id="placeOfImmersion"
                    name="placeOfImmersion"
                    className="form-control col-9"
                    placeholder="Enter place of immersion"
                    value={formData.placeOfImmersion || ""}
                    onChange={handleChange2}
                  >
                    <option value="">Select an option</option>
                    {endPoints.map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="h5">Route Details</label>
                  <div className="form-group">
                    {/* Starting Point (non-editable) */}
                    <label htmlFor="routeStartingPoint">Starting Point</label>
                    <input
                      type="text"
                      id="routeStartingPoint"
                      placeholder="Starting point not selected"
                      className="form-control"
                      value={formData.placeOfInstallation} // Replace with the actual starting point name
                      readOnly
                    />
                    <label htmlFor="DefaultJunctionPoint">
                      Default junction points
                    </label>
                    <select
                      className="form-control"
                      id="DefaultJunctionPoint"
                      name="startJunctionPoint"
                      value={formData.startJunctionPoint || ""}
                      onChange={handleChange2}
                    >
                      <option value="" disabled>
                        Select Junction
                      </option>
                      {JunctionPoints.map((option, idx) => (
                        <option key={idx} value={option.place}>
                          {option.place}
                        </option>
                      ))}
                    </select>
                    {/* Dynamic Junction Points with Dropdowns */}
                    {junctions.map((junction, index) => (
                      <div
                        className="row d-flex align-items-center mt-2"
                        key={index}
                      >
                        <label htmlFor="IntermediateJunctionPoints">
                          Intermediate Junction points
                        </label>

                        <div className="col-md-4">
                          <select
                            className="form-control"
                            id="IntermediateJunctionPoints"
                            value={junction.place}
                            onChange={(e) => handleJunctionChange(index, e)}
                          >
                            <option value="" disabled>
                              Select Intermediate Junctions
                            </option>
                            {IntermediateJunctionPoints.map((option, idx) => (
                              <option key={idx} value={option.place}>
                                {option.place}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <input
                            className="form-control"
                            name="coords"
                            value={
                              junction.coords
                                ? junction.coords.lat +
                                  ", " +
                                  junction.coords.lon
                                : ""
                            }
                            placeholder="Junction Coords"
                            readOnly
                          />
                        </div>
                        <div className="col-md-2">
                          <button
                            className="btn btn-light"
                            type="button"
                            onClick={(e) => handleRemoveJunction(index)}
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="d-flex w-100 g-2 mt-3">
                      <button
                        className="btn btn-light"
                        type="button"
                        onClick={handleAddJunction}
                      >
                        Add Junction
                      </button>
                    </div>

                    {/* Ending Point (non-editable) */}
                    <label>Ending Point</label>
                    <input
                      placeholder="Ending point not selected"
                      className="form-control"
                      value={formData.placeOfImmersion} // Replace with the actual ending point name
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="form-group row mt-1">
                <div className="form-group ">
                  <label htmlFor="" className="col-4 h5">
                    Safety Measures
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Barricade <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="row" id="radioDiv">
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="immersionSafety.barricade"
                        id="barricadeYes"
                        required
                        value="yes"
                        onChange={handleChange2}
                        checked={
                          formData.immersionSafety.barricade === true
                            ? true
                            : false
                        }
                      />
                      <label className="btn btn-light" htmlFor="barricadeYes">
                        Yes
                      </label>
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="immersionSafety.barricade"
                        id="barricadeNo"
                        required
                        value="no"
                        onChange={handleChange2}
                        checked={
                          formData.immersionSafety.barricade === false
                            ? true
                            : false
                        }
                      />
                      <label className="btn btn-light" htmlFor="barricadeNo">
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Lighting Facility <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="row" id="radioDiv">
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="immersionSafety.lighting"
                        id="lightingYes"
                        value="yes"
                        onChange={handleChange2}
                        required
                        checked={
                          formData.immersionSafety.lighting === true
                            ? true
                            : false
                        }
                      />
                      <label className="btn btn-light" htmlFor="lightingYes">
                        Yes
                      </label>
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="immersionSafety.lighting"
                        id="lightingNo"
                        required
                        value="no"
                        onChange={handleChange2}
                        checked={
                          formData.immersionSafety.lighting === false
                            ? true
                            : false
                        }
                      />
                      <label className="btn btn-light" htmlFor="lightingNo">
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Safety Measure by Fire Service (Drowning Prevention){" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="row" id="radioDiv">
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="immersionSafety.safetyByFireService"
                        id="safetyYes"
                        value="yes"
                        onChange={handleChange2}
                        required
                        checked={
                          formData.immersionSafety.safetyByFireService === true
                            ? true
                            : false
                        }
                      />
                      <label className="btn btn-light" htmlFor="safetyYes">
                        Yes
                      </label>
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check form-control"
                        name="immersionSafety.safetyByFireService"
                        id="safetyNo"
                        required
                        value="no"
                        onChange={handleChange2}
                        checked={
                          formData.immersionSafety.safetyByFireService === false
                            ? true
                            : false
                        }
                      />
                      <label className="btn btn-light" htmlFor="safetyNo">
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    PA System <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="row" id="radioDiv">
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check"
                        name="immersionSafety.PASystem"
                        id="PAYes"
                        value="yes"
                        required
                        onChange={handleChange2}
                        checked={
                          formData.immersionSafety.PASystem === true
                            ? true
                            : false
                        }
                      />
                      <label className="btn btn-light" htmlFor="PAYes">
                        Yes
                      </label>
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check"
                        name="immersionSafety.PASystem"
                        id="PANo"
                        value="no"
                        required
                        onChange={handleChange2}
                        checked={
                          formData.immersionSafety.PASystem === false
                            ? true
                            : false
                        }
                      />
                      <label className="btn btn-light" htmlFor="PANo">
                        No
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    RTO License approved or not{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="row" id="radioDiv">
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check"
                        name="RTOpermission"
                        id="RTOYes"
                        value="yes"
                        required
                        onChange={handleChange2}
                        checked={
                          formData.RTOpermission === "yes" ? true : false
                        }
                      />
                      <label className="btn btn-light" htmlFor="RTOYes">
                        Yes
                      </label>
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check"
                        name="RTOpermission"
                        required
                        id="RTONo"
                        value="no"
                        onChange={handleChange2}
                        checked={formData.RTOpermission === "no" ? true : false}
                      />
                      <label className="btn btn-light" htmlFor="RTONo">
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex g-2 col mt-4">
                <button
                  className="form-submit-btn prevBtn"
                  type="next"
                  onClick={handlePrev}
                >
                  Previous
                </button>
                <button className="form-submit-btn nextBtn" type="submit">
                  Submit
                </button>
              </div>

              {message && (
                <p className={`text-center mt-3 fs-4 text-${messagecolor}`}>
                  {message}
                </p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditForm;

// <div className="form-group">
//                   <label htmlFor="image">Upload applicant image</label>
//                   <input
//                     type="file"
//                     id="image"
//                     placeholder="choose file"
//                     name="applicantImage"
//                     className="form-control"
//                     onChange={(e) => setApplicantImage(e.target.files[0])}
//                   />
//                   {applicantImage && (
//                     <div>
//                       <p>Selected file: {applicantImage.name}</p>
//                       <p>File type: {applicantImage.type}</p>
//                       <p>
//                         File size: {(applicantImage.size / 1024).toFixed(2)} KB
//                       </p>
//                     </div>
//                   )}
//                 </div>

{
  /* <div className="form-group">
                <label htmlFor="image">Upload Application File</label>
                <input
                  type="file"
                  id="image"
                  placeholder="choose file"
                  name="idolApplication"
                  className="form-control"
                  onChange={(e) => setApplicationFile(e.target.files[0])}
                />
                {applicationFile && (
                  <div>
                    <p>Selected file: {applicationFile.name}</p>
                    <p>File type: {applicationFile.type}</p>
                    <p>
                      File size: {(applicationFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
              </div> */
}

//   <div className="form-group">
//     <label htmlFor="image">Upload Idol Image</label>
//     <input
//       type="file"
//       id="image"
//       name="idolImage"
//       className="form-control"
//       onChange={(e) => setImageFile(e.target.files[0])}
//     />
//   </div>
//   {imageFile && (
//     <div>
//       <p>Selected file: {imageFile.name}</p>
//       <p>File type: {imageFile.type}</p>
//       <p>File size: {(imageFile.size / 1024).toFixed(2)} KB</p>
//     </div>
//   )}
