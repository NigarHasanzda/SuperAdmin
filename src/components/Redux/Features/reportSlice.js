import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

export const fetchReportTransactions = createAsyncThunk("reports/fetchReportTransactions", async () => {
  const res = await api.get("/api/report-transactions");
  return res.data;
});

const reportTransactionsSlice = createSlice({
  name: "reports",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportTransactions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchReportTransactions.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchReportTransactions.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default reportTransactionsSlice.reducer;
