import React from "react";
import { useCookies } from "react-cookie";

const CookieExample: React.FC = () => {
  // Create cookie state
  const [cookies, setCookie, removeCookie] = useCookies(["username"]);

  const handleSetCookie = () => {
    setCookie("username", "Steevy", {
  path: "/",
  maxAge: 3600,
  secure: process.env.NODE_ENV === "production", // works on localhost
  sameSite: "strict",
    });
  };

  const handleRemoveCookie = () => {
    removeCookie("username", { path: "/" });
  };

  return (
    <div className="p-4">
      <h1>Hello {cookies.username || "Guest"}</h1>
      <button onClick={handleSetCookie}>Set Cookie</button>
      <button onClick={handleRemoveCookie}>Remove Cookie</button>
    </div>
  );
};

export default CookieExample;