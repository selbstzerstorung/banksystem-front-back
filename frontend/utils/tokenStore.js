// src/utils/tokenStore.js
// In-memory storage for access JWT.
// (Refresh token is stored in HttpOnly cookie and is not accessible from JS.)

let accessToken = null;

export const tokenStore = {
  get() {
    return accessToken;
  },
  set(token) {
    accessToken = token || null;
  },
  clear() {
    accessToken = null;
  },
};

export default tokenStore;
