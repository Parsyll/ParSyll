import * as React from "react";
import {useState, createContext, useMemo, useContext} from "react"
import { useNavigate } from "react-router-dom";
import { getJWTToken, removeJWTToken } from "../helper/jwt";
import { useLocalStorage } from "./useLocalStorage";
import parseApp from "../api/Axios";
import { UserContext, useUser } from "./useUser";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const navigate = useNavigate();
  const {authed, user, userLogin, userLogout} = useUser()

    const login = (user) => {
        userLogin(user)
        navigate("/dashboard/courses/0")
    }

    const logout = () => {
        userLogout()
        navigate("/login");
    }

    const value = useMemo(
        () => {
          return ({
          login,
          logout
        })},
        [authed]
      );

      return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
      )
}

export const useAuth = () => {
    return useContext(AuthContext);
  };
