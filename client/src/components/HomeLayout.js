import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppBar } from "./AppBar";

export const HomeLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/users" replace />;
    } else {
      return <Navigate to="/dashboard/search" replace />;
    }
    
  }

  return (
    <div>
      <AppBar
      />
      {outlet}
    </div>
  );
};
