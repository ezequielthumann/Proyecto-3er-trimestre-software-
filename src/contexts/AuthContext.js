// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/FirebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false); // Nuevo estado

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedTheme = await AsyncStorage.getItem('darkMode'); // Obtener el estado del modo oscuro
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        if (storedTheme !== null) {
          setDarkModeEnabled(JSON.parse(storedTheme)); // Establecer el estado del modo oscuro
        }
      } catch (error) {
        console.error("Error checking user session: ", error);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !darkModeEnabled;
    setDarkModeEnabled(newMode);
    await AsyncStorage.setItem('darkMode', JSON.stringify(newMode)); // Guardar el estado del modo oscuro
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, darkModeEnabled, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
