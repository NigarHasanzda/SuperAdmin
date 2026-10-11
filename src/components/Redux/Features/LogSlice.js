import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as db from "../../../static/mockDb";

export const getAllLog = createAsyncThunk("get/log", async () => db.getLogs());

const initialState = {
  logs: [],
  loading: false,
  error: null,
  status: "idle",
};

export const logSLice = createSlice({
  name: "logs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllLog.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllLog.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.logs = action.payload || [];
      })
      .addCase(getAllLog.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload || "Something went wrong!";
      });
  },
});

export default logSLice.reducer;
