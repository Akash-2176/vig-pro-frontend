import "./idolPopup_style.css";

export const IdolPopup = ({ idolData, onClose }) => {
  console.log("idol data", idolData);

  return (
    <div>
      <div className="popup-container">
        <div className="popup-box px-3 py-2 m-5">
          <p className="h1 mb-5 mt-3 title">Applicant & Idol Details</p>
          <p
            className="close__btn"
            style={{
              position: "absolute",
              right: "30px",
              top: "20px",
              fontSize: "44px",
              fontWeight: "600",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            &times;
          </p>
          <div className="popup-innerbox">
            <div className="row">
              <div className="col-xl-7 mx-4">
                <div className="view-form-section my-3">
                  <img
                    className="view-form-img me-5"
                    id="img"
                    src={idolData.applicantImage}
                    alt="User Icon"
                  />
                  <div className="div1">
                    <div className="d-flex justify-content-between">
                      <strong className="me-4">Applicant Name:</strong>
                      <p> {idolData.applicantName}</p>
                    </div>
                    <div className="d-flex  justify-content-between">
                      <strong className="me-4">Applicant Address:</strong>
                      <p> {idolData.applicantAddress}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <strong className="me-4">Mobile No:</strong>
                      <p>{idolData.applicantPhNum}</p>
                    </div>
                  </div>
                </div>

                <div className="view-form-section view-form-section2 my-3">
                  <img
                    className="view-form-img me-5"
                    src={idolData.idolImage}
                    alt="Idol Icon"
                  />
                  <div className="div2">
                    <div className="d-flex justify-content-between">
                      <strong className="me-4">Idol ID:</strong>
                      <p>{idolData.idol_id}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <strong className="me-4">Type:</strong>
                      <p>{idolData.typeOfInstaller}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <strong className="me-4">Location of Idol:</strong>
                      <p> {idolData.placeOfInstallation}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <strong className="me-4">Date of Installation:</strong>
                      <p>
                        {" "}
                        {new Date(idolData.setupDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <strong className="me-4">Height:</strong>
                      <p>{idolData.height}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <strong className="me-4">Date of Immersion:</strong>
                      <p>
                        {new Date(idolData.immersionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 my-3">
                  <div className="d-flex justify-content-evenly">
                    <strong>Mother Village:</strong>
                    <p> {idolData.motherVillage}</p>
                  </div>
                  <div className="d-flex justify-content-evenly">
                    <strong>Hamlet Village:</strong>
                    <p> {idolData.hamletVillage}</p>
                  </div>
                  <div className="d-flex justify-content-evenly">
                    <strong>License:</strong>
                    <p>{idolData.licence}</p>
                  </div>
                </div>
                <h3 className="my-4 text-start">Route</h3>
                <div className="view-form-details my-3">
                  <div className="d-flex justify-content-evenly">
                    <strong>Starting point:</strong>
                    <p> {idolData.startingPoint}</p>
                  </div>
                  <div className="d-flex justify-content-evenly">
                    <strong>Place of Immersion:</strong>
                    <p> {idolData.placeOfImmersion}</p>
                  </div>
                  <div className="d-flex justify-content-evenly">
                    <strong>Procession Route:</strong>
                    <p> {idolData.route}</p>
                  </div>
                </div>
                <h3 className="my-4 text-start">Place/Properties</h3>
                <div className="d-flex justify-content-evenly">
                  <strong>Type:</strong>
                  <p>{idolData.property.type}</p>
                </div>
                <div className="d-flex justify-content-evenly">
                  <strong>Description:</strong>
                  <p>{idolData.property.description}</p>
                </div>

                <h3 className="my-4 text-start">Shed Type</h3>
                <div className="d-flex justify-content-evenly">
                  <strong>Type:</strong>
                  <p> {idolData.shed.type}</p>
                </div>
                <div className="d-flex justify-content-evenly">
                  <strong>Description:</strong>
                  <p> {idolData.shed.description}</p>
                </div>
              </div>

              <div className="col-xl-4 mx-4">
                <h3 className="my-4">Transport</h3>
                <div className="ms-5">
                  <div className="d-flex justify-content-between">
                    <strong>Type of Vehicle:</strong>
                    <p> {idolData.modeOfTransport.vehicleType}</p>
                  </div>
                  <div className="d-flex justify-content-between ">
                    <strong>Driver Name:</strong>
                    <p>{idolData.modeOfTransport.driverName}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <strong>Driver License:</strong>
                    <p> {idolData.modeOfTransport.driverLicense}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <strong className="me-5">Description:</strong>
                    <p> {idolData.modeOfTransport.vehicleDescription}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <strong>Procession By:</strong>
                    <p> {idolData.processionBy}</p>
                  </div>
                </div>

                <h3 className="my-4 ">Permissions/Facility</h3>
                <div className="ms-5">
                  <div className="d-flex justify-content-around">
                    <strong>Police Permission:</strong>
                    <p> {idolData.permission.police ? "Yes" : "No"}</p>
                  </div>
                  <div className="d-flex justify-content-around">
                    <strong>Fire Service Permission:</strong>
                    <p> {idolData.permission.fireService ? "Yes" : "No"}</p>
                  </div>
                  <div className="d-flex justify-content-around">
                    <strong>TNEB Permission:</strong>
                    <p> {idolData.permission.TNEB ? "Yes" : "No"}</p>
                  </div>
                  <div className="d-flex justify-content-around">
                    <strong>Electrical Equipment:</strong>
                    <p>
                      {" "}
                      {idolData.facility.electricalEquipment ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="d-flex justify-content-around">
                    <strong>Lighting Facility:</strong>
                    <p> {idolData.facility.lightingFacility ? "Yes" : "No"}</p>
                  </div>
                  <div className="d-flex justify-content-around">
                    <strong>CCTV Facility:</strong>
                    <p> {idolData.facility.CCTVFacility ? "Yes" : "No"}</p>
                  </div>
                </div>

                <h3 className="my-4">Immersion - Safety Measures</h3>
                <div className="ms-5">
                  <div className="d-flex justify-content-around">
                    <strong>Barricade:</strong>
                    <p>{idolData.immersionSafety.barricade ? "Yes" : "No"}</p>
                  </div>
                  <div className="d-flex justify-content-around">
                    <strong>Lighting Facility:</strong>
                    <p> {idolData.immersionSafety.lighting ? "Yes" : "No"}</p>
                  </div>
                  <div className="d-flex justify-content-around">
                    <strong>Safety Measures by Fire Service:</strong>
                    <p>
                      {" "}
                      {idolData.immersionSafety.safetyByFireService
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>
                  <div className="d-flex justify-content-around">
                    <strong>PA System:</strong>
                    <p>{idolData.immersionSafety.PASystem ? "Yes" : "No"}</p>
                  </div>
                </div>

                <h3 className="my-4 text-start">Volunteers Details</h3>
                <div className="my-4 table-responsive-xl">
                  <table className="table table-light table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="view-form-table-head">Volunteer No</th>
                        <th className="view-form-table-head">Name</th>
                        <th className="view-form-table-head">Address</th>
                        <th className="view-form-table-head">Mobile No</th>
                      </tr>
                    </thead>
                    <tbody>
                      {idolData.volunteers.map((volunteer, index) => (
                        <tr key={index}>
                          <td className="view-form-table-col">{index + 1}</td>
                          <td className="view-form-table-col">
                            {volunteer.name}
                          </td>
                          <td className="view-form-table-col">
                            {volunteer.address}
                          </td>
                          <td className="view-form-table-col">
                            {volunteer.mobileNo}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <a
            href={idolData.idolApplication}
            className="text-light text-decoration-none fs-5"
          >
            <button className="mt-1 p-2 bg-success text-light">
              View Application
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};
