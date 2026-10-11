import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  authenticateUser,
  registerUser,
  clearAuthStorage,
} from "../../../static/localAuth";

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = authenticateUser({ email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem("tokenExpiration", expirationTime.toString());

      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Email və ya şifrə yanlışdır");
    }
  }
);

export const registerAdmin = createAsyncThunk(
  "auth/registerAdmin",
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const user = registerUser({ email, password, name });
      return user;
    } catch (err) {
      return rejectWithValue(err.message || "Qeydiyyat uğursuz oldu");
    }
  }
);

export const logoutAdmin = createAsyncThunk("auth/logoutAdmin", async () => {
  clearAuthStorage();
  return null;
});

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("Token tapılmadı");
    const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem("tokenExpiration", expirationTime.toString());
    return { token, refreshToken: localStorage.getItem("refreshToken") };
  }
);

export const checkTokenExpiration = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;

  const expirationTime = localStorage.getItem("tokenExpiration");
  if (!expirationTime) return false;

  const currentTime = new Date().getTime();
  return currentTime > parseInt(expirationTime, 10);
};

const getInitialAuthState = () => {
  let token = localStorage.getItem("token");
  let user = localStorage.getItem("user");

  if (token && checkTokenExpiration()) {
    clearAuthStorage();
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

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...getInitialAuthState(),
    loading: false,
    error: null,
    registerSuccess: false,
  },
  reducers: {
    clearExpiredToken: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = "Sessiya müddəti bitdi. Yenidən daxil olun.";
    },
    clearRegisterStatus: (state) => {
      state.registerSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Giriş zamanı xəta baş verdi";
        state.isAuthenticated = false;
      })

      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerAdmin.fulfilled, (state) => {
        state.loading = false;
        state.registerSuccess = true;
        state.error = null;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Qeydiyyat zamanı xəta baş verdi";
        state.registerSuccess = false;
      })

      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
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

export const { clearExpiredToken, clearRegisterStatus } = authSlice.actions;
export default authSlice.reducer;
