import { useState, useEffect, useCallback } from "react";

let logoutTimer;

export const useAuth = () => {
  const [name, setName] = useState();
  const [token, setToken] = useState();
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null); // [admin, user]
  const [tokenExp, setTokenExp] = useState();

  const updateContext = (username = null, token = null) => {
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (username) {
      setName(username);
      storedData.name = username;
    } else {
      setToken(token);
      storedData.token = token;
    }

    localStorage.setItem("userData", JSON.stringify(storedData));
  };
  const login = useCallback((userId, role, token, name, expirationDate) => {
    setToken(token);
    setUserId(userId);
    setRole(role);
    setName(name);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
    /* 
      -> new Date is generated with the value = 1000ms = 1s * 60 = 1min * 60 = 60min/1hr * 24 = 24hrs/1day
         or an existing expiration date provided. 
      -> This calculated time is generated when user logs in for the first time and not for every refresh of
         the app and stored in local storage along with the token and userId.
      -> If the user is already logged in then this expiration date is retrived from the local storage and is
         used in the useEffect as all 3 args of useEffect exist. So user is logged in with this expiration date.
       */
    setTokenExp(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: userId,
        role: role,
        token: token,
        name: name,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/ecomm/users/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setToken(null);
        setUserId(null);
        setRole(null);
        setTokenExp(null);
        setName(null);
        localStorage.removeItem("userData");
      });
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.user,
        storedData.role,
        storedData.token,
        storedData.name,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExp) {
      const remainingTime = tokenExp.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [login, logout, token, tokenExp]);

  return { login, logout, token, userId, role, name, updateContext };
};
