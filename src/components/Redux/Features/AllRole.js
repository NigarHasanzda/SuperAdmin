import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../..//api";

export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () => {
  const res = await api.get("/api/roles");
  return res.data;
});

export const addRole = createAsyncThunk("roles/addRole", async (roleData) => {
  const res = await api.post("/api/roles", roleData);
  return res.data;
});


export const updateRole = createAsyncThunk("roles/updateRole", async (roleData) => {
  const { id, ...data } = roleData;
  const res = await api.put(`/api/roles/${id}`, data);
  return res.data;
});

export const deleteRole = createAsyncThunk("roles/deleteRole", async (id) => {
  await api.delete(`/api/roles/${id}`);
  return id;
});

const roleSlice = createSlice({
  name: "roles",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 📌 fetchRoles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 📌 addRole
      .addCase(addRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 📌 updateRole
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((r) => r.id === action.payload.id);
        if (index >= 0) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 📌 deleteRole
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default roleSlice.reducer;
