import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://194.163.173.179:3300";
const getToken = () => localStorage.getItem("token");


export const fetchAllBusinesses = createAsyncThunk("businesses/fetchAllBusinesses", async () => {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/api/businesses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

export const fetchBusinessById = createAsyncThunk("businesses/fetchBusinessById", async (id) => {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/api/businesses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});


export const fetchBranchesByAdmin = createAsyncThunk("businesses/fetchBranchesByAdmin", async (adminId) => {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/api/businesses/${adminId}/branches`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

export const fetchAllBranches = createAsyncThunk("businesses/fetchAllBranches", async () => {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/api/businesses/branches`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

export const fetchBranchById = createAsyncThunk("businesses/fetchBranchById", async (branchId) => {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/api/businesses/branches/${branchId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

export const fetchBranchStatsById = createAsyncThunk("businesses/fetchBranchStatsById", async (branchId) => {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/api/businesses/branches/${branchId}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

export const fetchBranchesStats = createAsyncThunk("businesses/fetchBranchesStats", async () => {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/api/businesses/branches/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

const businessesSlice = createSlice({
  name: "businesses",
  initialState: {
    all: [],
    single: null,
    branches: [],
    branch: null,
    branchesStats: [],
    branchStats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBusinesses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllBusinesses.fulfilled, (state, action) => { state.loading = false; state.all = action.payload; })
      .addCase(fetchAllBusinesses.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(fetchBusinessById.fulfilled, (state, action) => { state.single = action.payload; })
      .addCase(fetchBranchesByAdmin.fulfilled, (state, action) => { state.branches = action.payload; })
      .addCase(fetchAllBranches.fulfilled, (state, action) => { state.branches = action.payload.content || []; })
      .addCase(fetchBranchById.fulfilled, (state, action) => { state.branch = action.payload; })
      .addCase(fetchBranchStatsById.fulfilled, (state, action) => { state.branchStats = action.payload; })
      .addCase(fetchBranchesStats.fulfilled, (state, action) => { state.branchesStats = action.payload; });
  },
});

export default businessesSlice.reducer;
