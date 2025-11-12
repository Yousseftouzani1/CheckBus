import React from "react";
import LoginForm from "./components/LoginForm";
import FunctionClick from "./components/menu"
function App() {
  const handleLogin = (email, password) => {
    console.log("User login:", { email, password });
    // Here later you’ll call your backend API:
    // fetch("http://localhost:8081/api/login", { method: "POST", body: JSON.stringify({ email, password }) })
  };

  return (
    <div>
      <LoginForm onLogin={handleLogin} />
      <FunctionClick />
    </div>
  );
}

export default App;
