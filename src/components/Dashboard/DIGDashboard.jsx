import React, { useState } from "react";
import { useLocation } from "react-router-dom";

export default function DIGDashboard() {
  const location = useLocation();
  const DIGObj = location.state.dig;
  const [DIG, setDIG] = useState(DIGObj);

  return (
    <div>
      <h2>Welcome to DIG</h2>
      <p></p>
    </div>
  );
}
