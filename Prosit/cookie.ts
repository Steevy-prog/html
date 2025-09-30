import React from "react";
import { useCookies } from "react-cookie";

const CookieExample: React.FC = () => {
  // Create cookie state
  const [cookies, setCookie, removeCookie] = useCookies(["username"]);

  const handleSetCookie = () => {
    setCookie("username", "Steevy", {
      path: "/",          // cookie valid for entire site
      maxAge: 3600,       // expires in 1 hour
      secure: true,       // sent only over HTTPS
      sameSite: "Strict", // CSRF protection
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