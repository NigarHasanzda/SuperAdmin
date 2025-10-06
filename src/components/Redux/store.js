import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Features/Login.js"
import usersSlice from "./Features/AllUserSlice.js"
import businessSlice from "./Features/Businesses.js"
import roleSlice from "./Features/AllRole.js"
import adsSlice from "./Features/AdsSlice.js"
import categorySlice from "./Features/CategorySlice.js"
import productSlice from "./Features/ProductSlice.js"
import profileSlice from "./Features/ProfessionalProfile.js"
import serviceCatalogSlice from "./Features/ServiceCatalog.js"
import reportTransactionsSlice from "./Features/reportSlice.js"
import notificationsSlice from "./Features/notificationSlice.js"
import wheelServicesSlice from "./Features/WheelSlice.js"
const store = configureStore({
  reducer: {
    auth: authSlice,
    businesses:businessSlice,
    users:usersSlice,
    roles:roleSlice,
    ads:adsSlice,
    categories:categorySlice,
    products:productSlice,
    profiles:profileSlice,
    serviceCatalog:serviceCatalogSlice,
    reports:reportTransactionsSlice,
    notifications:notificationsSlice,
    services:wheelServicesSlice
    
  },
});

export default store;
