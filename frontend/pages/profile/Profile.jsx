// src/pages/profile/Profile.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, KeyRound, Save } from "lucide-react";

import Typography from "../../components/ui/Typography";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import PasswordInput from "../../components/ui/PasswordInput";
import { useUser } from "../../contexts/UserContext";
import { useCards } from "../../contexts/CardsContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { EMPLOYMENT_STATUS } from "../../utils/constants";
import { calcCreditDebt } from "../../utils/cardGuards";
import { bankApi } from "../../api/bankApi";

import {
  Wrapper,
  HeaderRow,
  Subtitle,
  Actions,
  Hero,
  HeroLeft,
  Avatar,
  HeroMeta,
  HeroTitle,
  HeroActions,
  CopyButton,
  Badge,
  BadgeDot,
  Grid,
  InfoCard,
  CardTitle,
  Rows,
  Row,
  RowLabel,
  RowValue,
  FormGrid,
  Field,
  FieldLabel,
  FieldHint,
  FieldError,
  Banner,
  BannerText,
} from "./Profile.styles";

const initials = (name, surname) => {
  const a = String(name || "").trim();
  const b = String(surname || "").trim();
  const i1 = a ? a[0].toUpperCase() : "?";
  const i2 = b ? b[0].toUpperCase() : "";
  return `${i1}${i2}`;
};

