import card1Image from "/List-Picture.png";
import card2Image from "/Map-Picture.png";
import card3Image from "/Reg-Picture.png";
import Footer from "./Footer";
const HomeView = ({ setDashview }) => {
  const handleCardClick = (cardNumber) => {
    if (cardNumber === 1) setDashview("dashboardlist");
    if (cardNumber === 2) setDashview("dashboardmap");
  };
  return (
    <div className="card-div row d-flex justify-content-evenly">
      <div
        className="card col-sm-12 col-md-4 col-lg-3 my-4 mx-3"
        onClick={() => handleCardClick(1)}
      >
        <span className="card-body">
          <span className="h3 card-title">View List</span>
        </span>
        <img src={card1Image} alt="Card 1" />
        <p className="card-content mt-5">Entire list of idols and applicants</p>
      </div>
      <div
        className="card col-sm-12 col-md-4 col-lg-3 my-4 mx-3"
        onClick={() => handleCardClick(2)}
      >
        <span className="card-body">
          <span className="h3 card-title">Map</span>
        </span>
        <img src={card2Image} alt="Card 1" />
        <p className="card-content mt-5">Location of idols and tracking</p>
      </div>
      <div
        className="card col-sm-12 col-md-4 col-lg-3 my-4 mx-3 "
        onClick={() => handleCardClick(3)}
      >
        <div className="card-body text-start">
          <p className="card-title h3">Registration Count</p>
        </div>
        <img src={card3Image} alt="Card 3" />
        <div className="card-content mt-5">
          <p>Total number of idols registered:</p>
          <p>Number of idols immersed:</p>
          <p>Number of idols not immersed:</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomeView;
