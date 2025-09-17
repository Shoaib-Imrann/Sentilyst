import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formShake, setFormShake] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [step, setStep] = useState("email"); // email -> otpVerification -> completeSignup
  const [emailVerified, setEmailVerified] = useState(false);
  const [jwtToken, setJwtToken] = useState("");
  const navigate = useNavigate();

  const triggerShake = () => {
    setFormShake(true);
    setTimeout(() => setFormShake(false), 600);
  };

  // Handle OTP input as separate digits
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multi-character input

    // Update the digit at the specified index
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if current one is filled
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace in OTP inputs
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) prevInput.focus();
      }
    }
  };

  // Paste functionality for OTP
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];

    pasteData.forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });

    setOtp(newOtp);

    // Focus the next empty input or the last one
    const lastIndex = Math.min(pasteData.length, 5);
    const nextInput = document.getElementById(`otp-${lastIndex}`);
    if (nextInput) nextInput.focus();
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      triggerShake();
      return;
    }

    try {
      setLoading(true);
      // Check if email exists in database
      const checkResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/check-email`,
        { email }
      );

      if (checkResponse.data && checkResponse.data.exists) {
        // Email already exists
        setError("This email is already registered. Please sign in instead.");
        toast.error("Email is already registered. Please sign in instead.");
        triggerShake();
        return;
      }

      // If email doesn't exist, send OTP
      const sendOtpResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/send-otp`,
        { email }
      );
      setJwtToken(sendOtpResponse.data.jwt);
      toast.success("Verification code sent to your email");
      setStep("otpVerification");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send verification code. Please try again."
      );
      toast.error(
        err.response?.data?.message ||
          "Failed to send verification code. Please try again."
      );
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter the complete verification code");
      toast.error("Please enter the complete verification code");
      triggerShake();
      return;
    }

    try {
      setLoading(true);
      // Verify OTP
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/verify-otp`,
        { email, otp: otpString, jwt_token: jwtToken }
      );

      if (response.data && response.data.verified) {
        toast.success("Email verified successfully");
        setEmailVerified(true);
        setStep("completeSignup");
      } else {
        setError("Invalid verification code. Please try again.");
        toast.error("Invalid verification code. Please try again.");
        triggerShake();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to verify code. Please try again."
      );
      toast.error(
        err.response?.data?.message ||
          "Failed to verify code. Please try again."
      );
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !fullName) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields");
      triggerShake();
      return;
    }

    // Password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      toast.error("Password must be at least 8 characters long");
      triggerShake();
      return;
    }

    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasNumber || !hasSpecial) {
      setError(
        "Password must contain at least one number and one special character"
      );
      toast.error(
        "Password must contain at least one number and one special character"
      );
      triggerShake();
      return;
    }

    try {
      setLoading(true);
      // Register user with verified email, full name, and password
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/register`,
        { email, fullName, password }
      );

      toast.success("Account created successfully!");

      // Store authentication token
      localStorage.setItem("accessToken", response.data.token);

      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create account. Please try again."
      );
      toast.error(
        err.response?.data?.message ||
          "Failed to create account. Please try again."
      );
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/google-login`,
        { token }
      );
      const data = res.data;

      localStorage.setItem("accessToken", data.token);
      toast.success("Logged in with Google");
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Google login failed");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/email/send-otp`, {
        email,
      });
      toast.success("Verification code resent to your email");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to resend code. Please try again."
      );
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
                Create an account
              </p>

              {/* Step navigation if not at first step */}
              {step !== "email" && (
                <button
                  onClick={() => setStep("email")}
                  className="flex items-center text-blue-600 mb-6 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={20} />
                  <span>Back to email</span>
                </button>
              )}

              {/* EMAIL STEP */}
              {step === "email" && (
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <TextField
                    id="email-signup"
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    error={!!error}
                    helperText={error}
                    sx={{ mb: 2 }}
                  />

                  {/* Continue Button */}
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      "Continue"
                    )}
                  </button>

                  {/* Sign In Text */}
                  <div className="text-center mt-6">
                    <p className="text-gray-600 text-sm">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>

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

                  {/* Google Sign Up Button */}
                  <div className="w-full justify-center items-center flex">
                    <GoogleLogin
                      onSuccess={handleGoogleSignup}
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
                      className="rounded-lg py-3"
                    />
                  </div>
                </form>
              )}

              {/* OTP VERIFICATION STEP */}
              {step === "otpVerification" && (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                    <p className="text-gray-700">
                      We've sent a verification code to{" "}
                      <span className="font-medium">{email}</span>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Verification code
                    </label>
                    <div className="flex justify-between gap-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          value={otp[index]}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={index === 0 ? handleOtpPaste : undefined}
                          className="w-12 h-14 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
                          maxLength={1}
                          required
                        />
                      ))}
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 mt-8 font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      "Verify"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      className="text-gray-800 underline cursor-pointer hover:text-gray-900 text-sm font-medium transition-colors"
                      onClick={resendOTP}
                      disabled={loading}
                    >
                      {loading
                        ? "Sending..."
                        : "Didn't receive a code? Send again"}
                    </button>
                  </div>
                </form>
              )}

              {/* COMPLETE SIGNUP STEP - FULL NAME & PASSWORD */}
              {step === "completeSignup" && (
                <form onSubmit={handleRegister} className="space-y-6">
                  {emailVerified && (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-4">
                      <p className="text-gray-700">
                        Email verified successfully! Complete your profile to
                        create your account.
                      </p>
                    </div>
                  )}

                  <TextField
                    id="fullName"
                    label="Full name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    error={error && error.includes("name")}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    id="password-signup"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    error={error && error.includes("Password")}
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

                  <p className="mt-2 text-sm text-gray-500">
                    Must be at least 8 characters with a number and special
                    character
                  </p>

                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 cursor-pointer border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 mt-8 font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>
              )}
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

export default SignUp;
