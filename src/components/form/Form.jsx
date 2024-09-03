import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./form_style.css";
import API_BASE_URL from "../../../apiConfig";
import Loading from "../loading/Loading";

// import station from "../../../smpstation.json";

const Form = ({ stationId, onClose, onAddIdol, station }) => {
  // const previdolid = stationidol[-1].idol_id;
  // const stationId = "ST127";
  const [formType, setFormType] = useState(0);
  const [propertyType, setPropertyType] = useState("");
  const [applicationFile, setApplicationFile] = useState(null);
  const [applicantImage, setApplicantImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messagecolor, setMessagecolor] = useState("");
  const [isOthers, setIsOthers] = useState(false);
  const [junctions, setJunctions] = useState([{ place: "", coords: "" }]);
  const [formData, setFormData] = useState({
    permission: {
      police: null,
      fireService: null,
      TNEB: null,
    },
    facility: {
      electricalEquipment: null,
      lightingFacility: null,
      CCTVFacility: null,
    },
    property: {
      type: "",
      description: "",
    },
    shed: {
      type: "",
      description: "",
    },
    volunteers: [
      { name: "", mobileNo: "", address: "" },
      { name: "", mobileNo: "", address: "" },
      { name: "", mobileNo: "", address: "" },
      { name: "", mobileNo: "", address: "" },
      { name: "", mobileNo: "", address: "" },
      { name: "", mobileNo: "", address: "" },
    ],
  });

  useEffect(() => {
    if (formData.typeOfInstaller !== "organization") {
      formData.organizationName = "";
    }
  }, [formData.typeOfInstaller]);

  const stationDetails = station.motherVillage;
  const organizationOptions = station.defaultOrganization;
  const startPoints = station.defaultStartPoints.map((e) => e.place);
  const JunctionPoints = station.defaultJunctionPoints.map((e) => e);
  const IntermediateJunctionPoints =
    station.defaultIntermediateJunctionPoints.map((e) => e);

  const endPoints = station.defaultEndPoints.map((e) => e.place);

  const motherVillages = Object.keys(stationDetails);

  const [hamletVillages, setHamletVillages] = useState([]);

  const getIdolId = () => {
    let idolIDs = [];
    let idolID;
    const type =
      formData.typeOfInstaller === "private"
        ? "PVT"
        : formData.typeOfInstaller === "public"
        ? "PUB"
        : "ORG";
    if (station.stationIdol.length > 0) {
      idolIDs = station.stationIdol.map((val) => val.idol_id);
      idolIDs = idolIDs.map((id) => parseInt(id.match(/\d+$/), 10));

      let maxIdolId = Math.max(...idolIDs);

      idolID =
        station.defaultIdolId +
        "_" +
        type +
        "_" +
        String(maxIdolId + 1).padStart(3, "0");
    } else {
      idolID = station.defaultIdolId + "_" + type + "_001";
    }

    return idolID;
  };

  const handleFileUpload = (e, allowedTypes, setFile) => {
    const fileInput = e.target;
    const maxSize = 512 * 1024;
    const file = fileInput.files[0];

    if (file) {
      if (allowedTypes.includes(file.type)) {
        if (file.size <= maxSize) {
          setFile(file);
        } else {
          alert(
            `File size exceeds the ${(maxSize / 1024).toFixed(2)} KB limit.`
          );
          fileInput.value = "";
          setFile(null);
        }
      } else {
        alert(
          `Invalid file type. Allowed types are: ${allowedTypes.join(", ")}.`
        );
        fileInput.value = "";
        setFile(null);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files, id } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]:
        type === "file"
          ? files[0]
          : type === "number"
          ? parseInt(value, 10)
          : value,
    }));

    if (id === "motherVillage") {
      const selectedHamletVillages = stationDetails[value];
      if (Array.isArray(selectedHamletVillages)) {
        setHamletVillages(
          selectedHamletVillages.map((village) => village.place)
        );
        console.log(selectedHamletVillages);
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
      : formData.typeOfInstaller === "organization"
      ? (requiredFields = [
          "motherVillage",
          "licence",
          "typeOfInstaller",
          "organizationName",
        ])
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
    const updatedJunctions = [...junctions];
    updatedJunctions[index] = selectedOption;
    setJunctions(updatedJunctions);
  };

  const handleAddJunction = () => {
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
      "placeOfImmersion",
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
      alert("Please fill in all required fields.");
      setShowLoading(false);
      return;
    }

    if (formData.typeOfInstaller === "private" && formData.hamletVillage) {
      setFormData((prevState) => ({
        ...prevState,
        placeOfInstallation: formData.hamletVillage,
      }));
    }

    let selectedStart;

    if (formData.typeOfInstaller === "private") {
      // Check if the placeOfInstallation matches any place inside the motherVillage hamlet villages
      for (const [villageName, villageArray] of Object.entries(
        station.motherVillage
      )) {
        const matchingVillage = villageArray.find(
          (village) => village.place === formData.placeOfInstallation
        );
        if (matchingVillage) {
          selectedStart = matchingVillage;
          break; // Stop the loop if a match is found
        }
      }
    } else {
      // Fallback to defaultStartPoints if typeOfInstaller is not "private"
      selectedStart = station.defaultStartPoints.find(
        (e) => e.place === formData.placeOfInstallation
      );
    }

    const selectedEnd = station.defaultEndPoints.find(
      (e) => e.place === formData.placeOfImmersion
    );

    const intermediatejun = junctions?.map((junction) => junction);

    if (selectedEnd && selectedStart) {
      const nextIdolId = getIdolId();
      console.log(selectedStart);

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
      const filedata = new FormData();

      if (applicationFile) {
        filedata.append("idolApplication", applicationFile);
      }

      if (imageFile) {
        filedata.append("idolImage", imageFile);
      }

      if (applicantImage) {
        filedata.append("applicantImage", applicantImage);
      }

      const postData = async () => {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/stations/${stationId}/addidol`,
            updatedFormData
          );
          console.log("server response", response);

          const idolId = response.data.id;

          if (
            filedata.has("idolApplication") ||
            filedata.has("idolImage") ||
            filedata.has("applicantImage")
          ) {
            setMessagecolor("primary");
            setMessage("File uploading....");
            const fileResponse = await axios.post(
              `${API_BASE_URL}/stations/${stationId}/${idolId}/addfiles`,
              filedata,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            setMessagecolor("primary");
            setMessage("File uploaded success");
            onAddIdol(fileResponse.data.idol);
          } else {
            onAddIdol(response.data.idol);
          }

          setMessagecolor("primary");
          setMessage("Success Idol Added..!");
          setTimeout(() => onClose(), 3000);
        } catch (error) {
          setMessagecolor("danger");
          setMessage(error?.response?.data?.message || error.message);
          console.log(error);
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
        <form className="form h6 mx-4">
          {formType === 0 && (
            <div>
              <div className="form-group">
                <label htmlFor="applicationFile">Upload Application File</label>
                <input
                  type="file"
                  id="applicationFile"
                  placeholder="choose file"
                  name="idolApplication"
                  className="form-control"
                  onChange={(e) =>
                    handleFileUpload(
                      e,
                      [
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "image/jpeg",
                        "image/png",
                      ],
                      setApplicationFile
                    )
                  }
                />
                <div><a href="https://imageresizer.com/" target="_blank">image compressor</a></div>
                {applicationFile && (
                  <div>
                    <p>Selected file: {applicationFile.name}</p>
                    <p>File type: {applicationFile.type}</p>
                    <p>
                      File size: {(applicationFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
                
              </div>

              <div>
                <label htmlFor="ApplicantDetails" className="h5">
                  Applicant Details
                </label>
                <div className="form-group">
                  <label htmlFor="applicantImage">Upload Applicant Image</label>
                  <input
                    type="file"
                    id="applicantImage"
                    placeholder="choose file"
                    name="applicantImage"
                    className="form-control"
                    onChange={(e) =>
                      handleFileUpload(
                        e,
                        ["application/pdf", "image/jpeg", "image/png"],
                        setApplicantImage
                      )
                    }
                  />
                  {applicantImage && (
                    <div>
                      <p>Selected file: {applicantImage.name}</p>
                      <p>File type: {applicantImage.type}</p>
                      <p>
                        File size: {(applicantImage.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="ApplicantName">Applicant Name</label>
                <input
                  type="text"
                  id="ApplicantName"
                  name="applicantName"
                  className="form-control"
                  placeholder="Enter Applicant Name"
                  value={formData.applicantName || ""}
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
                <label htmlFor="commonoption">
                  Installer Type <span style={{ color: "red" }}>*</span>
                </label>
                <div>
                  <select
                    className="form-control"
                    onChange={handleChange}
                    id="typeOfInstaller"
                    value={
                      formData.typeOfInstaller ? formData.typeOfInstaller : ""
                    }
                    required
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
                  <div>
                    <label htmlFor="commonoption">
                      Organization Name <span style={{ color: "red" }}>*</span>
                    </label>
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
                  </div>
                )}
              </div>

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
                    onChange={() => console.log("private changed")}
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
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="Height">Idol Height</label>
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
                      onChange={handleRadioChange}
                      required
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
                        onChange={handleChange1}
                        required
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
                        id="policePermissionNo"
                        checked={
                          formData.permission.police === false ? true : false
                        }
                        onChange={handleChange1}
                        autoComplete="off"
                        required
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
                        required
                        autoComplete="off"
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
                        value="no"
                        id="firePermissionNo"
                        onChange={handleChange1}
                        autoComplete="off"
                        required
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
                        id="tnebPermissionNo"
                        onChange={handleChange1}
                        required
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
                        required
                        value="yes"
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
                        className="btn-check form-control"
                        name="facility.lightingFacility"
                        id="lightingAvailableYes"
                        autoComplete="off"
                        value="yes"
                        required
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
                        className="btn-check form-control"
                        name="facility.CCTVFacility"
                        id="cctvAvailableYes"
                        autoComplete="off"
                        value="yes"
                        required
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
                        checked={formData.facility.CCTVFacility === false}
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
                <label htmlFor="image">Upload Idol Image</label>
                <input
                  type="file"
                  id="image"
                  name="idolImage"
                  className="form-control"
                  onChange={(e) =>
                    handleFileUpload(
                      e,
                      [
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "image/jpeg",
                        "image/png",
                      ],
                      setImageFile
                    )
                  }
                />
              </div>
              {imageFile && (
                <div>
                  <p>Selected file: {imageFile.name}</p>
                  <p>File type: {imageFile.type}</p>
                  <p>File size: {(imageFile.size / 1024).toFixed(2)} KB</p>
                </div>
              )}
              <div className="form-group">
                <label htmlFor="date" className="h5">
                  Date of Immersion <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="immersionDate"
                  className="form-control"
                  placeholder="Enter the Date"
                  value={formData.date}
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
                      value={formData.vehicleType}
                      onChange={handleChange2}
                      id="transport"
                      required
                    >
                      <option value="">Select Vehicle Type</option>
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
                        name="modeOfTransport.vehicleDescription"
                        placeholder="Enter Vehicle make and model"
                        value={formData.vehicleDescription}
                        onChange={handleChange2}
                        id="transport"
                        required
                      />
                    </div>

                    <div className="col-md-12 my-2">
                      <label>Driver License</label>
                      <input
                        className="form-control"
                        name="modeOfTransport.driverLicense"
                        placeholder="Enter Driver's License number"
                        value={formData.driverLicense}
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
                        value={formData.driverName}
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
                          onChange={handleChange2}
                          required
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
                          id="group"
                          value="group"
                          required
                          onChange={handleChange2}
                        />
                        <label className="btn btn-light" htmlFor="group">
                          Group
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br />

              <div className="form-group row mt-1">
                <label className="h5">Sensitivity</label>

                <div className="form-group">
                  <label htmlFor="sensitivity">
                    Select Route Sensitivity{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div>
                    <select
                      className="form-control"
                      onChange={handleChange}
                      required
                      id="sensitivity"
                      value={formData.sensitivity ? formData.sensitivity : ""}
                      name="sensitivity"
                    >
                      <option value="">Select Option</option>
                      <option value="Nonsensitive">Nonsensitve</option>
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
                        className="btn-check form-control"
                        name="isChurchMosque"
                        id="isChurchMosque1"
                        autoComplete="off"
                        value="yes"
                        required
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
                        required
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

                <div className="form-group ">
                <label htmlFor="routeStartingPoint">Starting Point</label>
                    <input
                      type="text"
                      id="routeStartingPoint"
                      placeholder="Starting point not selected"
                      className="form-control"
                      value={formData.placeOfInstallation} // Replace with the actual starting point name
                      readOnly
                    />
                </div>

                <div className="form-group ">
                  <label htmlFor="placeOfImmersion" className="col-3">
                    Place of Immersion <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    id="placeOfImmersion"
                    name="placeOfImmersion"
                    className="form-control col-9"
                    placeholder="Enter place of immersion"
                    value={formData.placeOfImmersion || ""}
                    onChange={handleChange2}
                    required
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
                      name="defaultJunctionPoint"
                      value={formData.defaultJunctionPoint}
                      onChange={handleChange2}
                    >
                      <option value="">Select Junction</option>
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
                          En route Junction points
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
                            onClick={() => handleRemoveJunction(index)}
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
                        value="yes"
                        required
                        onChange={handleChange2}
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
                        value="no"
                        required
                        onChange={handleChange2}
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
                        required
                        onChange={handleChange2}
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
                        value="no"
                        required
                        onChange={handleChange2}
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
                        required
                        onChange={handleChange2}
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
                      />
                      <label className="btn btn-light" htmlFor="PANo">
                        No
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    RDO License approved or not{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="row" id="radioDiv">
                    <div className="col-sm-6">
                      <input
                        type="radio"
                        className="btn-check"
                        name="RTOpermission"
                        id="RTOYes"
                        required
                        value="yes"
                        onChange={handleChange2}
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
                        id="RTONo"
                        required
                        value="no"
                        onChange={handleChange2}
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
                <button
                  className="form-submit-btn nextBtn"
                  onClick={handleSubmit}
                >
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

export default Form;

// applicantImage: image object
// applicantName: String
// applicantNumber: Number
// applicantAddress: string

//isChurchMosque : yes/no
//sensitivity: String

// <div>
//       <label className="h5">Route Details</label>
//       <div className="row d-flex align-items-center mt-1">
//         {/* Starting Point (non-editable) */}
//         <div className="col-md-3">
//           <label>Starting Point</label>
//           <input
//             className="form-control"
//             value="formData.placeOfInstallation" // Replace with the actual starting point name
//             readOnly
//           />
//         </div>

//   {/* Dynamic Junction Points with Dropdowns */}
//   {junctions.map((junction, index) => (
//     <div
//       className="row d-flex align-items-center mt-2"
//       key={index}
//     >
//       <div className="col-md-4">
//         <select
//           className="form-control"
//           value={junction.place}
//           onChange={(e) => handleJunctionChange(index, e)}
//         >
//           <option value="" disabled>
//             Select Junction
//           </option>
//           {IntermediateJunctionPoints.map((option, idx) => (
//             <option key={idx} value={option.place}>
//               {option.place}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="col-md-4">
//         <input
//           className="form-control"
//           name="coords"
//           value={junction.coords}
//           placeholder="Junction Coords"
//           readOnly
//         />
//       </div>
//       <div className="col-md-2">
//         <button
//           className="btn btn-light"
//           type="button"
//           onClick={() => handleRemoveJunction(index)}
//         >
//           Remove
//         </button>
//       </div>
//     </div>
//   ))}

//   {/* Ending Point (non-editable) */}
//   <div className="col-md-3">
//     <label>Ending Point</label>
//     <input
//       className="form-control"
//       value="formData.placeOfImmersion" // Replace with the actual ending point name
//       readOnly
//     />
//   </div>
// </div>

//   <div className="d-flex w-100 g-2 mt-3">
//     <button
//       className="btn btn-light"
//       type="button"
//       onClick={handleAddJunction}
//     >
//       Add Junction
//     </button>
//   </div>
// </div>
