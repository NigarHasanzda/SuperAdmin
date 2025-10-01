import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const AuthUrl = "http://194.163.173.179:3300/api/auth/login";

// Admin login thunk
export const loginAdmin = createAsyncThunk(
  "auth/loginUser",
  async ({ phone, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        AuthUrl,
        { phone, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        // Token və user-i localStorage-a yaz
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
             console.log("Login edən istifadəçi:", response.data);
        return response.data;
      }

      return rejectWithValue(response.data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Logout thunk
export const logoutAdmin = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Xəta baş verdi";
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
