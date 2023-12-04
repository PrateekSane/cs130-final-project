import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

// Defining the types for your tokens and user data
type AuthToken = {
  access: string;
  refresh: string;
};

type User = {
  username: string;
  email: string;
};

interface AuthContextType {
  user: User | null;
  authToken: AuthToken | null;
  loginUser: (e: React.FormEvent<HTMLFormElement>, formData: FormData) => Promise<void>;
  logoutUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('authtoken');
    return token ? jwtDecode<User>(token) : null;
  });

  const [authToken, setAuthToken] = useState<AuthToken | null>(() => {
    const tokens = localStorage.getItem('authtoken');
    return tokens ? JSON.parse(tokens) : null;
  });

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (e: React.FormEvent<HTMLFormElement>, formData: FormData): Promise<void> => {
    e.preventDefault();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    console.log(email);
    const response = await fetch('http://127.0.0.1:8000/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: email, password: password}),

    });

    const data = await response.json();

    if (data) {
      localStorage.setItem('authtoken', JSON.stringify(data));
      setAuthToken(data);
      setUser(jwtDecode<User>(data.access));
      navigate('/');
    } else {
      alert('Something went wrong while logging in the user!');
    }
  };

  const logoutUser = async (e?: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e?.preventDefault();
    const logoutEndpoint = 'http://127.0.0.1:8000/logout/';
    const response = await fetch(logoutEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
            refresh: localStorage.getItem('authtoken'),
        }),
      credentials: 'same-origin',
    });

    const data = await response.json();
    if (data) {
        localStorage.removeItem('authtoken');
        setAuthToken(null);
        setUser(null);
        navigate('/login');
      } else {
        alert('Something went wrong while logging out the user!');
      }
    
  };

  const updateToken = async () => {
    const response = await fetch('http://127.0.0.1:8000/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh: authToken?.refresh })
    });

    const data = await response.json();
    if (response.status === 200) {
      setAuthToken(data);
      setUser(jwtDecode<User>(data.access));
      localStorage.setItem('authtoken', JSON.stringify(data));
    } else {
      logoutUser();
    }

    if (loading) {
      setLoading(false);
    }
  };

  let contextData: AuthContextType = {
    user: user,
    authToken: authToken,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    const REFRESH_INTERVAL = 1000 * 60 * 4; // 4 minutes
    let interval = setInterval(() => {
      if (authToken) {
        updateToken();
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);

  }, [authToken, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};
