// UserComponent.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../appRedux/actions/User";

const UserComponent = () => {
    const dispatch = useDispatch();

    // 🔹 Get data from Redux
    const { loading, user, error } = useSelector((state) => state.user || {});

    // 🔹 Local state for inputs
    const [name, setUsername] = useState("");
    const [email, setEmail] = useState("");


    // 🔹 Handle button click
    const handleLogin = () => {
        if (!name || !email) {
            alert("Enter username and email");
            return;
        }

        dispatch(User({ name, email }));
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>User </h2>

            {/* Username */}
            <div style={{ marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Enter Username"
                    value={name}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ padding: "8px", width: "250px" }}
                />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "10px" }}>
                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ padding: "8px", width: "250px" }}
                />
            </div>

            {/* Button */}
            <button
                onClick={handleLogin}
                style={{
                    padding: "8px 16px",
                    backgroundColor: "#00d4ff",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                Click
            </button>

        </div>
    );
};

export default UserComponent;