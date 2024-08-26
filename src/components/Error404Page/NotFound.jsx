import React from "react";
import errorImg from "/404img.png";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="bg-light d-flex justify-content-center align-items-center flex-column vh-100">
      <img src={errorImg} height="500px" alt="404" />
      <p className="h1 display-4 fw-bold">Uh-oh! 404 error</p>
      <p className="h5 mt-3  text-danger">We can't find that page.</p>
      <button href="#" className="mt-2 btn btn-success btn-lg">
        Go Back Home
      </button>
    </div>
  );
}