const Profile = () => {
  const { user, updateUser, employmentStatus, isEmployed, setEmploymentStatus } = useUser();
  const { paymentCards: cards = [], cardsMeta } = useCards();
  const notifications = useNotifications();

  const [profile, setProfile] = useState(() => ({
    // Name/surname/birthday are locked (cannot be changed from UI)
    name: user?.name || "",
    surname: user?.surname || "",
    birthday: user?.birthday || "",
    salary: user?.salary ?? 0,
    // Phone and salary can be editable depending on employmentStatus
    phone: user?.phone || "",
  }));

  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null); // {type,text}

  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);

  const status = useMemo(() => {
    return employmentStatus === EMPLOYMENT_STATUS.EMPLOYED
      ? { text: "Employed", variant: "success" }
      : { text: "Unemployed", variant: "error" };
  }, [employmentStatus]);

  const creditCardId = useMemo(() => {
    const list = Array.isArray(cards) ? cards : [];
    const credit = list.find((c) => String(c?.type || "").toLowerCase() === "credit");
    return credit?.id != null ? Number(credit.id) : null;
  }, [cards]);

  const extractCurrentDebt = (details) => {
    const v = details?.currentDebt ?? details?.c_current_debt ?? details?.current_debt ?? details?.debt ?? details?.c_debt;
    const n = Number(v);
    if (Number.isFinite(n)) return n;

    // Backend often does not send currentDebt. Compute it from loanAmount & available balance.
    const limit = Number(details?.loanAmount ?? details?.c_loan_amount ?? 0);
    const available = Number(details?.balance ?? details?.c_balance ?? 0);
    if (Number.isFinite(limit) && limit > 0 && Number.isFinite(available)) {
      return calcCreditDebt({ loanAmount: limit, balance: available });
    }
    return null;
  };

  const getCurrentCreditDebt = async () => {
    if (!user?.id || !creditCardId) return { hasCredit: false, debt: 0, debtKnown: true };

    // Try cached details first
    const cached = cardsMeta?.[String(creditCardId)] || cardsMeta?.[creditCardId];
    const cachedDebt = extractCurrentDebt(cached);
    if (cachedDebt != null) return { hasCredit: true, debt: cachedDebt, debtKnown: true };

    // Fallback: ask backend for up-to-date details
    try {
      const fresh = await bankApi.getCardDetails({ userId: user.id, cardId: creditCardId });
      const freshDebt = extractCurrentDebt(fresh);
      if (freshDebt != null) return { hasCredit: true, debt: freshDebt, debtKnown: true };
    } catch {
      // ignore
    }

    return { hasCredit: true, debt: 0, debtKnown: false };
  };

  const [employmentChanging, setEmploymentChanging] = useState(false);

  const onEmploymentStatusChange = async (nextStatus) => {
    if (!user?.id) {
      notifications.pushError("Please login first.");
      return;
    }

    const next = nextStatus === EMPLOYMENT_STATUS.EMPLOYED ? EMPLOYMENT_STATUS.EMPLOYED : EMPLOYMENT_STATUS.UNEMPLOYED;
    if (next === employmentStatus) return;

    setProfileMsg(null);

    // Rule: if user has a credit card and currentDebt > 0, they cannot change employment status.
    setEmploymentChanging(true);
    try {
      const { hasCredit, debt, debtKnown } = await getCurrentCreditDebt();
      if (hasCredit) {
        if (!debtKnown) {
          notifications.pushWarning("Unable to verify your credit debt right now. Please open your credit card details, refresh, and try again.");
          return;
        }
        if (Number(debt || 0) > 0) {
          notifications.pushError("You have an active credit debt. Please repay it first, then you can change employment status.");
          return;
        }
      }

      // Apply frontend-only status
      setEmploymentStatus(next);

      // Salary must reset to 0 on status change (rule). We also push it to backend.
      const phone = String(profile.phone || user?.phone || "").trim();
      const safePhone = phone || (user?.phone || "");

      const res = await bankApi.updateUser({
        user_id: user.id,
        user_name: user?.name || profile.name,
        user_surname: user?.surname || profile.surname,
        user_birthday: user?.birthday || profile.birthday || null,
        user_salary: 0,
        user_phone_number: safePhone,
        user_password: "",
      });

      updateUser({
        ...user,
        phone: res?.userPhoneNumber ?? res?.user_phone_number ?? res?.phone ?? safePhone,
        name: res?.userName ?? res?.user_name ?? res?.name ?? (user?.name || profile.name),
        surname: res?.userSurname ?? res?.user_surname ?? res?.surname ?? (user?.surname || profile.surname),
        birthday: res?.userBirthday ?? res?.user_birthday ?? res?.birthday ?? (user?.birthday || profile.birthday),
        salary: Number(res?.userSalary ?? res?.user_salary ?? 0),
      });

      setProfile((p) => ({ ...p, salary: 0 }));
      notifications.pushInfo("Employment status updated. Salary was reset to 0. You can set a new salary and save.");
    } catch (err) {
      notifications.pushError(err?.message || "Failed to update employment status");
    } finally {
      setEmploymentChanging(false);
    }
  };

  const onProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileMsg(null);
    // Editable fields:
    // - phone: always editable
    // - salary: editable only if EMPLOYED (frontend rule)
    if (name === "phone") {
      setProfile((p) => ({ ...p, phone: value }));
      return;
    }
    if (name === "salary") {
      if (!isEmployed) return;
      // keep only digits (no decimals) for salary
      const digits = String(value || "").replace(/\D/g, "");
      setProfile((p) => ({ ...p, salary: digits === "" ? "" : Number(digits) }));
      return;
    }
  };

  const copy = async (txt) => {
    try {
      await navigator.clipboard.writeText(String(txt || ""));
      setProfileMsg({ type: "success", text: "Copied" });
      setTimeout(() => setProfileMsg(null), 800);
    } catch {
      // ignore
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg(null);

    if (!user?.id) {
      setProfileMsg({ type: "error", text: "Please login first." });
      return;
    }

    // Editable: phone (always) and salary (only when EMPLOYED)
    const phone = String(profile.phone || "").trim();
    if (!phone.startsWith("+994") || phone.length < 13) {
      setProfileMsg({ type: "error", text: "Enter a valid Azerbaijan phone number (+994xxxxxxxxx)." });
      return;
    }

    const salaryToSend = isEmployed ? Number(profile.salary || 0) : 0;
    if (isEmployed && (!Number.isFinite(salaryToSend) || salaryToSend < 0)) {
      setProfileMsg({ type: "error", text: "Salary must be a non-negative number." });
      return;
    }

    try {
      setSaving(true);

      const res = await bankApi.updateUser({
        user_id: user.id,
        // Locked fields — always send existing values to keep backend happy
        user_name: user?.name || profile.name,
        user_surname: user?.surname || profile.surname,
        user_birthday: user?.birthday || profile.birthday || null,
        user_salary: salaryToSend,
        // Editable field
        user_phone_number: phone,
        // Not used by backend in ChangeUserInformationService, but exists in DTO
        user_password: "",
      });

      // Backend returns UserResponse
      updateUser({
        ...user,
        phone: res?.userPhoneNumber ?? res?.user_phone_number ?? res?.phone ?? phone,
        // Keep locked values from server if returned, otherwise preserve current
        name: res?.userName ?? res?.user_name ?? res?.name ?? (user?.name || profile.name),
        surname: res?.userSurname ?? res?.user_surname ?? res?.surname ?? (user?.surname || profile.surname),
        birthday: res?.userBirthday ?? res?.user_birthday ?? res?.birthday ?? (user?.birthday || profile.birthday),
        salary: Number(res?.userSalary ?? res?.user_salary ?? (user?.salary ?? profile.salary) ?? 0),
      });

      setProfileMsg({ type: "success", text: "Profile updated" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err?.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwdMsg(null);

    if (!user?.id) {
      setPwdMsg({ type: "error", text: "Please login first." });
      return;
    }

    if (!pwd.current || pwd.current.length < 6) {
      setPwdMsg({ type: "error", text: "Enter your current password." });
      return;
    }
    if (!pwd.next || pwd.next.length < 6) {
      setPwdMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (pwd.next !== pwd.confirm) {
      setPwdMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    try {
      setPwdLoading(true);
      const ok = await bankApi.checkPassword({ userId: user.id, currentPassword: pwd.current });
      if (!ok) {
        setPwdMsg({ type: "error", text: "Current password is wrong." });
        return;
      }

      await bankApi.updatePassword({ userId: user.id, newPassword: pwd.next });
      setPwdMsg({ type: "success", text: "Password updated" });
      setPwd({ current: "", next: "", confirm: "" });
    } catch (err) {
      setPwdMsg({ type: "error", text: err?.message || "Failed to update password" });
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <Wrapper>
      <HeaderRow>
        <div>
          <Typography size="xl" weight="800">
            Profile
          </Typography>
          <Subtitle>Manage personal info, security and preferences.</Subtitle>
        </div>

        <Actions>
          <Badge>
            <BadgeDot $variant={status.variant} /> {status.text}
          </Badge>
        </Actions>
      </HeaderRow>

      <Hero as={motion.div} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <HeroLeft>
          <Avatar>{initials(user?.name, user?.surname)}</Avatar>

          <HeroMeta>
            <HeroTitle>
              <Typography size="lg" weight="900">
                {user?.name} {user?.surname}
              </Typography>
            </HeroTitle>
            <Typography size="sm" color="muted">
              {user?.email || "—"}
            </Typography>
          </HeroMeta>
        </HeroLeft>

        <HeroActions>
          <CopyButton type="button" onClick={() => copy(user?.email)}>
            <Copy size={16} /> Copy email
          </CopyButton>
          <CopyButton type="button" onClick={() => copy(user?.id)}>
            <Copy size={16} /> Copy userId
          </CopyButton>
        </HeroActions>
      </Hero>

      <Grid>
        <InfoCard>
          <CardTitle>Profile info</CardTitle>

          <FormGrid onSubmit={saveProfile}>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <TextInput name="name" value={profile.name} onChange={onProfileChange} disabled />
              <FieldHint>Locked by the bank. Contact support to change it.</FieldHint>
            </Field>

            <Field>
              <FieldLabel>Surname</FieldLabel>
              <TextInput name="surname" value={profile.surname} onChange={onProfileChange} disabled />
              <FieldHint>Locked by the bank. Contact support to change it.</FieldHint>
            </Field>

            <Field>
              <FieldLabel>Phone</FieldLabel>
              <TextInput name="phone" value={profile.phone} onChange={onProfileChange} />
              <FieldHint>Example: +994xxxxxxxxx</FieldHint>
            </Field>

            <Field>
              <FieldLabel>Birthday</FieldLabel>
              <TextInput name="birthday" type="date" value={profile.birthday || ""} onChange={onProfileChange} disabled />
              <FieldHint>Locked by the bank.</FieldHint>
            </Field>

            <Field>
              <FieldLabel>Employment status</FieldLabel>
              <select
                value={employmentStatus}
                onChange={(e) => onEmploymentStatusChange(e.target.value)}
                disabled={employmentChanging || saving}
                style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "inherit" }}
              >
                <option value={EMPLOYMENT_STATUS.EMPLOYED}>Employed</option>
                <option value={EMPLOYMENT_STATUS.UNEMPLOYED}>Unemployed</option>
              </select>
              <FieldHint>
                This affects card creation rules. If you have a credit card with debt, you must repay it before changing this.
              </FieldHint>
            </Field>

            <Field>
              <FieldLabel>Salary (AZN)</FieldLabel>
              <TextInput
                name="salary"
                type="number"
                value={profile.salary}
                onChange={onProfileChange}
                disabled={!isEmployed || employmentChanging}
              />
              <FieldHint>
                {isEmployed
                  ? "Editable. Used for credit limit calculation."
                  : "Unemployed users cannot set salary. It is forced to 0."}
              </FieldHint>
            </Field>

            <div style={{ display: "flex", alignItems: "end", gap: 10 }}>
              <Button type="submit" disabled={saving}>
                <Save size={18} /> {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </FormGrid>

          {profileMsg && (
            <Banner style={{ marginTop: 14, borderColor: profileMsg.type === "error" ? "rgba(220,38,38,.35)" : undefined }}>
              <BannerText>
                {profileMsg.type === "success" ? <Check size={16} style={{ marginRight: 8 }} /> : null}
                {profileMsg.text}
              </BannerText>
            </Banner>
          )}
        </InfoCard>

        <InfoCard>
          <CardTitle>
            Security
          </CardTitle>

          <Rows>
            <Row>
              <div>
                <RowLabel>User ID</RowLabel>
                <RowValue>{user?.id ?? "—"}</RowValue>
              </div>
              <CopyButton type="button" onClick={() => copy(user?.id)}>
                <Copy size={16} /> Copy
              </CopyButton>
            </Row>
            <Row>
              <div>
                <RowLabel>Email</RowLabel>
                <RowValue>{user?.email ?? "—"}</RowValue>
              </div>
              <CopyButton type="button" onClick={() => copy(user?.email)}>
                <Copy size={16} /> Copy
              </CopyButton>
            </Row>
          </Rows>

          <div style={{ height: 14 }} />

          <form onSubmit={changePassword}>
            <Field>
              <FieldLabel>Current password</FieldLabel>
              <PasswordInput
                value={pwd.current}
                onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
                placeholder="Current password"
              />
            </Field>

            <Field>
              <FieldLabel>New password</FieldLabel>
              <PasswordInput
                value={pwd.next}
                onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
                placeholder="New password"
              />
            </Field>

            <Field>
              <FieldLabel>Confirm new password</FieldLabel>
              <PasswordInput
                value={pwd.confirm}
                onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="Confirm new password"
              />
            </Field>

            {pwdMsg?.type === "error" ? <FieldError>{pwdMsg.text}</FieldError> : null}
            {pwdMsg?.type === "success" ? <FieldHint style={{ fontWeight: 700 }}>{pwdMsg.text}</FieldHint> : null}

            <div style={{ marginTop: 10 }}>
              <Button type="submit" variant="secondary" disabled={pwdLoading}>
                <KeyRound size={18} /> {pwdLoading ? "Updating..." : "Change password"}
              </Button>
            </div>
          </form>
        </InfoCard>
      </Grid>
    </Wrapper>
  );
};

export default Profile;
