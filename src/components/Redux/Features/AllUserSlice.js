import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api"; 

// 🔹 İstifadəçiləri gətir
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const res = await api.get("/api/persons");
  return res.data;
});

// 🔹 İstifadəçini sil
export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  await api.delete(`/api/persons/${id}`);
  return id;
});

// 🔹 İstifadəçini yenilə
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }) => {
    const res = await api.put(`/api/persons/${id}`, userData);
    return res.data;
  }
);

// 🔹 Slice
const usersSlice = createSlice({
  name: "users",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload);
      })

      // Update
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.list.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default usersSlice.reducer;
