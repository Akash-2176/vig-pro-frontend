import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";

export default function DIGDashboard() {
  const navigate = useNavigate();

  const [DIG, setDIG] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  const [dashview, setDashview] = useState("dashboard");
  useEffect(() => {
    const storedCredentials = localStorage.getItem("digtoken");
    const credentialData = JSON.parse(storedCredentials);

    if (!storedCredentials || !credentialData) {
      navigate("/login/dig", { replace: true });
    } else {
      fetchDIGData(credentialData);
    }
  }, [navigate]);

  const fetchDIGData = async (credentialData) => {
    try {
      setShowLoading(true);
      const response = await axios.post(`${API_BASE_URL}/digs/getdig`, {
        digId: credentialData,
      });
      const updatedDIG = response.data;
      setDIG(updatedDIG);
    } catch (error) {
      console.error("Error fetching station data", error);
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <div>
      <h2>Welcome to DIG</h2>
      <p></p>
    </div>
  );
}
