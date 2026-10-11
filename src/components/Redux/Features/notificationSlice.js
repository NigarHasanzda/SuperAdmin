import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as db from "../../../static/mockDb";

export const fetchBroadcasts = createAsyncThunk(
  "notifications/fetchBroadcasts",
  async () => db.getNotifications()
);

export const sendBroadcast = createAsyncThunk(
  "notifications/sendBroadcast",
  async (data) => db.sendNotification(data)
);

export const deleteBroadcast = createAsyncThunk(
  "notifications/deleteBroadcast",
  async (id) => db.deleteNotification(id)
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBroadcasts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBroadcasts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBroadcasts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendBroadcast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendBroadcast.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.list = [action.payload, ...state.list];
        }
      })
      .addCase(sendBroadcast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteBroadcast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBroadcast.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((n) => n.id !== action.payload);
      })
      .addCase(deleteBroadcast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default notificationsSlice.reducer;
