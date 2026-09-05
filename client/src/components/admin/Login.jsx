import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const Login = () => {
  const { axios, completeAuth, navigate } = useAppContext();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegistering ? { name, email, password } : { email, password };
      const { data } = await axios.post(endpoint, payload);

      if (data.success) {
        completeAuth(data.token, data.user);
        navigate(data.user.role === "user" ? "/account" : "/admin");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setIsRegistering((current) => !current);
    setPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50/30">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg bg-white">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full py-6 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">{isRegistering ? "Create" : "Welcome"}</span>
              {isRegistering ? " account" : " back"}
            </h1>
            <p className="font-light">
              {isRegistering
                ? "Join QuickBlog to comment and save your profile"
                : "Sign in to access your QuickBlog account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 w-full sm:max-w-md text-gray-600">
            {isRegistering && (
              <div className="flex flex-col">
                <label>Name</label>
                <input
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                  type="text"
                  required
                  minLength="2"
                  maxLength="60"
                  placeholder="your display name"
                  className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                />
              </div>
            )}

            <div className="flex flex-col">
              <label>Email</label>
              <input
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                type="email"
                required
                placeholder="your email address"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
              />
            </div>

            <div className="flex flex-col">
              <label>Password</label>
              <input
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                type="password"
                required
                minLength={isRegistering ? 8 : undefined}
                placeholder={isRegistering ? "at least 8 characters" : "your password"}
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
              />
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Please wait..." : isRegistering ? "Create account" : "Login"}
            </button>
          </form>

          <button onClick={switchMode} className="mt-6 text-sm text-primary cursor-pointer">
            {isRegistering ? "Already have an account? Login" : "New to QuickBlog? Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
