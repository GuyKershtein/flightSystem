import { Link, Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppBar } from "./AppBar";

export const AdminLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to="/" />;
  } else if (user.role !== 'admin') {
    return <Navigate to="/dashboard/search" />;
  }

  return (
    <div>
      <AppBar
        pages={[
          { label: "Flights", path: "flights" },
          { label: "Users", path: "users" }
        ]}
      />
      {outlet}
    </div>
  );
};
