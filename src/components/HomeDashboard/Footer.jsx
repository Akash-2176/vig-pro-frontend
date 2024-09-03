import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./footer.css";
const Footer = () => {
  return (
    <footer class="contact-section mt-4 vw-100">
      <div class="container mt-2">
        <p className="h3 text-center">Support</p>
        <div class="mt-2 d-flex contact-details  justify-content-evenly ">
          <div class="contact-inner-details col-md-3">
            <p class="h5 mt-2">Contact:</p>
            <div className="contact-details-number mt-3 ms-5 h6">
              <p className="me-4">Akash - 7305594291</p>
              <p>Surendhar - 8248309218</p>
              <p className="me-4">Kavin - 9080802151</p>
              <p>Deepan - 9442479225</p>
              <p className="me-4">Sabarish - 7010661497</p>
              <p>Rilwan - 7339547680</p>
            </div>
          </div>

          <div class=" contact-inner-details col-md-3">
            <p class=" h5 mt-2">Email:</p>
            <div className="mt-3 ms-5">
              <p>
                <a
                  href="mailto:tnpoliceproject2024@gmail.com"
                  className="text-danger h6 email-support"
                >
                  tnpoliceproject2024@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
