import React from "react";

const calculateTotalCounts = (entry) => {
  return {
    public: entry.public.length,
    private: entry.private.length,
    organization: entry.organization.length,
  };
};

const aggregateDataByDateAndDivision = (filteredData) => {
  const dataByDateAndDivision = [];

  filteredData.forEach((idol) => {
    const {
      stationDivision: division,
      typeOfInstaller: type,
      immersionDate,
    } = idol;

    let dateEntry = dataByDateAndDivision.find(
      (entry) => entry.date === immersionDate && entry.division === division
    );

    if (!dateEntry) {
      dateEntry = {
        date: immersionDate,
        division,
        public: [],
        private: [],
        organization: [],
      };
      dataByDateAndDivision.push(dateEntry);
    }

    if (type === "public") {
      dateEntry.public.push(idol);
    } else if (type === "private") {
      dateEntry.private.push(idol);
    } else if (type === "organization") {
      dateEntry.organization.push(idol);
    }
  });

  return dataByDateAndDivision;
};

const processData = (idolsByDivisionAndOrg, Organizations) => {
  return Object.keys(idolsByDivisionAndOrg).map((division) => {
    const parties = Organizations.reduce((acc, org) => {
      acc[org] = idolsByDivisionAndOrg[division][org]?.length || 0;
      return acc;
    }, {});
    const totalCount = Object.values(parties).reduce(
      (sum, count) => sum + count,
      0
    );

    return {
      division,
      parties,
      totalCount,
    };
  });
};

export default function SPMainDashboard({ SP, onBackNav }) {
  let filteredData = SP.dspIds.flatMap((dsp) =>
    dsp.stationIds.flatMap((station) =>
      station.stationIdol.map((idol) => ({
        ...idol,
        stationLocation: station.stationLocation,
        stationDivision: station.stationDivision,
      }))
    )
  );

  const aggregatedData = aggregateDataByDateAndDivision(filteredData);
  const dates = [...new Set(aggregatedData.map((entry) => entry.date))];
  const divisions = [...new Set(aggregatedData.map((entry) => entry.division))];

  const idolsByDivisionAndOrg = filteredData.reduce((acc, idol) => {
    if (idol.typeOfInstaller === "organization") {
      const division = idol.stationDivision;
      const orgName = idol.organizationName;

      if (!acc[division]) {
        acc[division] = {};
      }

      if (!acc[division][orgName]) {
        acc[division][orgName] = [];
      }

      acc[division][orgName].push(idol);
    }

    return acc;
  }, {});
  console.log(idolsByDivisionAndOrg);

  const partyWiseDivisions = Object.keys(idolsByDivisionAndOrg);
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

  const processedData = processData(idolsByDivisionAndOrg, Organizations);

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
      <div>
        <p className="h1 my-5">Date Wise Immersion Count</p>
        <div className="table-responsive-xxl m-5">
          <table className="table table-sm table-bordered border-dark table-hover table-striped table-light">
            <thead>
              <tr>
                <th className="align-middle" rowSpan="2">
                  S.No
                </th>
                <th className="align-middle" rowSpan="2">
                  Date
                </th>
                {divisions.map((division, index) => (
                  <React.Fragment key={index}>
                    <th colSpan="3">{division}</th>
                  </React.Fragment>
                ))}
                <th className="align-middle" rowSpan="2">
                  Total
                </th>
              </tr>
              <tr>
                {divisions.map((division, index) => (
                  <React.Fragment key={index}>
                    <th>Public</th>
                    <th>Private</th>
                    <th>Organization</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {dates.map((date, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {
                      (formattedDate = date
                        ?.slice(0, -14)
                        .split("-")
                        .reverse()
                        .join("-"))
                    }
                  </td>
                  {divisions.map((division) => {
                    const entry = aggregatedData.find(
                      (e) => e.date === date && e.division === division
                    );
                    const counts = entry
                      ? calculateTotalCounts(entry)
                      : { public: 0, private: 0, organization: 0 };
                    return (
                      <React.Fragment key={division}>
                        <td>{counts.public}</td>
                        <td>{counts.private}</td>
                        <td>{counts.organization}</td>
                      </React.Fragment>
                    );
                  })}
                  <td>
                    {divisions.reduce((total, division) => {
                      const entry = aggregatedData.find(
                        (e) => e.date === date && e.division === division
                      );
                      return (
                        total +
                        (entry
                          ? calculateTotalCounts(entry).public +
                            calculateTotalCounts(entry).private +
                            calculateTotalCounts(entry).organization
                          : 0)
                      );
                    }, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <p className="h1 my-5">Party-wise Installation Details</p>
        <div className="table-responsive-xxl m-5 ">
          <table className="table table-sm table-bordered border-dark table-hover table-striped table-light">
            <thead>
              <tr>
                <th className="align-middle" rowSpan="2">
                  Division
                </th>
                <th colSpan={Organizations.length}>
                  Party-wise/Organization/Public
                </th>
                <th className="align-middle" rowSpan="2">
                  Total Count of Idols
                </th>
              </tr>
              <tr>
                {Organizations.map((party) => (
                  <th key={party}>{party}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedData.map((row, index) => (
                <tr key={index}>
                  <td>{row.division}</td>
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
          <table className="table table-sm table-bordered border-dark table-hover table-striped table-light">
            <thead>
              <tr>
                <th>Category</th>
                <th>Sensitive</th>
                <th>Non-sensitive</th>
                <th>Hyper-sensitive</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.category}</td>
                  <td>{row.sensitive}</td>
                  <td>{row.nonSensitive}</td>
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
