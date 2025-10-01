import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://194.163.173.179:3300";
const getToken = () => localStorage.getItem("token");


export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/api/persons`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});


export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  const token = getToken();
  await axios.delete(`${BASE_URL}/api/persons/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return id;
});


export const updateUser = createAsyncThunk("users/updateUser", async ({ id, userData }) => {
  const token = getToken();
  const res = await axios.put(`${BASE_URL}/api/persons/${id}`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});


const usersSlice = createSlice({
  name: "users",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter(u => u.id !== action.payload);
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const i = state.list.findIndex(u => u.id === action.payload.id);
        if (i !== -1) state.list[i] = action.payload;
      });
  },
});

export default usersSlice.reducer;
