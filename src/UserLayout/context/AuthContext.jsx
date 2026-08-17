import { createContext, useContext, useState } from "react";
import { isUserExist } from "../utils/context";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
//   ==================================================================================================

// register function
  const register = async (userinfo) => {
    setIsLoading(true);

    try {
      const isExisting = await isUserExist(userinfo.email);
      if (isExisting.userExist) {
        throw new Error(isExisting.message);
      }

      const res = await api.post(`/users`, {
        ...userinfo,
        createdAt: new Date().toISOString(),
        role: "user",
      });

      
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));

        return res.data
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }
//   ==================================================================================================

// login function 
    const login = async (email,passwd) => {
      const {data : loggedUser} = await api.get(`/users?email=${email}&password=${passwd}`)
    

    if(loggedUser.length == 0){
      setError("invalid credentials")
      return {success : false}

    }

    setUser(loggedUser[0])
    localStorage.setItem("user",JSON.stringify(loggedUser[0]))

    return { success: true }
  }
  
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        error,
        setError,
        isLoading,
        register,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
