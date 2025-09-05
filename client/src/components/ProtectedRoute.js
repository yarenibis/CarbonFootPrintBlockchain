import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Eğer requiredRole belirtilmişse ve kullanıcının rolü uymuyorsa
  if (requiredRole && user.role !== requiredRole) {
    // Admin rolü gerektiren bir sayfaya erişmeye çalışan normal kullanıcıyı dashboard'a yönlendir
    return <Navigate to="/dashboard" replace />;
  }

  // Eğer admin dashboard'una erişmek isteyen admin ise
  if (user.role === "admin" && window.location.pathname === "/admin-dashboard") {
    return children;
  }

  // Normal kullanıcı dashboard'una erişmek isteyen normal kullanıcı ise
  if (user.role === "user" && window.location.pathname === "/dashboard") {
    return children;
  }

  // Diğer durumlarda kullanıcıyı rolüne göre yönlendir
  return <Navigate to={user.role === "admin" ? "/admin-dashboard" : "/dashboard"} replace />;
};

export default ProtectedRoute;