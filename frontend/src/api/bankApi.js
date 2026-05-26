// src/api/bankApi.js
// Thin wrapper around the actual Spring Boot controllers.
// Endpoints and JSON shapes are matched 1-to-1 with the backend code.

import { apiMethods } from "./api.config";

// --- helpers ---
const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const toInt = (v) => {
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) ? n : 0;
};

export const bankApi = {
  // ---------- REGISTRATION / AUTH ----------
  registrationCheck: ({ email, idCardNo, fin, phoneNumber }) =>
    apiMethods.post("/api/registration/check", {
      email: String(email || "").trim(),
      idCardNo: String(idCardNo || "").trim(),
      fin: String(fin || "").trim(),
      phoneNumber: String(phoneNumber || "").trim(),
    }),

  register: (payload) =>
    apiMethods.post("/api/auth/register", {
      // Backend DTO = RegistrationRequest (snake_case)
      user_name: String(payload.user_name || "").trim(),
      user_surname: String(payload.user_surname || "").trim(),
      user_email: String(payload.user_email || "").trim(),
      user_phone_number: String(payload.user_phone_number || "").trim(),
      user_password: String(payload.user_password || "").trim(),
      user_birthday: payload.user_birthday || null, // "YYYY-MM-DD"
      user_salary: toNumber(payload.user_salary || 0),
      user_id_card_no_series: String(payload.user_id_card_no_series || "").trim(),
      user_id_card_no: String(payload.user_id_card_no || "").trim(),
      user_fin: String(payload.user_fin || "").trim(),
      user_codeword: String(payload.user_codeword || "").trim(),
    }),

  login: ({ email, password }) =>
    apiMethods.post("/api/auth/login", {
      // Backend LoginRequest uses setEmail/setPassword -> expects keys: email, password
      email: String(email || "").trim(),
      password: String(password || "").trim(),
    }),

  // ---------- OTP ----------
  otpSend: ({ email }) =>
    apiMethods.post("/api/otp/send", {
      email: String(email || "").trim(),
    }),

  otpVerify: ({ email, otpCode }) =>
    apiMethods.post("/api/otp/verify", {
      email: String(email || "").trim(),
      otpCode: toInt(otpCode),
    }),

  // ---------- CARDS (Dashboard) ----------
  getDashboardCards: ({ userId }) =>
    apiMethods.get(`/api/auth/login/${toNumber(userId)}/dashboard`),

  selectCard: ({ userId, cardId }) =>
    apiMethods.get(`/api/auth/login/${toNumber(userId)}/dashboard/${toNumber(cardId)}`),

  getCardDetails: ({ userId, cardId }) =>
    apiMethods.get(
      `/api/auth/login/${toNumber(userId)}/dashboard/${toNumber(cardId)}/details`
    ),

  // ---------- CARD CREATE ----------
  createDebitCard: ({ userId, ppn, currency, pin }) =>
    apiMethods.post(`/api/debit-cards/create`, {
      userId: toNumber(userId),
      ppn: String(ppn || "").trim(),
      currency: String(currency || "AZN").trim(),
      pin: String(pin || "").trim(),
    }),

  createCreditCard: ({ userId, ppn, currency, loanAmount, pin }) =>
    apiMethods.post(`/api/credit-cards/create`, {
      userId: toNumber(userId),
      ppn: String(ppn || "").trim(),
      currency: String(currency || "AZN").trim(),
      loanAmount: toNumber(loanAmount),
      pin: String(pin || "").trim(),
    }),

  // ---------- BLOCK / UNLOCK ----------
  blockCard: ({ userId, cardId }) =>
    apiMethods.post(`/api/${toNumber(userId)}/dashboard/${toNumber(cardId)}/block`, {}),

  unlockCard: ({ userId, cardId }) =>
    apiMethods.post(`/api/${toNumber(userId)}/dashboard/${toNumber(cardId)}/unlock`, {}),

  // ---------- RESET PIN (3 steps) ----------
  resetPinCheckPin: ({ userId, cardId, pin }) =>
    apiMethods.post(`/api/${toNumber(userId)}/dashboard/${toNumber(cardId)}/reset-pin`, {
      pin: String(pin || "").trim(),
    }),

  resetPinCheckCodeword: ({ userId, codeword, cardId }) =>
    apiMethods.post(
      `/api/${toNumber(userId)}/dashboard/${toNumber(cardId)}/reset-pin/codeword/check-codeword`,
      { codeword: String(codeword || "").trim() }
    ),

  resetPinUpdatePin: ({ userId, cardId, newPin }) =>
    apiMethods.post(
      `/api/${toNumber(userId)}/dashboard/${toNumber(cardId)}/reset-pin/new-pin/update-pin`,
      { newPin: String(newPin || "").trim() }
    ),

  // ---------- TRANSFER ----------
  transfer: ({ senderAccountNumber, receiverAccountNumber, amount, description }) =>
    apiMethods.post("/api/transfer", {
      senderAccountNumber: toNumber(senderAccountNumber),
      receiverAccountNumber: toNumber(receiverAccountNumber),
      amount: toNumber(amount),
      description: String(description || ""),
    }),

  // ---------- PAYMENTS ----------
  payUtility: ({ senderCardId, receiverCode, amount, serviceType }) =>
    apiMethods.post("/api/payments/pay", {
      senderCardId: toNumber(senderCardId),
      receiverCode: String(receiverCode || "").trim(),
      amount: toNumber(amount),
      serviceType: String(serviceType || "").trim(),
    }),

  // ---------- CASHBACK ----------
  cashbackGet: ({ userId }) => apiMethods.get(`/api/cashback/${toNumber(userId)}`),

  cashbackPay: ({ userId, amount, serviceType, receiverCode }) =>
    apiMethods.post("/api/cashback/pay", {
      userId: toNumber(userId),
      amount: toNumber(amount),
      serviceType: String(serviceType || "").trim(),
      receiverCode: String(receiverCode || "").trim(),
    }),

  cashbackTransfer: ({ userId, targetCardId, amount }) =>
    apiMethods.post("/api/cashback/transfer", {
      userId: toNumber(userId),
      targetCardId: toNumber(targetCardId),
      amount: toNumber(amount),
    }),

  // ---------- TRANSACTIONS ----------
  getRecentTransactions: ({ userId }) =>
    apiMethods.get(`/api/auth/login/transactions/recent/${toNumber(userId)}`),

  getCardTransactions: ({ cardId }) =>
    apiMethods.get(`/api/auth/login/transactions/card/${toNumber(cardId)}`),

  getTransactionById: ({ transactionId }) =>
    apiMethods.get(`/api/auth/login/transactions/${toNumber(transactionId)}`),

  // ---------- CREDIT CARD STATEMENTS ----------
  getStatementsByCard: ({ cardId }) =>
    apiMethods.get(`/api/credit-card-statements/${toNumber(cardId)}`),

  getLatestStatement: ({ cardId }) =>
    apiMethods.get(`/api/credit-card-statements/${toNumber(cardId)}/latest`),

  statementsJobInterest: ({ date } = {}) =>
    apiMethods.post(`/api/credit-card-statements/jobs/interest`, {}, { params: date ? { date } : {} }),
  statementsJobFinalize: ({ date } = {}) =>
    apiMethods.post(`/api/credit-card-statements/jobs/finalize`, {}, { params: date ? { date } : {} }),
  statementsJobDue: ({ date } = {}) =>
    apiMethods.post(`/api/credit-card-statements/jobs/due`, {}, { params: date ? { date } : {} }),

  // ---------- USER SETTINGS ----------
  updateUser: (request) =>
    apiMethods.put(`/api/dashboard/user-settings/change`, {
      ...request,
      user_id: toNumber(request?.user_id),
      user_salary: request?.user_salary == null ? null : toNumber(request.user_salary),
    }),

  checkPassword: ({ userId, currentPassword }) =>
    apiMethods.post(`/api/dashboard/user-settings/check-password`, {
      userId: toNumber(userId),
      currentPassword: String(currentPassword || ""),
    }),

  updatePassword: ({ userId, newPassword }) =>
    apiMethods.post(`/api/dashboard/user-settings/update-password`, {
      userId: toNumber(userId),
      newPassword: String(newPassword || ""),
    }),

  // ---------- TEST / DEV ----------
  creditCardRepayTest: ({ cardId, amount, businessDate }) =>
    apiMethods.post(`/api/test/credit-card/repay`, {
      cardId: toNumber(cardId),
      amount: toNumber(amount),
      businessDate: businessDate || null, // "YYYY-MM-DD"
    }),
};

export default bankApi;
