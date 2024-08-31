import React from "react";

const StatusBarList = ({ data }) => {
  console.log(data);

  return (
    <div
      className="container mt-4 d-flex align-items-center"
      style={{ height: "30vh" }}
    >
          <div className="table-responsive-lg">
      <table className="table table-dark table-striped table-hover table-bordered text-center align-middle">
        <thead>
          <tr>
            <td>total idols</td>
            <td>Immersed idols</td>
            <td>Non Immersed idols</td>
            <td>Private idols</td>
            <td>Public idols</td>
            <td>Organization idols</td>
            <td>Sensitive idols</td>
            <td>Non Sensitive idols</td>
            <td>Hyper Sensitive idols</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data[0]}</td>
            <td>{data[1]}</td>
            <td>{data[2]}</td>
            <td>{data[3]}</td>
            <td>{data[4]}</td>
            <td>{data[5]}</td>
            <td>{data[6]}</td>
            <td>{data[7]}</td>
            <td>{data[8]}</td>
          </tr>
        </tbody>
      </table>
    </div></div>
  );
};

export default StatusBarList;
