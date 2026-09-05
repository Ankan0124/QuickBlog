import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common.Authorization;
    setToken(null);
    setUser(null);
  };

  const completeAuth = (nextToken, nextUser) => {
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    axios.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
    setToken(nextToken);
    setUser(nextUser);
  };

  const updateUser = (nextUser) => {
    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    clearSession();
    navigate("/");
  };

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blog/all");
      data.success ? setBlogs(data.blogs) : toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setAuthLoading(false);
        return;
      }

      axios.defaults.headers.common.Authorization = `Bearer ${storedToken}`;

      try {
        const { data } = await axios.get("/api/auth/me");
        if (data.success) {
          setToken(storedToken);
          updateUser(data.user);
        } else {
          clearSession();
        }
      } catch {
        clearSession();
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
    fetchBlogs();
  }, []);

  const value = {
    axios,
    navigate,
    token,
    user,
    authLoading,
    blogs,
    setBlogs,
    input,
    setInput,
    completeAuth,
    updateUser,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
