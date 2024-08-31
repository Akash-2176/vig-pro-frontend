import React from "react";
import "./overallstatspopup_style.css";

export default function OverAllStatsPopup({ stats, showModal, onClose }) {
  return (
    <div
      id="registration-popup-container"
      className={`modal fade show`}
      tabIndex="-1"
      style={{ display: showModal ? "block" : "none" }}
      aria-labelledby="modalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalLabel">
              Registration Details
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p className=" mb-2">
              Total no of Registration :
              <strong>{stats?.totalRegistered || "0"}</strong>
            </p>
            <p className="mb-2">
              Total no of Immersed Idols :
              <strong>{stats?.totalImmersed || "0"}</strong>
            </p>
            <p className="mb-3">
              Total no of Not Immersed Idols :{" "}
              <strong>{stats?.totalNotImmersed || "0"}</strong>
            </p>
            <div className="table-responsive-sm">
            <table className="table table-bordered table-light table-striped">
              <thead className="align-middle">
                <tr>
                  <th>Category</th>
                  <th>Total No of Idols Registered</th>
                  <th>Total No of Idols Immersed </th>
                  <th>Total No of Idols Not Immersed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sensitive</td>
                  <td className="table-total-number">
                    {stats?.Sensitive?.totalRegistered || "0"}
                  </td>
                  <td className="table-total-number">
                    {stats?.Sensitive?.totalImmersed || "0"}
                  </td>
                  <td className="table-total-number">
                    {stats?.Sensitive?.totalNotImmersed || "0"}
                  </td>
                </tr>
                <tr>
                  <td>Non Sensitive</td>
                  <td className="table-total-number">
                    {stats?.Nonsensitive?.totalRegistered || "0"}
                  </td>
                  <td className="table-total-number">
                    {stats?.Nonsensitive?.totalImmersed || "0"}
                  </td>
                  <td className="table-total-number">
                    {stats?.Nonsensitive?.totalNotImmersed || "0"}
                  </td>
                </tr>
                <tr>
                  <td>Hyper-Sensitive</td>

                  <td className="table-total-number">
                    {stats["Hyper-Sensitive"]?.totalRegistered || "0"}
                  </td>
                  <td className="table-total-number">
                    {stats["Hyper-Sensitive"]?.totalImmersed || "0"}
                  </td>
                  <td className="table-total-number">
                    {stats["Hyper-Sensitive"]?.totalNotImmersed || "0"}
                  </td>
                </tr>
                <tr>
                  <td>Private Idols</td>
                  <td className="table-total-number">
                    {stats?.Private?.totalRegistered || "0"}
                  </td>
                  <td className="table-total-number">
                    {stats?.Private?.totalImmersed || "0"}
                  </td>
                  <td className="table-total-number">
                    {stats?.Private?.totalNotImmersed || "0"}
                  </td>
                </tr>
                <tr>
                  <td>Public Idols</td>
                  <td className="table-total-number">
                    {stats?.Public?.totalRegistered || "0"}
                  </td>
                  <td className="table-total-number">
                    {stats?.Public?.totalImmersed || "0"}
                  </td>
                  <td className="table-total-number">
                    {stats?.Public?.totalNotImmersed || "0"}
                  </td>
                </tr>
                <tr>
                  <td>Organizational Idols</td>
                  <td className="table-total-number">
                    {stats?.Organization?.totalRegistered || "0"}
                  </td>
                  <td className="table-total-number">
                    {stats?.Organization?.totalImmersed || "0"}
                  </td>
                  <td className="table-total-number">
                    {stats?.Organization?.totalNotImmersed || "0"}
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
