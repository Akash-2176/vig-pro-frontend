import React, { useEffect, useMemo, useState } from "react";

const processData = (idolsByLocationAndOrg, Organizations) => {
  return Object.keys(idolsByLocationAndOrg).map((location) => {
    const parties = Organizations.reduce((acc, org) => {
      acc[org] = idolsByLocationAndOrg[location][org]?.length || 0;
      return acc;
    }, {});
    const totalCount = Object.values(parties).reduce(
      (sum, count) => sum + count,
      0
    );

    return {
      location,
      parties,
      totalCount,
    };
  });
};

export default function DSPMainDashboard({ DSP, onBackNav }) {
  const filteredData = useMemo(() => {
    return DSP.stationIds.flatMap((station) =>
      station.stationIdol.map((idol) => ({
        ...idol,
        stationLocation: station.stationLocation,
        stationDivision: station.stationDivision,
      }))
    );
  }, [DSP]);

  const Locations = Array.from(
    new Set(filteredData.map((e) => e.stationLocation))
  );

  const [immersionData, setImmersionData] = useState([]);

  const [filter, setFilter] = useState("Namakkal");

  useEffect(() => {
    const formatImmersionData = (data) => {
      const immersionDataMap = {};

      data.forEach((entry) => {
        const date = new Date(entry.immersionDate).toISOString().split("T")[0];
        const place = entry.stationLocation;
        const typeOfInstaller = entry.typeOfInstaller;

        const key = `${date}_${place}`;

        if (!immersionDataMap[key]) {
          immersionDataMap[key] = { date, place, pub: 0, org: 0, pvt: 0 };
        }

        if (typeOfInstaller === "public") {
          immersionDataMap[key].pub += 1;
        } else if (typeOfInstaller === "organization") {
          immersionDataMap[key].org += 1;
        } else if (typeOfInstaller === "private") {
          immersionDataMap[key].pvt += 1;
        }
      });

      return Object.values(immersionDataMap);
    };

    setImmersionData(formatImmersionData(filteredData));
  }, [filteredData]);

  const uniqueDates = [...new Set(immersionData.map((row) => row.date))];

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
  };

  const filteredResults = immersionData.filter((row) => row.place === filter);

  const idolsByLocationAndOrg = filteredData.reduce((acc, idol) => {
    if (idol.typeOfInstaller === "organization") {
      const location = idol.stationLocation;
      const orgName = idol.organizationName;

      if (!acc[location]) {
        acc[location] = {};
      }

      if (!acc[location][orgName]) {
        acc[location][orgName] = [];
      }

      acc[location][orgName].push(idol);
    }

    return acc;
  }, {});

  const partyWiseDivisions = Object.keys(idolsByLocationAndOrg);
  const Organizations = [
    "HINDU MUNNANI",
    "IMK-TN",
    "RSS",
    "VHP(AI)",
    "ABHMS(T.B)",
    "IMK & Hanuman sena (S.V.Sridhar)",
    "Hindu Iyakka pervai",
    "Siva sena",
    "Yuva sena",
    "BJP",
    "VBMK",
    "Om anmiga peravai",
    "sri Ram Sena",
    "VVP",
    "Agila bharath Siva Ruthra sena",
    "AIIMK",
    "Desiya Sindanai peravai",
    "Public & Fishermen",
  ];

  const processedData = processData(idolsByLocationAndOrg, Organizations);

  const registrationCount = {
    Sensitive: {
      totalRegistered: 0,
      totalImmersed: 0,
      totalNotImmersed: 0,
      public: 0,
      private: 0,
      organization: 0,
    },
    Nonsensitive: {
      totalRegistered: 0,
      totalImmersed: 0,
      totalNotImmersed: 0,
      public: 0,
      private: 0,
      organization: 0,
    },
    "Hyper-Sensitive": {
      totalRegistered: 0,
      totalImmersed: 0,
      totalNotImmersed: 0,
      public: 0,
      private: 0,
      organization: 0,
    },
    total: {
      totalRegistered: 0,
      totalImmersed: 0,
      totalNotImmersed: 0,
      public: 0,
      private: 0,
      organization: 0,
    },
  };

  filteredData.forEach((idol) => {
    const { sensitivity, isImmersed, typeOfInstaller } = idol;

    const category = sensitivity;

    if (registrationCount[category]) {
      registrationCount[category].totalRegistered++;
      registrationCount.total.totalRegistered++;

      if (isImmersed) {
        registrationCount[category].totalImmersed++;
        registrationCount.total.totalImmersed++;
      } else {
        registrationCount[category].totalNotImmersed++;
        registrationCount.total.totalNotImmersed++;
      }

      const installerType = typeOfInstaller?.toLowerCase();
      if (registrationCount[category][installerType] !== undefined) {
        registrationCount[category][installerType]++;
        registrationCount.total[installerType]++;
      }
    }
  });

  const tableData = [
    {
      category: "Total Registered",
      sensitive: registrationCount.Sensitive.totalRegistered,
      nonSensitive: registrationCount.Nonsensitive.totalRegistered,
      hyperSensitive: registrationCount["Hyper-Sensitive"].totalRegistered,
      total: registrationCount.total.totalRegistered,
    },
    {
      category: "Total Immersed",
      sensitive: registrationCount.Sensitive.totalImmersed,
      nonSensitive: registrationCount.Nonsensitive.totalImmersed,
      hyperSensitive: registrationCount["Hyper-Sensitive"].totalImmersed,
      total: registrationCount.total.totalImmersed,
    },
    {
      category: "Total Not Immersed",
      sensitive: registrationCount.Sensitive.totalNotImmersed,
      nonSensitive: registrationCount.Nonsensitive.totalNotImmersed,
      hyperSensitive: registrationCount["Hyper-Sensitive"].totalNotImmersed,
      total: registrationCount.total.totalNotImmersed,
    },
    {
      category: "Public",
      sensitive: registrationCount.Sensitive.public,
      nonSensitive: registrationCount.Nonsensitive.public,
      hyperSensitive: registrationCount["Hyper-Sensitive"].public,
      total: registrationCount.total.public,
    },
    {
      category: "Private",
      sensitive: registrationCount.Sensitive.private,
      nonSensitive: registrationCount.Nonsensitive.private,
      hyperSensitive: registrationCount["Hyper-Sensitive"].private,
      total: registrationCount.total.private,
    },
  ];

  let formattedDate = "";

  return (
    <div>
      <div className="text-end mt-3 me-3">
        <button
          className="btn btn-success text-light fs-5 ms-2 me-2"
          onClick={onBackNav}
        >
          Back
        </button>
      </div>

      <div className="mb-3">
        <p className="text-center h1 my-3">Datewise Immersion Count</p>
        <div className="form-group mx-4">
          <label htmlFor="filterDropdown" className="form-label h5">
            Select the station:
          </label>
          <select
            id="filterDropdown"
            className="form-select border-black"
            value={filter}
            onChange={handleFilterChange}
          >
            {Locations.map((e) => (
              <option value={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive-xxl mx-4">
        <table className="table table-sm table-bordered border-dark table-hover table-striped table-light text-center">
          <thead className="align-middle">
            <tr>
              <th rowSpan="2">S.No</th>
              <th rowSpan="2">Date</th>
              <th colSpan="3">{filter}</th>
              <th colSpan="3">Total count of idols in all stations</th>
              <th rowSpan="2">Total Idols</th>
            </tr>
            <tr>
              <th>Private</th>
              <th>Public</th>
              <th>Organization</th>
              <th>Private</th>
              <th>Public</th>
              <th>Organization</th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {uniqueDates.map((date, index) => {
              const rowData = immersionData.find(
                (row) => row.date === date && row.place === filter
              );
              const totalPublic = immersionData
                .filter((row) => row.date === date)
                .reduce((total, current) => total + current.pub, 0);

              const totalOrg = immersionData
                .filter((row) => row.date === date)
                .reduce((total, current) => total + current.org, 0);

              const totalpvt = immersionData
                .filter((row) => row.date === date)
                .reduce((total, current) => total + current.pvt, 0);

              const totalSum = totalPublic + totalOrg + totalpvt;

              return (
                <tr key={index}>
                  <td>{index + 1}.</td>
                  <td>{date}</td>
                  <td>{rowData?.pvt ?? 0}</td>
                  <td>{rowData?.pub ?? 0}</td>
                  <td>{rowData?.org ?? 0}</td>
                  <td>{totalpvt}</td>
                  <td>{totalPublic}</td>
                  <td>{totalOrg}</td>
                  <td>{totalSum}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div>
        <p className="h1 my-5">Party-wise Installation Details</p>
        <div className="table-responsive-xxl mx-5">
          <table className="table table-sm table-bordered border-dark table-hover table-striped table-light text-center">
            <thead className="align-middle">
              <tr>
                <th rowSpan="2">Division</th>
                <th colSpan={Organizations.length}>
                  Party-wise/Organization/Public
                </th>
                <th rowSpan="2">Total Count of Idols</th>
              </tr>
              <tr>
                {Organizations.map((party) => (
                  <th key={party}>{party}</th>
                ))}
              </tr>
            </thead>
            <tbody className="align-middle">
              {processedData.map((row, index) => (
                <tr key={index}>
                  <td>{row.location}</td>
                  {Organizations.map((party) => (
                    <td key={party}>{row.parties[party] || 0}</td>
                  ))}
                  <td>{row.totalCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <p className="h1 my-5">Registration count</p>
        <div className="table-responsive-xxl m-5">
          <table className="table table-sm table-bordered border-dark table-hover table-striped table-light text-center">
            <thead className="align-middle">
              <tr>
                <th>Category</th>
                <th>Non-sensitive</th>
                <th>Sensitive</th>
                <th>Hyper-sensitive</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.category}</td>
                  <td>{row.nonSensitive}</td>
                  <td>{row.sensitive}</td>
                  <td>{row.hyperSensitive}</td>
                  <td>{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
