import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as db from "../../../static/mockDb";

export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () =>
  db.getRoles()
);

export const addRole = createAsyncThunk("roles/addRole", async (roleData) =>
  db.addRole(roleData)
);

export const updateRole = createAsyncThunk("roles/updateRole", async (roleData) =>
  db.updateRole(roleData)
);

export const deleteRole = createAsyncThunk("roles/deleteRole", async (id) =>
  db.deleteRole(id)
);

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
        state.error = action.payload || action.error.message;
      })
      .addCase(addRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default roleSlice.reducer;
