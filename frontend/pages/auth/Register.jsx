// src/pages/auth/Register.jsx
import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Typography from "../../components/ui/Typography";
import PasswordInput from "../../components/ui/PasswordInput";
import PhoneInput from "../../components/ui/PhoneInput";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import { bankApi } from "../../api/bankApi";
import { STORAGE_KEYS } from "../../utils/constants";

import {
    Wrapper,
    Card,
    Form,
    Field,
    Label,
    Input,
    CheckboxRow,
    ErrorBox,
    SubmitBtn,
    BottomText,
    BackButton
} from "./Register.styles";

const Register = () => {
    const navigate = useNavigate();
    const { register: registerUser, authLoading, error } = useAuth();
    const { clearUser } = useUser();

    // IMPORTANT: registration must not reuse a previous session.
    // If a user was logged in earlier, stale localStorage (userId/cardId) may cause
    // "mysterious cards" to appear right after registration. We hard-reset client session here.
    useEffect(() => {
        try {
            clearUser();
            localStorage.removeItem(STORAGE_KEYS.CURRENT_CARD_ID);
            localStorage.removeItem(STORAGE_KEYS.CARDS_META);
        } catch {
            // ignore
        }
        try {
            sessionStorage.removeItem(STORAGE_KEYS.PENDING_OTP_PASSWORD);
        } catch {
            // ignore
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [form, setForm] = useState({
        name: "",
        surname: "",
        email: "",
        phone: "+994",
        birthday: "",
        idCardSeries: "AZ",
        idCardNo: "",
        fin: "",
        codeword: "",
        employment: false,
        salary: "",
        password: "",
        confirmPassword: "",
    });

    const [formError, setFormError] = useState("");

    const onChange = (e) => {
        const { name, value } = e.target;

        if (name === "name" || name === "surname") {
            if (!/^[A-Za-zА-Яа-яЁё\s-]*$/.test(value)) return;
        }

        if (name === "phone") {
            if (!value.startsWith("+994")) return;
            if (value.length < 4) return;
        }

        setForm({ ...form, [name]: value });
        setFormError("");
    };

    const onCheckbox = (e) => {
        setForm({ ...form, employment: e.target.checked });
        setFormError("");
    };

    const validate = () => {
        if (!form.name.trim()) return "Name is required.";
        if (!form.surname.trim()) return "Surname is required.";
        if (!form.email.trim()) return "Email is required.";
        if (!form.phone.startsWith("+994") || form.phone.length < 13)
            return "Enter valid Azerbaijan phone number.";
        if (!form.birthday) return "Birthday is required.";
        if (!form.idCardSeries.trim()) return "ID card series is required.";
        if (!form.idCardNo.trim()) return "ID card number is required.";
        if (!form.fin.trim()) return "FIN is required.";
        if (!form.codeword.trim()) return "Codeword is required (for security).";
        if (form.password.length < 6)
            return "Password must be at least 6 characters.";
        if (form.password !== form.confirmPassword)
            return "Passwords do not match.";

        if (form.employment && (!form.salary || Number(form.salary) <= 0))
            return "Enter your salary.";

        return "";
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const validationError = validate();
        if (validationError) return setFormError(validationError);

        try {
            // 0) Unique values check
            const check = await bankApi.registrationCheck({
                email: form.email,
                idCardNo: form.idCardNo,
                fin: form.fin,
                phoneNumber: form.phone,
            });

            // Backend: RegistrationCheckResponse { isUnique: boolean, conflictField: string }
            if (check?.isUnique === false) {
                const fieldMap = {
                    email: "Email",
                    idCardNo: "ID card number",
                    fin: "FIN",
                    phoneNumber: "Phone number",
                };
                const nice = fieldMap[String(check?.conflictField || "")] || "One of the fields";
                setFormError(`${nice} is already used. Please choose another one.`);
                return;
            }

            // 1) Register
            const regPayload = {
                user_name: form.name,
                user_surname: form.surname,
                user_email: form.email,
                user_phone_number: form.phone,
                user_password: form.password,
                user_birthday: form.birthday,
                user_salary: form.employment ? Number(form.salary) : 0,
                user_id_card_no_series: form.idCardSeries,
                user_id_card_no: form.idCardNo,
                user_fin: form.fin,
                user_codeword: form.codeword,
            };

            const result = await registerUser(regPayload);
            if (result?.success) {
                // Store credentials temporarily to auto-login after OTP verification.
                // We use sessionStorage (cleared on tab close) and remove after success.
                try {
                    sessionStorage.setItem(STORAGE_KEYS.PENDING_OTP_PASSWORD, String(form.password || ""));
                    sessionStorage.setItem(STORAGE_KEYS.PENDING_OTP_EMAIL, String(form.email || ""));
                } catch {
                    // ignore
                }
                navigate("/otp/verify", { state: { email: form.email } });
            }
        } catch (err) {
            setFormError(err?.message || "Registration failed.");
        }
    };

    return (
        <Wrapper>
            <Card>
                <BackButton onClick={() => navigate("/")}>← Back to Home</BackButton>

                <Typography size="xl" weight="600" style={{ textAlign: "center" }}>
                    Create Account
                </Typography>

                <Typography
                    size="sm"
                    color="muted"
                    style={{ textAlign: "center", marginBottom: 20 }}
                >
                    Join Santa Bank in seconds
                </Typography>

                <Form onSubmit={onSubmit}>
                    <Field>
                        <Label>Name</Label>
                        <Input
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            placeholder="Enter your name"
                        />
                    </Field>

                    <Field>
                        <Label>Surname</Label>
                        <Input
                            name="surname"
                            value={form.surname}
                            onChange={onChange}
                            placeholder="Enter your surname"
                        />
                    </Field>

                    <Field>
                        <Label>Email</Label>
                        <Input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            placeholder="example@mail.com"
                        />
                    </Field>

                    <Field>
                        <Label>Phone Number (Azerbaijan)</Label>
                        <PhoneInput name="phone" value={form.phone} onChange={onChange} />
                    </Field>

                    <Field>
                        <Label>Birthday</Label>
                        <Input
                            name="birthday"
                            type="date"
                            value={form.birthday}
                            onChange={onChange}
                        />
                    </Field>

                    <Field>
                        <Label>ID Card series</Label>
                        <Input
                            name="idCardSeries"
                            value={form.idCardSeries}
                            onChange={onChange}
                            placeholder="AZ"
                            maxLength={4}
                        />
                    </Field>

                    <Field>
                        <Label>ID Card number</Label>
                        <Input
                            name="idCardNo"
                            value={form.idCardNo}
                            onChange={onChange}
                            placeholder="0000000"
                        />
                    </Field>

                    <Field>
                        <Label>FIN</Label>
                        <Input
                            name="fin"
                            value={form.fin}
                            onChange={onChange}
                            placeholder="FIN"
                        />
                    </Field>

                    <Field>
                        <Label>Codeword</Label>
                        <Input
                            name="codeword"
                            value={form.codeword}
                            onChange={onChange}
                            placeholder="Used to reset PIN"
                        />
                    </Field>

                    <CheckboxRow>
                        <input
                            type="checkbox"
                            checked={form.employment}
                            onChange={onCheckbox}
                        />
                        <span>I am employed</span>
                    </CheckboxRow>

                    {form.employment && (
                        <Field>
                            <Label>Salary (AZN)</Label>
                            <Input
                                type="number"
                                name="salary"
                                value={form.salary}
                                onChange={onChange}
                            />
                        </Field>
                    )}

                    <Field>
                        <Label>Password</Label>
                        <PasswordInput
                            name="password"
                            value={form.password}
                            onChange={onChange}
                        />
                    </Field>

                    <Field>
                        <Label>Confirm Password</Label>
                        <PasswordInput
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={onChange}
                        />
                    </Field>

                    {(formError || error) && (
                        <ErrorBox>
                            <AlertCircle size={16} />
                            <span>{formError || error}</span>
                        </ErrorBox>
                    )}

                    <SubmitBtn disabled={authLoading}>
                        {authLoading ? "Creating..." : "Create Account"}
                    </SubmitBtn>
                </Form>

                <BottomText>
                    Already have an account?
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            marginLeft: 4,
                            cursor: "pointer",
                            color: "#3b82f6",
                            fontWeight: 600,
                        }}
                    >
                        Login
                    </button>
                </BottomText>
            </Card>
        </Wrapper>
    );
};

export default Register;
