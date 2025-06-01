import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formShake, setFormShake] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const triggerShake = () => {
    setFormShake(true);
    setTimeout(() => setFormShake(false), 600);
  };

  const handleEmailChange = async (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Clear email existence status when email changes
    if (emailExists) {
      setEmailExists(false);
    }
  };

  const handleCheckEmail = async () => {
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      triggerShake();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/email/check-email",
        { email }
      );

      // Set emailExists based on the response
      if (response.data && response.data.exists) {
        setEmailExists(true);
      } else {
        // If email doesn't exist, show message
        toast.error("Email not found. Please sign up.");
        triggerShake();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Please try again.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      triggerShake();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/login`,
        { email, password }
      );

      const data = response.data;
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      toast.success("Successfully logged in");
      setPassword("");
      window.location.href = "/";
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/google-login`,
        { token }
      );
      const data = res.data;
      console.log("Logged in user:", data);

      localStorage.setItem("accessToken", data.token);
      toast.success("Logged in with Google");
      window.location.href = "/";
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Google login failed");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="z-10 w-full max-w-md px-4 sm:px-0 flex flex-col justify-between min-h-screen py-5">
          <div className="mb-8 text-center">
            <Link to="/" className="text-4xl ptserif">Sentilyst</Link>
          </div>

          <div
            className={`overflow-hidden transition-all ${
              formShake ? "animate-shake" : ""
            }`}
          >
            <div className="px-8 py-8 ">
              <p className="mb-8 text-2xl font-serif text-center">
                Welcome back
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Input */}
                <TextField
                  id="email"
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleCheckEmail}
                  variant="outlined"
                  fullWidth
                  required
                  error={!!error}
                  helperText={error}
                  sx={{ mb: 2 }}
                />

                {/* Password Input - Only show if email exists */}
                {emailExists && (
                  <div className="mb-4">
                    <TextField
                      id="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      variant="outlined"
                      fullWidth
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                )}

                {/* Login Button - Only enabled if we have email (and password if email exists) */}
                <button
                  type="submit"
                  disabled={!email || (emailExists && !password) || loading}
                  className="w-full flex justify-center items-center py-3 px-4 border cursor-pointer border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mr-2" size={20} />
                  ) : (
                    "Sign in"
                  )}
                </button>

                {/* Sign Up Text */}
                {!emailExists && (
                  <div className="text-center mt-6">
                    <p className="text-gray-600 text-sm">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors cursor-pointer"
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                )}
              </form>

              {/* OR Divider */}
              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-sm text-gray-500 font-medium">
                    OR
                  </span>
                </div>
              </div>

              {/* Google Sign In Button */}
              <div className="w-full justify-center items-center flex">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    toast.error("Google login failed");
                    triggerShake();
                  }}
                  useOneTap
                  size="large"
                  text="continue_with"
                  width="100%"
                  theme="filled_black"
                  shape="rectangular"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center flex justify-center items-center">
            <p className="text-sm text-gray-500">
              <a href="/terms" className="mr-1 text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              |{" "}
              <a href="/privacy" className="ml-1 text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
