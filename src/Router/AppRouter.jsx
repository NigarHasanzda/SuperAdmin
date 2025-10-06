import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/login/Login";
import Home from "../components/pages/Home/Home";
import Ads from "../components/pages/Home/Ads";
import Category from "../components/pages/Home/Category";
import Role from "../components/pages/Home/Role";
import Persons from "../components/pages/Home/Persons";
import Businesses from "../components/pages/Home/Businesses";
import { Product } from "../components/pages/Home/Product";
import { Notification } from "../components/pages/Home/Notification";
import Profiles from "../components/pages/Home/Profiles";
import ReportTransactions from "../components/pages/Home/Report";
import WheelServices from "../components/pages/Home/WheelService";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/loginedpage" element={<Home/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/ads" element={<Ads/>} />
      <Route path="/category" element={<Category/>} />
      <Route path="/roles" element={<Role/>} />
        <Route path="/persons" element={<Persons/>} />
        <Route path="/businesses" element={<Businesses/>} />
        <Route path="/products" element={<Product/>}/>
        <Route path="?notification" element={<Notification/>}/>
        <Route path="/profiles" element={<Profiles/>}/>
        <Route path="/report" element={<ReportTransactions/>}/>
        <Route path="/wheel" element={<WheelServices/>}/>
    </Routes>
  );
};

export default AppRouter;
