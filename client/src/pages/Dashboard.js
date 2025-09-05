import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [activity, setActivity] = useState("");
  const [carbonFootprint, setCarbonFootprint] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null); //  Hata mesajı için state

  useEffect(() => { //sayfa yüklendiğinde işlemleri çek
    if (user) {
      axios
        .get("http://127.0.0.1:8000/my_transactions/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log("Gelen işlemler:", response.data.transactions);
          setTransactions(response.data.transactions || []);
        })
        .catch((error) => {
          console.error("Transaction fetch error:", error);
        });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTransaction = {
      activity,
      carbon_footprint_kg: parseFloat(carbonFootprint),
      location,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/add_transaction",
        newTransaction,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTransactions([...transactions, response.data]);
      setActivity("");
      setCarbonFootprint("");
      setLocation("");
      setError(null); //  Hata mesajını temizle

    } catch (error) {
  console.error("Error adding transaction:", error);
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (Array.isArray(detail)) {
      // Pydantic validation hatası (liste)
      setError(detail[0].msg || "Bir doğrulama hatası oluştu.");
    } else {
      // SmartContract exception (string)
      setError(detail);
    }
  } else {
    setError("Bir hata oluştu. Lütfen tekrar deneyin.");
  }
}

  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Kullanıcı Paneli</h1>
      <h2 style={styles.subtitle}>İşlemlerinizi Ekleyin</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="activity">Aktivite:</label>
          <input
            type="text"
            id="activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="carbonFootprint">Karbon Ayak İzi (kg):</label>
          <input
            type="number"
            id="carbonFootprint"
            value={carbonFootprint}
            onChange={(e) => setCarbonFootprint(e.target.value)}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="location">Konum:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <button type="submit" style={styles.submitButton}>İşlem Ekle</button>

        {/*  Hata mesajı göster */}
        {error && <p style={styles.error}>{error}</p>}
      </form>

      <h2 style={styles.subtitle}>İşlemleriniz</h2>
      {transactions.length === 0 ? (
        <p style={styles.message}>Henüz bir işlem bulunmuyor.</p>
      ) : (
        <div style={styles.grid}>
          {transactions.map((tx, index) => (
            <div key={index} style={styles.card}>
              <p><strong>Aktivite:</strong> {tx.activity}</p>
              <p><strong>Konum:</strong> {tx.location}</p>
              <p><strong>Karbon Ayak İzi:</strong> {tx.carbon_footprint_kg} kg</p>
              <p><strong>Tarih:</strong> {new Date(tx.timestamp).toLocaleString()}</p>
              <p><strong>Hash:</strong> {tx.block_hash}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#333",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "1rem",
    color: "#555",
  },
  message: {
    fontStyle: "italic",
    color: "#888",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1rem",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  form: {
    marginBottom: "2rem",
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "1rem",
  },
};

export default Dashboard;
