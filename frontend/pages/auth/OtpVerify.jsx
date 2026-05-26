// src/pages/auth/OtpVerify.jsx
import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, Mail, RefreshCw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import Typography from "../../components/ui/Typography";
import { bankApi } from "../../api/bankApi";
import { STORAGE_KEYS } from "../../utils/constants";
import { useAuth } from "../../contexts/AuthContext";

import {
  Wrapper,
  Card,
  Form,
  Field,
  Label,
  Input,
  ErrorBox,
  SubmitBtn,
  BackButton,
  Hint,
  Row,
  LinkBtn,
} from "./OtpVerify.styles";

const onlyDigits = (v) => String(v || "").replace(/\D/g, "");

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const stateEmail = location?.state?.email;
  const storedEmail = useMemo(() => {
    try {
      // Prefer sessionStorage (short-lived), fallback to localStorage.
      return (
        sessionStorage.getItem(STORAGE_KEYS.PENDING_OTP_EMAIL) ||
        localStorage.getItem(STORAGE_KEYS.PENDING_OTP_EMAIL) ||
        ""
      );
    } catch {
      return "";
    }
  }, []);

  const pendingPassword = useMemo(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.PENDING_OTP_PASSWORD) || "";
    } catch {
      return "";
    }
  }, []);

  const email = String(stateEmail || storedEmail || "").trim();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (!email) {
      // If user opened the page directly without registration flow.
      setError("Email is missing. Please register again.");
    }
  }, [email]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email) {
      setError("Email is missing. Please register again.");
      return;
    }
    const code = onlyDigits(otp);
    if (code.length < 4) {
      setError("Enter the OTP code from your email.");
      return;
    }

    try {
      setLoading(true);
      const res = await bankApi.otpVerify({ email, otpCode: code });

      if (!res?.success) {
        setError(res?.message || "Invalid OTP.");
        return;
      }

      // Clear temporary OTP session keys.
      try {
        localStorage.removeItem(STORAGE_KEYS.PENDING_OTP_EMAIL);
      } catch {
        // ignore
      }
      try {
        sessionStorage.removeItem(STORAGE_KEYS.PENDING_OTP_PASSWORD);
        sessionStorage.removeItem(STORAGE_KEYS.PENDING_OTP_EMAIL);
      } catch {
        // ignore
      }

      // UX: after OTP verification, we auto-login (using the password stored in sessionStorage)
      // and redirect the user directly to card creation.
      if (pendingPassword) {
        const ok = await login(email, pendingPassword, { redirectTo: "/cards/add?onboarding=1", replace: true });
        if (ok?.success) return;
      }

      setInfo("OTP verified. Please login to create a card.");
      setTimeout(() => navigate("/login", { state: { email, redirectTo: "/cards/add?onboarding=1" } }), 500);
    } catch (err) {
      setError(err?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError("");
    setInfo("");
    if (!email) {
      setError("Email is missing. Please register again.");
      return;
    }
    try {
      setResending(true);
      const res = await bankApi.otpSend({ email });
      setInfo(res?.message || "OTP sent again.");
    } catch (err) {
      setError(err?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <BackButton onClick={() => navigate("/register")}>← Back to Register</BackButton>

        <Typography size="xl" weight="600" style={{ textAlign: "center" }}>
          Verify OTP
        </Typography>

        <Typography size="sm" color="muted" style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Mail size={16} /> We sent a code to <b>{email || "your email"}</b>
          </span>
        </Typography>

        <Form onSubmit={onSubmit}>
          <Field>
            <Label>OTP code</Label>
            <Input
              value={otp}
              onChange={(e) => setOtp(onlyDigits(e.target.value).slice(0, 6))}
              placeholder="Enter code"
              inputMode="numeric"
              autoFocus
            />
            <Hint>Tip: check Spam/Junk if you don’t see the email.</Hint>
          </Field>

          {(error || info) && (
            <ErrorBox $variant={error ? "error" : "success"}>
              {error ? <AlertCircle size={16} /> : null}
              <span>{error || info}</span>
            </ErrorBox>
          )}

          <SubmitBtn disabled={loading || !email}>
            {loading ? "Verifying..." : "Verify"}
          </SubmitBtn>

          <Row>
            <Typography size="sm" color="muted">
              Didn’t receive it?
            </Typography>

            <LinkBtn type="button" onClick={resend} disabled={resending || !email}>
              <RefreshCw size={16} /> {resending ? "Sending..." : "Resend"}
            </LinkBtn>
          </Row>
        </Form>
      </Card>
    </Wrapper>
  );
};

export default OtpVerify;
