import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

// Wheel services (serviceType = 2)
export const fetchWheelServices = createAsyncThunk(
  "wheelServices/fetchWheelServices",
  async () => {
    const res = await api.get("/api/service-catalog-business-pages/wheel");
    return res.data;
  }
);

// Own business pages
export const fetchOwnBusinessPages = createAsyncThunk(
  "businessPages/fetchOwnBusinessPages",
  async () => {
    const res = await api.get("/api/service-catalog-business-pages/own");
    return res.data;
  }
);

// Auto wash services
export const fetchAutoWashServices = createAsyncThunk(
  "autoWash/fetchAutoWashServices",
  async () => {
    const res = await api.get("/api/service-catalog-business-pages/auto-wash");
    return res.data;
  }
);

// All business pages
export const fetchAllBusinessPages = createAsyncThunk(
  "businessPages/fetchAllBusinessPages",
  async () => {
    const res = await api.get("/api/service-catalog-business-pages");
    return res.data;
  }
);

const serviceSlice = createSlice({
  name: "services",
  initialState: {
    wheel: [],
    own: [],
    autoWash: [],
    all: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Wheel
    builder
      .addCase(fetchWheelServices.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchWheelServices.fulfilled, (state, action) => { state.loading = false; state.wheel = action.payload; })
      .addCase(fetchWheelServices.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });

    // Own business pages
    builder
      .addCase(fetchOwnBusinessPages.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOwnBusinessPages.fulfilled, (state, action) => { state.loading = false; state.own = action.payload; })
      .addCase(fetchOwnBusinessPages.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });

    // Auto wash
    builder
      .addCase(fetchAutoWashServices.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAutoWashServices.fulfilled, (state, action) => { state.loading = false; state.autoWash = action.payload; })
      .addCase(fetchAutoWashServices.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });

    // All business pages
    builder
      .addCase(fetchAllBusinessPages.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllBusinessPages.fulfilled, (state, action) => { state.loading = false; state.all = action.payload; })
      .addCase(fetchAllBusinessPages.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default serviceSlice.reducer;
