import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AdminLogin from "../adminPages/AdminLogin";
import aimLogo from "../assets/aim-logo.png";

export default function AdminFirewall({ children }) {
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  async function checkAdminAccess() {
    setIsLoadingAdmin(true);
    setAdminError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Admin user error:", userError);
      setAdminUser(null);
      setIsLoadingAdmin(false);
      return;
    }

    if (!user) {
      setAdminUser(null);
      setIsLoadingAdmin(false);
      return;
    }

    const { data: adminRecord, error: adminRecordError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (adminRecordError || !adminRecord) {
      console.error("Admin record error:", adminRecordError);
      await supabase.auth.signOut();
      setAdminUser(null);
      setAdminError("You do not have access to the admin area.");
      setIsLoadingAdmin(false);
      return;
    }

    setAdminUser(user);
    setIsLoadingAdmin(false);
  }

  if (isLoadingAdmin) {
    return (
      <div className="loading">
        <img alt="AIM Logo" src={aimLogo} />
        <p>Loading admin area...</p>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <AdminLogin
        onLogin={() => {
          checkAdminAccess();
        }}
      />
    );
  }

  return children;
}
