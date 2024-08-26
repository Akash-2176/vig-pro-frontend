import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Footer = () => {
  return (
    <footer class="contact-section mt-4">
      <div class="container mt-2 mb-3">
        <p className="h3 text-center">Support</p>
        <div class="mt-2 d-flex  justify-content-evenly row">
          <div class="col-md-3">
            <p class="h5 mt-2">Contact:</p>
            <div className="mt-3 ms-5">
              <p>+91 9999999999</p>
              <p>+91 9999999999</p>
            </div>
          </div>

          <div class="col-md-3">
            <p class=" h5 mt-2">Email:</p>
            <div className="mt-3 ms-5">
              <p>
                <a
                  href="mailto:tnpoliceproject2024@gmail.com"
                  className="text-danger h5"
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
