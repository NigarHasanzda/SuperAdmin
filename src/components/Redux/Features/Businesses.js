import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as db from "../../../static/mockDb";

export const fetchAllBusinesses = createAsyncThunk(
  "businesses/fetchAllBusinesses",
  async () => db.getAllBusinesses()
);

export const fetchBusinessById = createAsyncThunk(
  "businesses/fetchBusinessById",
  async (id) => db.getBusinessById(id)
);

export const fetchApprovedBusinesses = createAsyncThunk(
  "businesses/fetchApprovedBusinesses",
  async () => db.getApprovedBusinesses()
);

export const fetchPendingBusinesses = createAsyncThunk(
  "businesses/fetchPendingBusinesses",
  async () => db.getPendingBusinesses()
);

export const searchApprovedBusinesses = createAsyncThunk(
  "businesses/searchApprovedBusinesses",
  async (companyName) => db.searchBusinesses(companyName, true)
);

export const searchPendingBusinesses = createAsyncThunk(
  "businesses/searchPendingBusinesses",
  async (companyName) => db.searchBusinesses(companyName, false)
);

export const approveBusiness = createAsyncThunk(
  "businesses/approveBusiness",
  async (id) => {
    await db.patchBusiness(id, { status: "ACTIVE" });
    return { id, status: "ACTIVE" };
  }
);

export const rejectBusiness = createAsyncThunk(
  "businesses/rejectBusiness",
  async ({ companyId, reason }) => {
    await db.patchBusiness(companyId, {
      status: "REJECTED",
      rejectReason: reason,
    });
    return { id: companyId, status: "REJECTED", reason };
  }
);

export const blockBusiness = createAsyncThunk(
  "businesses/blockBusiness",
  async ({ companyId, reason }) => {
    await db.patchBusiness(companyId, {
      status: "INACTIVE",
      blockReason: reason,
    });
    return { id: companyId, status: "INACTIVE", reason };
  }
);

export const unblockBusiness = createAsyncThunk(
  "businesses/unblockBusiness",
  async (id) => {
    await db.patchBusiness(id, { status: "ACTIVE", blockReason: null });
    return { id, status: "ACTIVE" };
  }
);

export const acceptTIN = createAsyncThunk("businesses/acceptTIN", async (id) => {
  await db.patchBusiness(id, { tinStatus: "ACCEPTED" });
  return { id, status: "ACCEPTED" };
});

export const rejectTIN = createAsyncThunk(
  "businesses/rejectTIN",
  async ({ id, reason }) => {
    if (!reason) throw new Error("Reason required");
    await db.patchBusiness(id, {
      tinStatus: "REJECTED",
      tinRejectReason: reason,
    });
    return { id, status: "REJECTED", reason };
  }
);

const businessesSlice = createSlice({
  name: "businesses",
  initialState: {
    all: [],
    single: null,
    approved: [],
    pending: [],
    searchApprovedResults: [],
    searchPendingResults: [],
    loading: false,
    searchLoading: false,
    error: null,
    tinAccepting: false,
    tinRejecting: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBusinesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchBusinessById.fulfilled, (state, action) => {
        state.single = action.payload;
      })
      .addCase(fetchApprovedBusinesses.fulfilled, (state, action) => {
        state.approved = action.payload;
      })
      .addCase(fetchPendingBusinesses.fulfilled, (state, action) => {
        state.pending = action.payload;
      })
      .addCase(searchApprovedBusinesses.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchApprovedBusinesses.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchApprovedResults = action.payload;
      })
      .addCase(searchApprovedBusinesses.rejected, (state) => {
        state.searchLoading = false;
      })
      .addCase(searchPendingBusinesses.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchPendingBusinesses.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchPendingResults = action.payload;
      })
      .addCase(searchPendingBusinesses.rejected, (state) => {
        state.searchLoading = false;
      })
      .addCase(approveBusiness.fulfilled, (state, action) => {
        const b = state.all.find((item) => item.id === action.payload.id);
        if (b) b.status = action.payload.status;
      })
      .addCase(rejectBusiness.fulfilled, (state, action) => {
        const b = state.all.find((item) => item.id === action.payload.id);
        if (b) {
          b.status = "REJECTED";
          b.rejectReason = action.payload.reason;
        }
      })
      .addCase(blockBusiness.fulfilled, (state, action) => {
        const b = state.all.find((item) => item.id === action.payload.id);
        if (b) {
          b.status = "INACTIVE";
          b.blockReason = action.payload.reason;
        }
      })
      .addCase(unblockBusiness.fulfilled, (state, action) => {
        const b = state.all.find((item) => item.id === action.payload.id);
        if (b) {
          b.status = "ACTIVE";
          b.blockReason = null;
        }
      })
      .addCase(acceptTIN.pending, (state) => {
        state.tinAccepting = true;
      })
      .addCase(acceptTIN.fulfilled, (state, action) => {
        state.tinAccepting = false;
        const b = state.all.find((item) => item.id === action.payload.id);
        if (b) b.tinStatus = "ACCEPTED";
      })
      .addCase(acceptTIN.rejected, (state) => {
        state.tinAccepting = false;
      })
      .addCase(rejectTIN.pending, (state) => {
        state.tinRejecting = true;
      })
      .addCase(rejectTIN.fulfilled, (state, action) => {
        state.tinRejecting = false;
        const b = state.all.find((item) => item.id === action.payload.id);
        if (b) {
          b.tinStatus = "REJECTED";
          b.tinRejectReason = action.payload.reason;
        }
      })
      .addCase(rejectTIN.rejected, (state) => {
        state.tinRejecting = false;
      });
  },
});

export default businessesSlice.reducer;
