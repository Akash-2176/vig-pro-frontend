import { useState } from "react";

export default function IGDashboard() {
  const [IG, setIG] = useState(JSON.parse(localStorage.getItem("ig")));
  console.log();

  return (
    <div>
      <h2>Welcome to IG</h2>
      <p>{IG.igID}</p>
    </div>
  );
}
