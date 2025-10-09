import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

// ===============================
// BUSINESS GETTERS
// ===============================
export const fetchAllBusinesses = createAsyncThunk(
  "businesses/fetchAllBusinesses",
  async () => {
    const res = await api.get("/api/businesses");
    return res.data;
  }
);

export const fetchBusinessById = createAsyncThunk(
  "businesses/fetchBusinessById",
  async (id) => {
    const res = await api.get(`/api/businesses/${id}`);
    return res.data;
  }
);

export const fetchBranchesByAdmin = createAsyncThunk(
  "businesses/fetchBranchesByAdmin",
  async (adminId) => {
    const res = await api.get(`/api/businesses/${adminId}/branches`);
    return res.data;
  }
);

export const fetchAllBranches = createAsyncThunk(
  "businesses/fetchAllBranches",
  async () => {
    const res = await api.get("/api/businesses/branches");
    return res.data;
  }
);

export const fetchBranchById = createAsyncThunk(
  "businesses/fetchBranchById",
  async (branchId) => {
    const res = await api.get(`/api/businesses/branches/${branchId}`);
    return res.data;
  }
);

export const fetchBranchStatsById = createAsyncThunk(
  "businesses/fetchBranchStatsById",
  async (branchId) => {
    const res = await api.get(`/api/businesses/branches/${branchId}/stats`);
    return res.data;
  }
);

export const fetchBranchesStats = createAsyncThunk(
  "businesses/fetchBranchesStats",
  async () => {
    const res = await api.get("/api/businesses/branches/stats");
    return res.data;
  }
);

// ===============================
// BUSINESS ACTIONS (BLOCK / UNBLOCK / APPROVE / REJECT)
// ===============================

// 🔒 Şirkəti blokla
export const blockBusiness = createAsyncThunk(
  "businesses/blockBusiness",
  async ({ companyId, reason }) => {
    const res = await api.put("/api/businesses/block", { companyId, reason });
    return { id: companyId, status: "INACTIVE", reason, res: res.data };
  }
);

// 🔓 Şirkətin blokunu aç
export const unblockBusiness = createAsyncThunk(
  "businesses/unblockBusiness",
  async (id) => {
    const res = await api.put(`/api/businesses/${id}/unblock`);
    return { id, status: "ACTIVE", res: res.data };
  }
);

// ✅ Şirkəti təsdiqlə
export const approveBusiness = createAsyncThunk(
  "businesses/approveBusiness",
  async (id) => {
    const res = await api.put(`/api/businesses/${id}/approve`);
    return { id, status: "APPROVED", res: res.data };
  }
);

// ❌ Şirkəti rədd et
export const rejectBusiness = createAsyncThunk(
  "businesses/rejectBusiness",
  async ({ companyId, reason }) => {
    const res = await api.put(`/api/businesses/reject`, { companyId, reason });
    return { id: companyId, status: "REJECTED", reason, res: res.data };
  }
);

//=====================
//Aproved Reject
//==================
// ✅ Təsdiqlənmiş şirkətləri gətir
export const fetchApprovedBusinesses = createAsyncThunk(
  "businesses/fetchApprovedBusinesses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/businesses/approved");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// ⏳ Gözləmədə olan şirkətləri gətir
export const fetchPendingBusinesses = createAsyncThunk(
  "businesses/fetchPendingBusinesses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/businesses/pending");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);



// ===============================
// SLICE
// ===============================
const businessesSlice = createSlice({
  name: "businesses",
  initialState: {
    all: [],
    single: null,
    branches: [],
    branch: null,
    branchesStats: [],
    branchStats: null,
      approved: [],   // ✅ əlavə edildi
  pending: [],    // ✅ əlavə edildi
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET-lər
      .addCase(fetchAllBusinesses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchBusinessById.fulfilled, (state, action) => { state.single = action.payload; })
      .addCase(fetchBranchesByAdmin.fulfilled, (state, action) => { state.branches = action.payload; })
      .addCase(fetchAllBranches.fulfilled, (state, action) => { state.branches = action.payload.content || []; })
      .addCase(fetchBranchById.fulfilled, (state, action) => { state.branch = action.payload; })
      .addCase(fetchBranchStatsById.fulfilled, (state, action) => { state.branchStats = action.payload; })
      .addCase(fetchBranchesStats.fulfilled, (state, action) => { state.branchesStats = action.payload; })

      builder
  // Approved
  .addCase(fetchApprovedBusinesses.pending, (state) => { state.loading = true; state.error = null; })
  .addCase(fetchApprovedBusinesses.fulfilled, (state, action) => { state.loading = false; state.approved = action.payload; })
  .addCase(fetchApprovedBusinesses.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || action.error.message; })

  // Pending
  .addCase(fetchPendingBusinesses.pending, (state) => { state.loading = true; state.error = null; })
  .addCase(fetchPendingBusinesses.fulfilled, (state, action) => { state.loading = false; state.pending = action.payload; })
  .addCase(fetchPendingBusinesses.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || action.error.message; })

      // PUT-lər (bloklama və s.)
      .addCase(blockBusiness.fulfilled, (state, action) => {
        const index = state.all.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.all[index].status = "INACTIVE";
          state.all[index].blockReason = action.payload.reason;
        }
      })
      .addCase(unblockBusiness.fulfilled, (state, action) => {
        const index = state.all.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.all[index].status = "ACTIVE";
          state.all[index].blockReason = null;
        }
      })
      .addCase(approveBusiness.fulfilled, (state, action) => {
        const index = state.all.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.all[index].status = "APPROVED";
      })
      .addCase(rejectBusiness.fulfilled, (state, action) => {
        const index = state.all.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.all[index].status = "REJECTED";
          state.all[index].rejectReason = action.payload.reason;
        }
      });
  },
});

export default businessesSlice.reducer;
