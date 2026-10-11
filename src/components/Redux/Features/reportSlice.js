import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as db from "../../../static/mockDb";

export const fetchReportTransactions = createAsyncThunk(
  "reports/fetchReportTransactions",
  async () => db.getReports()
);

export const answerReportTransaction = createAsyncThunk(
  "reports/answerReportTransaction",
  async ({ reportTransactionId, message }, { rejectWithValue }) => {
    try {
      return db.answerReport(reportTransactionId, message);
    } catch (err) {
      return rejectWithValue(
        err.message || "Cavab göndərilərkən xəta baş verdi"
      );
    }
  }
);

const reportTransactionsSlice = createSlice({
  name: "reports",
  initialState: {
    list: [],
    loading: false,
    error: null,
    answerLoading: false,
    answerSuccess: false,
  },
  reducers: {
    clearReportStatus: (state) => {
      state.answerLoading = false;
      state.answerSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchReportTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(answerReportTransaction.pending, (state) => {
        state.answerLoading = true;
        state.answerSuccess = false;
        state.error = null;
      })
      .addCase(answerReportTransaction.fulfilled, (state) => {
        state.answerLoading = false;
        state.answerSuccess = true;
      })
      .addCase(answerReportTransaction.rejected, (state, action) => {
        state.answerLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReportStatus } = reportTransactionsSlice.actions;
export default reportTransactionsSlice.reducer;
