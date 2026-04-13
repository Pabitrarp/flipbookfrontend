import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  
  const admin = localStorage.getItem("admin");
  console.log(admin);
  if (admin!= "69d26f0b993292c977ee58bb") {
     return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
