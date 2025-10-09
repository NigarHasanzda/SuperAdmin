import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api";

export const getAllLog=createAsyncThunk("get/log",async()=>{
    const data=await api.get("/api/logs");
    return data.data
});
 const initialState={
    logs:[],
    loading: false,
    error: null,

 }

 export const logSLice=createSlice({
    name:"logs",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getAllLog.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllLog.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.logs = action.payload || [];
      })
      .addCase(getAllLog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong!";
      });
    }
 })

 export default logSLice.reducer