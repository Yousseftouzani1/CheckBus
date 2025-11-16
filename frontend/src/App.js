import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginForm onLogin={setUser} />;
  }

  return (
    <div className="App">
      <h1>Welcome, {user.email}</h1>
      <p>You are logged in.</p>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          setUser(null);
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default App;

