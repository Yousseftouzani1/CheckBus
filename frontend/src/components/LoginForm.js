import React, { useState } from "react";

function LoginForm({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message,setMessage]=useState("welcome you need to login to your account :) ");
    const [bravos,setBravos]=useState(0);


    const handleSubmit = (e) => {
    e.preventDefault();

    onLogin(email, password);
    };

        return (
        <div style={styles.container}>
<h1>{message}</h1>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
        />
        <button type="submit" style={styles.button}>Login</button>
        
        </form>
        <button type="submit" onClick={()=>{
    const newCount = bravos + 1;
    setBravos(newCount);
    setMessage("well done bravo! " + newCount);
        }}>finished</button>
        </div>
    );
}

const styles = {
    container: { textAlign: "center", marginTop: "100px" },
    form: { display: "inline-block", textAlign: "left" },
    input: { display: "block", margin: "10px 0", padding: "8px", width: "200px" },
    button: { padding: "8px 16px", cursor: "pointer" },
};

export default LoginForm;
