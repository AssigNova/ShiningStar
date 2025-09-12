import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/password/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase() }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("OTP sent to your email.");
      setStep(2);
    } else {
      alert(data.message || "Error");
      toast.error(data.message || "Error");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/password/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase(), otp }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("OTP verified. You can now reset your password.");
      setStep(3);
    } else {
      alert(data.message || "Invalid OTP");
      toast.error(data.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase(), password: newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Password reset successful");
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      window.location.href = "/";
    } else {
      toast.error(data.message || "Error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <h2 className="text-xl font-bold mb-2">First Time Login</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">
            Request OTP
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <h2 className="text-xl font-bold mb-2">Enter OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP from email"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Verify OTP
          </button>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <h2 className="text-xl font-bold mb-2">Reset Password</h2>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
}
