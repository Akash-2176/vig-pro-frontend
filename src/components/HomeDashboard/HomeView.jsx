import card1Image from "/viewlistnew.png";
import card2Image from "/mapimg.png";
import card3Image from "/registration_img.png";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import OverAllStatsPopup from "../stats/overAllStatsPopup/OverAllStatsPopup";

const HomeView = ({ setDashview, stats }) => {
  let currentStats = null;
  useEffect(() => {
    currentStats = stats;
    console.log(currentStats);
  }, [stats]);
  const [showModal, setShowModal] = useState(false);
  const handleCardClick = (cardNumber) => {
    if (cardNumber === 1) setDashview("dashboardlist");
    if (cardNumber === 2) setDashview("dashboardmap");
    if (cardNumber === 3) setDashview("dashstatslist");
    // if (cardNumber === 3) setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);
  return (
    <div className="card-div row d-flex justify-content-evenly">
      <div
        className="card col-sm-12 col-md-4 col-lg-3 my-4 mx-3"
        onClick={() => handleCardClick(3)}
      >
        <div className="card-body text-start">
          <p className="card-title h3">Registration Count</p>
        </div>
        <img src={card3Image} alt="Card 3" />
        <div className="card-content mt-5">
          <p>
            Total number of idols registered<br></br>
            Number of idols immersed<br></br>
            Number of idols not immersed
          </p>
        </div>
      </div>
      <div
        className="card col-sm-12 col-md-4 col-lg-3 my-4 mx-3"
        onClick={() => handleCardClick(1)}
      >
        <span className="card-body">
          <span className="h3 card-title">View List</span>
        </span>
        <img src={card1Image} alt="Card 1" />
        <p className="card-content mt-5">
          This list includes all the Lord Ganesh idols that have been registered
          for the festival, along with the name of the applicants.{" "}
        </p>
      </div>
      <div
        className="card col-sm-12 col-md-4 col-lg-3 my-4 mx-3"
        onClick={() => handleCardClick(2)}
      >
        <span className="card-body">
          <span className="h3 card-title">Map</span>
        </span>
        <img src={card2Image} alt="Card 2" />
        <p className="card-content mt-5">
          give me a content for displaying list for vinayagar chadurthi
          registered list of idols and applicantsas paragraph
        </p>
      </div>

      <Footer />
      {/* 
      {showModal && (
        <OverAllStatsPopup
          stats={stats}
          showModal={showModal}
          onClose={() => setShowModal(false)}
        />
      )} */}
    </div>
  );
};

export default HomeView;
