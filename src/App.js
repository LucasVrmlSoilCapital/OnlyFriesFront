import "./index.css";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
const supabase = createClient(
  "https://hpgkbynnponcwemtvtpz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwZ2tieW5ucG9uY3dlbXR2dHB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNDkzNTUsImV4cCI6MjA2NTcyNTM1NX0.5e9bEjhtrtLcZ6rCFUPhW8wKLMm5v4W9rmnHGi3uFHM"
);
export default function App() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);
  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  } else {
    return <div>Logged in!</div>;
  }
}
