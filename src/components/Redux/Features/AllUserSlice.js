import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as db from "../../../static/mockDb";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () =>
  db.getUsers()
);

export const deleteUser = createAsyncThunk("users/deleteUser", async (id) =>
  db.deleteUser(id)
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const existingUser = state.users.list.find((u) => u.id === id);
      if (!existingUser) throw new Error("No users found");

      const body = {
        name: userData.name ?? existingUser.name,
        surname: userData.surname ?? existingUser.surname,
        email: userData.email ?? existingUser.email,
        phone: userData.phone ?? existingUser.phone,
        birthday: userData.birthday ?? existingUser.birthday,
        hasBusiness: existingUser.hasBusiness ?? false,
      };

      return db.updateUser(id, body);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.list.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export default usersSlice.reducer;
