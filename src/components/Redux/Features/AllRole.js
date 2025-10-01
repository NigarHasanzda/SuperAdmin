import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://194.163.173.179:3300/api/roles";


export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});


export const addRole = createAsyncThunk("roles/addRole", async (roleData) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(API_URL, roleData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  return res.data;
});


export const updateRole = createAsyncThunk("roles/updateRole", async (roleData) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(API_URL, roleData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  return res.data;
});


export const deleteRole = createAsyncThunk("roles/deleteRole", async (id) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return id;
});

const roleSlice = createSlice({
  name: "roles",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => { state.loading = true; })
      .addCase(fetchRoles.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchRoles.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(addRole.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.list.findIndex(r => r.id === action.payload.id);
        if (index >= 0) state.list[index] = action.payload;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.list = state.list.filter(r => r.id !== action.payload);
      });
  },
});

export default roleSlice.reducer;
