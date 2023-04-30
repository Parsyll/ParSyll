import * as React from "react";
import {useState, createContext, useMemo, useContext} from "react"
import { getJWTToken, removeJWTToken } from "../helper/jwt";
import parseApp from "../api/Axios";

export const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [authed, setAuthed] = useState(false)
  const [user, setUser] = useState("")

    const persistUser = async () => {
        const token = getJWTToken();

        try{
            if(token) {
                parseApp.get('/users/token/verify').then((res) => {
                    const data = res;
                    if (data.status == 200) {
                        setAuthed(true);
                        setUser(res.data)
                    }
                })
            }
            } catch {
                removeJWTToken();
            }
    }
    
    const userLogin = (user) => {
        setAuthed(true);
        setUser(user);
    }

    const userLogout = () => {
        setAuthed(false);
        setUser("");
        removeJWTToken();
    }
    
    const value = useMemo(
        () =>
          ({
          authed,
          user,
          persistUser,
          userLogin,
          userLogout
        }),
        [authed]
      );

      return (
      <UserContext.Provider value={value}>
        {children}
      </UserContext.Provider>
      )
}

export const useUser = () => {
    return useContext(UserContext);
  };
