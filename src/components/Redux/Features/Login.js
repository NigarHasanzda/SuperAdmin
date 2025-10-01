import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const AuthUrl = "http://194.163.173.179:3300/api/auth/login";


export const loginAdmin = createAsyncThunk("auth/loginAdmin", async ({ phone, password }) => {
  const res = await axios.post(AuthUrl, { phone, password }, { headers: { "Content-Type": "application/json" } });
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data));
  console.log("Login edən istifadəçi:", res.data);
  return res.data;
});


export const logoutAdmin = createAsyncThunk("auth/logoutAdmin", async () => {
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
      .addCase(loginAdmin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Xəta baş verdi";
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
