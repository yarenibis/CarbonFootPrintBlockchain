import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const [blocks, setBlocks] = useState([]);
  const [validationResult, setValidationResult] = useState(null); // 🔍 Zincir doğruluğu sonucu
  const { user } = useAuth();

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await axios.get("http://localhost:8000/admin/chain", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBlocks(res.data.blocks);
      } catch (err) {
        console.error("Admin veri çekme hatası:", err);
      }
    };

    if (user?.role === "admin") {
      fetchBlocks();
    }
  }, [user]);

  // ✅ Zincir doğrulama butonu işlemi
  const handleValidateChain = async () => {
    try {
      const res = await axios.get("http://localhost:8000/validate_chain", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setValidationResult(res.data);
    } catch (err) {
      console.error("Zincir doğrulama hatası:", err);
      setValidationResult({ valid: false, message: "Doğrulama başarısız." });
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>
      <h2 style={styles.subtitle}>Tüm Bloklar</h2>

      {/* ✅ Zinciri Doğrula Butonu */}
      <button onClick={handleValidateChain} style={styles.validateButton}>
        ⛓ Zinciri Doğrula
      </button>

      {/* ✅ Sonuç mesajı */}
      {validationResult && (
        <p style={{ color: validationResult.valid ? "green" : "red", marginTop: "0.5rem" }}>
          {validationResult.valid
            ? "✅ Zincir sağlam."
            : `❌ Zincir bozuk! Blok #${validationResult.broken_at} – ${validationResult.reason}`}
        </p>
      )}

      <div style={styles.grid}>
        {blocks.map((block) => (
          <div key={block.id} style={styles.card}>
            <p><strong>Blok ID:</strong> {block.id}</p>
            <p><strong>Kullanıcı:</strong> {block.user_id}</p>
            <p><strong>Aktivite:</strong> {block.activity || "Belirtilmemiş"}</p>
            <p><strong>Konum:</strong> {block.location || "Belirtilmemiş"}</p>
            <p><strong>Karbon Ayak İzi:</strong> {block.carbon_footprint_kg || 0} kg</p>
            <p><strong>Tarih:</strong> {new Date(block.timestamp).toLocaleString()}</p>
            <p><strong>Hash:</strong> {block.block_hash?.substring(0, 16)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#333",
  },
  subtitle: {
    fontSize: "1.3rem",
    marginBottom: "1rem",
    color: "#555",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1rem",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "1rem",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
  },
  validateButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "1rem"
  }
};

export default AdminDashboard;
