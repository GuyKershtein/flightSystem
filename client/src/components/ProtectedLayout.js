import { Link, Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppBar } from "./AppBar";

export const ProtectedLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to="/" />;
  } else if (user.role === 'admin') {
    return <Navigate to="/admin/users" replace />;
  }

  return (
    <div>
      <AppBar
        pages={[
          { label: "Search", path: "search" }
        ]}
      />
      {outlet}
    </div>
  );
};
