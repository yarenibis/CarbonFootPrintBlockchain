import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Axios global config
  axios.defaults.baseURL = "http://localhost:8000";
  axios.defaults.withCredentials = false;

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      // Token'dan kullanıcı bilgilerini çözümle
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        username: payload.sub,
        role: payload.role || "user"
      });
    } catch (err) {
      console.error("Kullanıcı bilgisi alınamadı:", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);



  const login = async (username, password) => {
  try {
    const response = await axios.post("/login", { //Kullanıcıdan username ve password alınır login API'sine gönderilir
      username,
      password
    });

    const token = response.data.access_token; //gelen token alınır çözümlenir
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; //sonraki tüm isteklerde otomatik olarak token eklensin

    const payload = JSON.parse(atob(token.split('.')[1])); //token'da kullanıcı bilgilerini çöz
    console.log("Token payload:", payload); 

    const userData = {  
      username: payload.sub,
      role: payload.role || "user"
    };

    setUser(userData); //kullanıcıyı state içine kaydet

    return { success: true, user: userData };
  } catch (err) {
    return {
      success: false,
      error: "Login failed"
    };
  }
};




  const register = async (username, password, isAdmin = false) => {
    try {
      await axios.post("/register", {
        username,
        password,
        is_admin: isAdmin
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true };
    } catch (err) {
      console.error("Kayıt hatası:", err.response?.data);
      return { 
        success: false, 
        error: err.response?.data?.detail || "Kayıt başarısız" 
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: () => user?.role === "admin",
    axiosInstance: axios
  };

  // AuthContext'in sonunda loading kontrolünü kaldırın:
return (
  <AuthContext.Provider value={value}>
    {children} {/* Artık loading kontrolü yapmıyoruz */}
  </AuthContext.Provider>
);
}

export const useAuth = () => useContext(AuthContext);