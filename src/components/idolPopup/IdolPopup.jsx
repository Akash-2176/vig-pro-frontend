import "./idolPopup_style.css";

export const IdolPopup = ({ idolData, onClose }) => {
  console.log("idol data", idolData);

  return (
    <div className="idol-form-popup-container">
      <div className="idol-form-popup-box my-5 mx-5 px-5 py-4">
        <div className="idol-popup-close-btn h1" onClick={onClose}>
          &times;
        </div>
        <p className="h1 text-center mb-5 mt-4 text-success">
          Applicant & Idol Details
        </p>

        <div className="my-4 mt-5">
          <p className="h2 mb-4">Applicant Details</p>
          <div className="idol-form-content-box">
            <img
              src={idolData.applicantImage}
              className="idol-form-img img-fluid"
              alt="User Icon"
            />
            <div className="idol-form-content-innerbox ms-5">
              <table className="idol-form-content-list-div">
                <tr>
                  <td className="h5 pe-3">Name :</td>
                  <td>{idolData.applicantName}</td>
                </tr>
              </table>
              <table className="idol-form-content-list-div my-5">
                <tr>
                  <td className="h5 pe-3">Address :</td>
                  <td> {idolData.applicantAddress}</td>
                </tr>
              </table>
              <table className="idol-form-content-list-div">
                <tr>
                  <td className="h5 pe-3">Mobile No :</td>
                  <td> {idolData.applicantPhNum}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <div className="my-4">
          <p className="h2 mb-4">Idol Details</p>
          <div className="idol-form-content-box">
            <img
              className="idol-form-img img-fluid"
              src={idolData.idolImage}
              alt="Idol Icon"
            />
            <div className="idol-form-content-innerbox ms-5">
              <table className="idol-form-content-list-div my-2">
                <tr>
                  <td className="h5 pe-3">Idol ID :</td>
                  <td>{idolData.idol_id}</td>
                </tr>
              </table>
              <table className="idol-form-content-list-div my-2">
                <tr>
                  <td className="h5 pe-3">Station Name : </td>
                  <td> {idolData.stationName}</td>
                </tr>
              </table>

              <table className="idol-form-content-list-div my-3">
                <tr>
                  <td className="h5 pe-3">Mother Village : </td>
                  <td>{idolData.motherVillage}</td>
                </tr>
              </table>

              <table className="idol-form-content-list-div my-2">
                <tr>
                  <td className="h5 pe-3">Hamlet Village : </td>
                  <td> {idolData.hamletVillage}</td>
                </tr>
              </table>
              <table className="idol-form-content-list-div my-2">
                <tr>
                  <td className="h5 pe-3">Location of Idol : </td>
                  <td> {idolData.placeOfInstallation}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <table className="idol-form-content-innerbox">
          <tr>
            <td className="h5 pe-5">Type Of Installer :</td>
            <td>{idolData.typeOfInstaller}</td>
          </tr>
          {idolData.typeOfInstaller === "organization" && (
            <tr>
              <td className="h5 pe-5">Organization Name</td>
              <td>{idolData.organizationName}</td>
            </tr>
          )}
          <tr className="my-3">
            <td className="h5 pe-5">Date of Installation : </td>
            <td>{new Date(idolData.setupDate).toLocaleDateString()}</td>
          </tr>
        </table>
        <table className="idol-form-content-innerbox">
          <tr>
            <td className="h5 pe-5">Height : </td>
            <td>{idolData.height}</td>
          </tr>
        </table>
        <table className="idol-form-content-innerbox my-3">
          <tr>
            <td className="h5 pe-5">Date of Immersion : </td>
            <td> {new Date(idolData.immersionDate).toLocaleDateString()}</td>
          </tr>
        </table>

        <div className="idol-form-content-table my-5">
          <p className="h2 my-3">Place/Properties</p>
          <table className="table table-light table-striped table-bordered my-4">
            <tbody>
              <tr className="text-center">
                <td className="h5">Type</td>
                <td>{idolData.property.type}</td>
              </tr>
              <tr className="text-center">
                <td className="h5">description</td>
                <td>{idolData.property.description}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="idol-form-content-table my-5">
          <p className="h2 my-3">Shed Type</p>
          <table className="table table-light table-striped table-bordered my-4">
            <tbody>
              <tr className="text-center">
                <td className="h5">Type</td>
                <td>{idolData.shed.type}</td>
              </tr>

              <tr className="text-center">
                <td className="h5">Description</td>
                <td>{idolData.shed.description}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="idol-form-content-table my-5">
          <p className="h2 my-3">License/Permissions/Facility</p>
          <table className="table table-light table-striped table-bordered my-4">
            <tbody>
              <tr className="text-center">
                <td className="h5">License</td>
                <td>{idolData.licence ? "YES" : "NO"}</td>
              </tr>

              <tr className="text-center">
                <td className="h5">Police Permission</td>
                <td>{idolData.permission.police ? "YES" : "NO"}</td>
              </tr>

              <tr className="text-center">
                <td className="h5">Fire Service Permission</td>
                <td>{idolData.permission.fireService ? "YES" : "NO"}</td>
              </tr>

              <tr className="text-center">
                <td className="h5">TNEB Permission</td>
                <td>{idolData.permission.TNEB ? "YES" : "NO"}</td>
              </tr>

              <tr className="text-center">
                <td className="h5">Electrical Equipment</td>
                <td>{idolData.facility.electricalEquipment ? "YES" : "NO"}</td>
              </tr>

              <tr className="text-center">
                <td className="h5">Lighting Facility</td>
                <td>{idolData.facility.lightingFacility ? "YES" : "NO"}</td>
              </tr>

              <tr className="text-center">
                <td className="h5">CCTV Facility</td>
                <td>{idolData.facility.CCTVFacility ? "YES" : "NO"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="idol-form-content-table my-5">
          <p className="h2 my-3">Volunteer Details</p>
          <div className="table-responsive-lg">
            <table className="table table-light table-striped table-bordered my-4">
              <thead>
                <tr className="text-center">
                  <th>Volunteer No</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Mobile No</th>
                </tr>
              </thead>
              <tbody>
                {idolData.volunteers.map((volunteer, index) => (
                  <tr key={index} className="text-center">
                    <td>{index + 1}</td>
                    <td>{volunteer.name}</td>
                    <td>{volunteer.address}</td>
                    <td>{volunteer.mobileNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="idol-form-content-table my-5">
          <p className="h2 my-3">Transportation Details</p>
          <table className="table table-light table-striped table-bordered my-4">
            <tbody>
              <tr className="text-center">
                <td className="h5">Driver Name</td>
                <td>{idolData.modeOfTransport.driverName}</td>
              </tr>

              <tr className="text-center">
                <td className="h5">Driver License</td>
                <td>{idolData.modeOfTransport.driverLicense}</td>
              </tr>

              <tr className="text-center">
                <td className="h5">Vehicle Type</td>
                <td>{idolData.modeOfTransport.vehicleType}</td>
              </tr>

              <tr className="text-center">
                <td className="h5">Vehicle Description</td>
                <td>{idolData.modeOfTransport.vehicleDescription}</td>
              </tr>

              <tr className="text-center">
                <td className="h5">Procession By</td>
                <td>{idolData.processionBy}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="idol-form-content-table my-5">
          <p className="h2 my-3">Sensitivity </p>
          <table className="table table-light table-striped table-bordered my-4">
            <tbody>
              <tr className="text-center">
                <td className="h5">Route Sensitivity</td>
                <td>{idolData.sensitivity}</td>
              </tr>

              <tr className="text-center">
                <td className="h5">
                  Presence of Mosque/Church in Procession Route
                </td>
                <td>{idolData.isChruchMosque ? "YES" : "NO"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="idol-form-content-table my-5">
          <p className="h2 my-3">Route </p>
          <table className="table table-light table-striped table-bordered my-4">
            <tbody>
              <tr className="text-center">
                <td className="h5">Starting Point</td>
                <td>{idolData.placeOfInstallation}</td>
              </tr>
              <tr className="text-center">
                <td className="h5">Default Junction</td>{" "}
                <td>{idolData?.startJunctionPoint?.place}</td>
              </tr>

              <tr className="text-center">
                <td className="h5">Intermediate Junctions</td>
                <td>
                  {idolData.intermediateJunctionPoints
                    .map((data) => data.place)
                    .join("-")}
                </td>
              </tr>
              <tr className="text-center">
                <td className="h5">Place of Immersion</td>
                <td>{idolData?.placeOfImmersion}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="idol-form-content-table my-5">
          <p className="h2 my-3">Immersion-Safety Measures</p>
          <table className="table table-light table-striped table-bordered my-4">
            <tbody>
              <tr className="text-center">
                <td className="h5">Barricade</td>
                <td>{idolData.immersionSafety.barricade ? "YES" : "NO"}</td>
              </tr>

              <tr className="text-center">
                <td className="h5">Lighting Facility</td>
                <td>{idolData.immersionSafety.lighting ? "YES" : "NO"}</td>
              </tr>

              <tr className="text-center">
                <td className="h5">Safety Measures by Fire Service</td>
                <td>
                  {idolData.immersionSafety.safetyByFireService ? "YES" : "NO"}
                </td>
              </tr>
              <tr className="text-center">
                <td className="h5">PA System</td>
                <td>{idolData.immersionSafety.PASystem ? "YES" : "NO"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="view-form-btn text-center">
          <a href={idolData.idolApplication} className="">
            <button className="btn btn-dark py-2 px-4 my-3">
              View Applicant Form
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};
