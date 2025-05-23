// components/ProtectedRoute.js
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/customer/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
