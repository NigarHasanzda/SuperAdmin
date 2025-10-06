// ServicesPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWheelServices,
  fetchOwnBusinessPages,
  fetchAutoWashServices,
  fetchAllBusinessPages,
} from "../../Redux/Features/WheelSlice"; // slice yolu öz layihəndə ola bilər

const ServicesPage = () => {
  const dispatch = useDispatch();
  const { wheel, own, autoWash, all, loading, error } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchWheelServices());
    dispatch(fetchOwnBusinessPages());
    dispatch(fetchAutoWashServices());
    dispatch(fetchAllBusinessPages());
  }, [dispatch]);

  useEffect(() => {
    console.log("Wheel Services:", wheel);
    console.log("Own Business Pages:", own);
    console.log("Auto Wash Services:", autoWash);
    console.log("All Business Pages:", all);
  }, [wheel, own, autoWash, all]);

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p>Xəta: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Wheel Services</h2>
      <pre>{JSON.stringify(wheel, null, 2)}</pre>

      <h2>Own Business Pages</h2>
      <pre>{JSON.stringify(own, null, 2)}</pre>

      <h2>Auto Wash Services</h2>
      <pre>{JSON.stringify(autoWash, null, 2)}</pre>

      <h2>All Business Pages</h2>
      <pre>{JSON.stringify(all, null, 2)}</pre>
    </div>
  );
};

export default ServicesPage;
