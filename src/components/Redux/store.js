import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Features/Login.js"
import usersSlice from "./Features/AllUserSlice.js"
import businessSlice from "./Features/Businesses.js"
import roleSlice from "./Features/AllRole.js"
import adsSlice from "./Features/AdsSlice.js"
import categorySlice from "./Features/CategorySlice.js"

const store = configureStore({
  reducer: {
    auth: authSlice,
    businesses:businessSlice,
    users:usersSlice,
    roles:roleSlice,
    ads:adsSlice,
    categories:categorySlice,
  },
});

export default store;
