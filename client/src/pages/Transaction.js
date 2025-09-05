import React, { useState } from "react";
import axios from "axios";

function Transaction() {
  const [activity, setActivity] = useState("");
  const [carbonFootprint, setCarbonFootprint] = useState("");
  const [location, setLocation] = useState("");

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const transactionData = {
        activity,
        carbon_footprint_kg: carbonFootprint,
        location,
      };
      await axios.post("http://localhost:8000/add_transaction", transactionData, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add Transaction</h2>
      <form onSubmit={handleAddTransaction}>
        <input
          type="text"
          placeholder="Activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        />
        <input
          type="number"
          placeholder="Carbon Footprint (kg)"
          value={carbonFootprint}
          onChange={(e) => setCarbonFootprint(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Add Transaction</button>
      </form>
    </div>
  );
}

export default Transaction;
