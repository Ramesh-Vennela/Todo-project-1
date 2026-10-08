import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Auth() {

    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);

    // Forgot Password
    const [isForgot, setIsForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] =
        useState(false);

    const [forgotStep, setForgotStep] = useState("email");

    // Login
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    // Register
    const [name, setName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Messages
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // LOGIN
    const handleLogin = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            const response = await fetch(
                "https://todo-backend-83m3.onrender.com/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: loginEmail.trim(),
                        password: loginPassword
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || data.success !== true) {

                setError(
                    data.message ||
                    "Login failed. Please check your email and password."
                );

                return;
            }

            // Save logged-in user details
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: data.id,
                    name: data.name,
                    email: data.email
                })
            );

            setError("");
            setMessage("");

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {

            setError(
                "Cannot connect to the server. Please start Spring Boot."
            );
        }
    };

    // REGISTER
    const handleRegister = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (registerPassword !== confirmPassword) {

            setError("Passwords do not match.");

            return;
        }

        try {

            const response = await fetch(
                "https://todo-backend-83m3.onrender.com/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: registerEmail.trim(),
                        password: registerPassword
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setError(
                    data.message ||
                    "Registration failed. Please try again."
                );

                return;
            }

            setMessage(
                "Registration successful! Please login."
            );

            setError("");

            // Put registered email into login email
            setLoginEmail(data.email);

            // Clear register fields
            setName("");
            setRegisterEmail("");
            setRegisterPassword("");
            setConfirmPassword("");

            // Switch to login
            setIsLogin(true);

        } catch (error) {

            setError(
                "Cannot connect to the server. Please start Spring Boot."
            );
        }
    };

    // SEND OTP
    const handleSendOtp = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            const response = await fetch(
                "https://todo-backend-83m3.onrender.com/api/auth/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: forgotEmail.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || data.success !== true) {

                setError(
                    data.message ||
                    "Unable to send OTP. Please check your email."
                );

                return;
            }

            setMessage(
                "OTP sent successfully. Please check your email."
            );

            setError("");
            setForgotStep("otp");

        } catch (error) {

            setError(
                "Cannot connect to the server. Please start Spring Boot."
            );
        }
    };

    // CHANGE PASSWORD
    const handleChangePassword = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (newPassword !== confirmNewPassword) {

            setError("New passwords do not match.");

            return;
        }

        if (newPassword.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }

        try {

            const response = await fetch(
                "https://todo-backend-83m3.onrender.com/api/auth/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: forgotEmail.trim(),
                        otp: otp.trim(),
                        newPassword: newPassword
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || data.success !== true) {

                setError(
                    data.message ||
                    "Password reset failed. Please check the OTP."
                );

                return;
            }

            setMessage(
                "Password changed successfully! Please login."
            );

            setError("");

            // Put email into login
            setLoginEmail(forgotEmail.trim());

            // Clear forgot password fields
            setForgotEmail("");
            setOtp("");
            setNewPassword("");
            setConfirmNewPassword("");

            setForgotStep("email");

            // Go back to login
            setIsForgot(false);
            setIsLogin(true);

        } catch (error) {

            setError(
                "Cannot connect to the server. Please start Spring Boot."
            );
        }
    };

    // PROFESSIONAL EYE ICON
    const EyeIcon = ({ visible }) => {

        if (visible) {

            return (
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            );
        }

        return (
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c6.5 0 10 8 10 8a17.4 17.4 0 0 1-3.1 4.4" />
                <path d="M6.6 6.6C3.5 8.8 2 12 2 12s3.5 8 10 8c1.5 0 2.8-.3 4-.8" />
            </svg>
        );
    };

    return (
        <div className="auth-page">

            <div className="auth-container">

                {/* LEFT SIDE */}
                <div className="auth-brand">

                    <div className="brand-logo">
                        ✓
                    </div>

                    <h1>
                        TaskFlow
                    </h1>

                    <h2>
                        Manage your work.
                        <br />
                        Stay productive.
                    </h2>

                    <p>
                        Organize your tasks, track your progress,
                        and get more done every day.
                    </p>

                </div>

                {/* RIGHT SIDE */}
                <div className="auth-form-container">

                    {/* TABS */}
                    {!isForgot && (
                        <div className="auth-tabs">

                            <button
                                type="button"
                                className={
                                    isLogin
                                        ? "auth-tab active"
                                        : "auth-tab"
                                }
                                onClick={() => {
                                    setIsLogin(true);
                                    setMessage("");
                                    setError("");
                                }}
                            >
                                Login
                            </button>

                            <button
                                type="button"
                                className={
                                    !isLogin
                                        ? "auth-tab active"
                                        : "auth-tab"
                                }
                                onClick={() => {
                                    setIsLogin(false);
                                    setMessage("");
                                    setError("");
                                }}
                            >
                                Register
                            </button>

                        </div>
                    )}

                    {/* SUCCESS MESSAGE */}
                    {message && (
                        <div className="auth-message success-message">
                            {message}
                        </div>
                    )}

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="auth-message error-message">
                            {error}
                        </div>
                    )}

                    {/* =========================
                        FORGOT PASSWORD
                    ========================= */}
                    {isForgot ? (

                        <div className="auth-form">

                            <h2>
                                Forgot Password
                            </h2>

                            <p className="auth-subtitle">
                                Reset your TaskFlow account password
                            </p>

                            {/* EMAIL STEP */}
                            {forgotStep === "email" && (

                                <form onSubmit={handleSendOtp}>

                                    <div className="auth-field">

                                        <label>
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            placeholder="Enter your registered email"
                                            value={forgotEmail}
                                            onChange={(e) => {
                                                setForgotEmail(
                                                    e.target.value
                                                );
                                                setError("");
                                            }}
                                            required
                                        />

                                    </div>

                                    <button
                                        type="submit"
                                        className="auth-submit"
                                    >
                                        Send OTP
                                    </button>

                                </form>
                            )}

                            {/* OTP + PASSWORD STEP */}
                            {forgotStep === "otp" && (

                                <form onSubmit={handleChangePassword}>

                                    <div className="auth-field">

                                        <label>
                                            OTP
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter OTP"
                                            value={otp}
                                            onChange={(e) => {
                                                setOtp(
                                                    e.target.value
                                                );
                                                setError("");
                                            }}
                                            maxLength="6"
                                            required
                                        />

                                    </div>

                                    <div className="auth-field">

                                        <label>
                                            New Password
                                        </label>

                                        <div className="password-input-wrapper">

                                            <input
                                                type={
                                                    showNewPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Enter new password"
                                                value={newPassword}
                                                onChange={(e) => {
                                                    setNewPassword(
                                                        e.target.value
                                                    );
                                                    setError("");
                                                }}
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        !showNewPassword
                                                    )
                                                }
                                                aria-label={
                                                    showNewPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                <EyeIcon
                                                    visible={
                                                        showNewPassword
                                                    }
                                                />
                                            </button>

                                        </div>

                                    </div>

                                    <div className="auth-field">

                                        <label>
                                            Confirm New Password
                                        </label>

                                        <div className="password-input-wrapper">

                                            <input
                                                type={
                                                    showConfirmNewPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Confirm new password"
                                                value={
                                                    confirmNewPassword
                                                }
                                                onChange={(e) => {
                                                    setConfirmNewPassword(
                                                        e.target.value
                                                    );
                                                    setError("");
                                                }}
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() =>
                                                    setShowConfirmNewPassword(
                                                        !showConfirmNewPassword
                                                    )
                                                }
                                                aria-label={
                                                    showConfirmNewPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                <EyeIcon
                                                    visible={
                                                        showConfirmNewPassword
                                                    }
                                                />
                                            </button>

                                        </div>

                                    </div>

                                    <button
                                        type="submit"
                                        className="auth-submit"
                                    >
                                        Change Password
                                    </button>

                                </form>
                            )}

                            {/* BACK TO LOGIN */}
                            <p className="switch-text">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsForgot(false);
                                        setForgotStep("email");
                                        setMessage("");
                                        setError("");
                                    }}
                                >
                                    ← Back to Login
                                </button>

                            </p>

                        </div>

                    ) : (

                        /* LOGIN / REGISTER */
                        isLogin ? (

                            /* LOGIN */
                            <div className="auth-form">

                                <h2>
                                    Welcome Back
                                </h2>

                                <p className="auth-subtitle">
                                    Login to your TaskFlow account
                                </p>

                                <form onSubmit={handleLogin}>

                                    <div className="auth-field">

                                        <label>
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={loginEmail}
                                            onChange={(e) => {
                                                setLoginEmail(
                                                    e.target.value
                                                );
                                                setError("");
                                            }}
                                            required
                                        />

                                    </div>

                                    <div className="auth-field">

                                        <label>
                                            Password
                                        </label>

                                        <div className="password-input-wrapper">

                                            <input
                                                type={
                                                    showLoginPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Enter your password"
                                                value={loginPassword}
                                                onChange={(e) => {
                                                    setLoginPassword(
                                                        e.target.value
                                                    );
                                                    setError("");
                                                }}
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() =>
                                                    setShowLoginPassword(
                                                        !showLoginPassword
                                                    )
                                                }
                                                aria-label={
                                                    showLoginPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                <EyeIcon
                                                    visible={
                                                        showLoginPassword
                                                    }
                                                />
                                            </button>

                                        </div>

                                    </div>

                                    <div className="auth-options">

                                        <label className="remember-me">

                                            <input type="checkbox" />

                                            <span>
                                                Remember me
                                            </span>

                                        </label>

                                        <button
                                            type="button"
                                            className="forgot-password"
                                            onClick={() => {
                                                setIsForgot(true);
                                                setForgotStep("email");
                                                setForgotEmail(loginEmail);
                                                setMessage("");
                                                setError("");
                                            }}
                                        >
                                            Forgot password?
                                        </button>

                                    </div>

                                    <button
                                        type="submit"
                                        className="auth-submit"
                                    >
                                        Login
                                    </button>

                                </form>

                                <p className="switch-text">

                                    Don't have an account?

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsLogin(false);
                                            setMessage("");
                                            setError("");
                                        }}
                                    >
                                        Create account
                                    </button>

                                </p>

                            </div>

                        ) : (

                            /* REGISTER */
                            <div className="auth-form">

                                <h2>
                                    Create Account
                                </h2>

                                <p className="auth-subtitle">
                                    Create your TaskFlow account
                                </p>

                                <form onSubmit={handleRegister}>

                                    <div className="auth-field">

                                        <label>
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={name}
                                            onChange={(e) =>
                                                setName(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />

                                    </div>

                                    <div className="auth-field">

                                        <label>
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={registerEmail}
                                            onChange={(e) =>
                                                setRegisterEmail(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />

                                    </div>

                                    <div className="auth-field">

                                        <label>
                                            Password
                                        </label>

                                        <div className="password-input-wrapper">

                                            <input
                                                type={
                                                    showRegisterPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Create a password"
                                                value={registerPassword}
                                                onChange={(e) =>
                                                    setRegisterPassword(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() =>
                                                    setShowRegisterPassword(
                                                        !showRegisterPassword
                                                    )
                                                }
                                                aria-label={
                                                    showRegisterPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                <EyeIcon
                                                    visible={
                                                        showRegisterPassword
                                                    }
                                                />
                                            </button>

                                        </div>

                                    </div>

                                    <div className="auth-field">

                                        <label>
                                            Confirm Password
                                        </label>

                                        <div className="password-input-wrapper">

                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Confirm your password"
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                                aria-label={
                                                    showConfirmPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                <EyeIcon
                                                    visible={
                                                        showConfirmPassword
                                                    }
                                                />
                                            </button>

                                        </div>

                                    </div>

                                    <button
                                        type="submit"
                                        className="auth-submit"
                                    >
                                        Create Account
                                    </button>

                                </form>

                                <p className="switch-text">

                                    Already have an account?

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsLogin(true);
                                            setMessage("");
                                            setError("");
                                        }}
                                    >
                                        Login
                                    </button>

                                </p>

                            </div>
                        )
                    )}

                </div>

            </div>

        </div>
    );
}

export default Auth;