// ✅ Redux/Features/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api"; // Axios instance (baseURL daxil edilməlidir)

// 🔹 Admin login
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // ✅ Düzgün endpoint və parametrlər
      const res = await api.post("/api/auth/login/admin", {
        email,
        password,
      });

      // 🔹 Token və istifadəçi məlumatlarını yadda saxla
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user || res.data));

      // 🔹 Token müddətini (24 saat) təyin et
      const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem("tokenExpiration", expirationTime.toString());

      // 🔹 Refresh token varsa, yadda saxla
      if (res.data.refreshToken)
        localStorage.setItem("refreshToken", res.data.refreshToken);

      return res.data;
    } catch (err) {
      console.error("❌ Login error:", err.response?.data);
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.validations?.[0]?.message ||
          "Email və ya şifrə yanlışdır"
      );
    }
  }
);

// 🔹 Admin logout
export const logoutAdmin = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await api.post(
          "/api/auth/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (err) {
      console.error("Logout error:", err);
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    } finally {
      // 🔹 Lokal məlumatları təmizlə
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("refreshToken");
    }

    return null;
  }
);

// 🔹 Refresh token
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return rejectWithValue("Refresh token tapılmadı");

    try {
      const res = await api.post("/api/auth/refresh", { refreshToken });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      const expirationTime = new Date().getTime() + res.data.expiresIn * 1000;
      localStorage.setItem("tokenExpiration", expirationTime.toString());

      return res.data;
    } catch (err) {
      console.error("Refresh token error:", err.response?.data);
      return rejectWithValue(
        err.response?.data?.message || "Token yenilənməsi uğursuz oldu"
      );
    }
  }
);

// 🔹 Token müddətini yoxlayan funksiya
export const checkTokenExpiration = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;

  const expirationTime = localStorage.getItem("tokenExpiration");
  if (!expirationTime) return false;

  const currentTime = new Date().getTime();
  return currentTime > parseInt(expirationTime);
};

// 🔹 İlkin auth state
const getInitialAuthState = () => {
  let token = localStorage.getItem("token");
  let user = localStorage.getItem("user");

  // Token müddəti bitibsə təmizlə
  if (token && checkTokenExpiration()) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiration");
    token = null;
    user = null;
  }

  let parsedUser = null;
  try {
    parsedUser = user ? JSON.parse(user) : null;
  } catch {
    parsedUser = null;
  }

  return {
    token,
    user: parsedUser,
    isAuthenticated: Boolean(token && parsedUser && !checkTokenExpiration()),
  };
};

// 🔹 Redux Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...getInitialAuthState(),
    loading: false,
    error: null,
  },
  reducers: {
    clearExpiredToken: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = "Sessiya müddəti bitdi. Yenidən daxil olun.";
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔸 Login
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        console.log("✅ Login uğurlu:", state.user);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Giriş zamanı xəta baş verdi";
        state.isAuthenticated = false;
      })

      // 🔸 Logout
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })

      // 🔸 Refresh token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error =
          action.payload || "Token yenilənməsi alınmadı. Yenidən daxil olun.";
      });
  },
});

export const { clearExpiredToken } = authSlice.actions;
export default authSlice.reducer;
