// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PasswordInput from "../../components/ui/PasswordInput";

import {
    Wrapper,
    Card,
    Title,
    Subtitle,
    Form,
    Field,
    Label,
    Input,
    ErrorBox,
    SubmitBtn,
    BottomText,
    BackButton
} from "./Login.styles";


const Login = () => {
    const navigate = useNavigate();
    const { login, authLoading, error } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [formError, setFormError] = useState("");

    const onChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormError("");
    };

    const validate = () => {
        if (!form.email.trim()) return "Email is required.";
        if (!form.password.trim()) return "Password is required.";
        return "";
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const err = validate();
        if (err) return setFormError(err);

        await login(form.email, form.password);
    };

    return (
        <Wrapper>

            {/* ❗ Анимация возврата на Home */}
            <BackButton onClick={() => navigate("/")}>
                ← Back to Home
            </BackButton>

            <Card>

                <Title>Welcome Back</Title>
                <Subtitle>Log in to your Santa Bank account</Subtitle>

                <Form onSubmit={onSubmit}>
                    <Field>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={onChange}
                            placeholder="example@mail.com"
                        />
                    </Field>

                    <Field>
                        <Label>Password</Label>
                        <PasswordInput
                            name="password"
                            value={form.password}
                            onChange={onChange}
                            placeholder="Enter password"
                        />
                    </Field>

                    {(formError || error) && (
                        <ErrorBox>
                            <AlertCircle size={16} />
                            <span>{formError || error}</span>
                        </ErrorBox>
                    )}

                    <SubmitBtn disabled={authLoading}>
                        {authLoading ? "Logging in..." : "Login"}
                    </SubmitBtn>

                    <BottomText>
                        Don't have an account?{" "}
                        <button type="button" onClick={() => navigate("/register")}>
                            Register
                        </button>
                    </BottomText>
                </Form>
            </Card>
        </Wrapper>
    );
};

export default Login;
