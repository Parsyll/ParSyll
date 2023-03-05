import * as React from "react";
import {useState, createContext, useMemo, useContext} from "react"
import { useNavigate } from "react-router-dom";
import { getJWTToken, removeJWTToken } from "../helper/jwt";
import { useLocalStorage } from "./useLocalStorage";
import axios from 'axios'

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [authed, setAuthed] = useLocalStorage("jwt-token", "");
  const navigate = useNavigate();

    const persistUser = async () => {
        const token = getJWTToken();

        axios.interceptors.request.use(config => {
            const token = getJWTToken();
            config.headers["Authorization"] = `Bearer ${token}`;
            return config;
        });
        try{
            if(token) {
                axios.get('http://localhost:8000/users/token/verify').then((res) => {
                    const data = res;
                    if (data.status == 200) {
                        setAuthed(true);
                        navigate("/parse_pdf")
                    }
                    navigate("/login")
                })
            }
            } catch {
                removeJWTToken();
                navigate("/login")
            }
    }

    const login = () => {
        setAuthed(true);
        navigate("/dashboard/courses")
    }

    const logout = () => {
        setAuthed(false);
        removeJWTToken();
        navigate("/login");
    }

    const value = useMemo(
        () => ({
          authed,
          persistUser,
          login,
          logout
        }),
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