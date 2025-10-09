import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfessionalPages,
  fetchWheelServices,
  fetchAutoWashServices,
} from "../../Redux/Features/WheelSlice";
import Pagination from "../../Pagination/Pagination";

const ServicesPage = () => {
  const dispatch = useDispatch();
  const { professionalPages, wheelServices, autoWashServices, loading, error } =
    useSelector((state) => state.serviceCatalog);

  // Pagination state
  const [profPage, setProfPage] = useState(0);
  const [wheelPage, setWheelPage] = useState(0);
  const [autoPage, setAutoPage] = useState(0);
  const pageSize = 10;

  // Fetch data
  useEffect(() => {
    dispatch(fetchProfessionalPages({ page: profPage, size: pageSize }));
  }, [dispatch, profPage]);

  useEffect(() => {
    dispatch(fetchWheelServices({ page: wheelPage, size: pageSize }));
  }, [dispatch, wheelPage]);

  useEffect(() => {
    dispatch(fetchAutoWashServices({ page: autoPage, size: pageSize }));
  }, [dispatch, autoPage]);

  if (loading)
    return <p className="text-center text-blue-500 py-10">Yüklənir...</p>;

  if (error)
    return (
      <p className="text-center text-red-500 py-10">Xəta baş verdi: {error}</p>
    );

  return (
    <div className="p-6 space-y-10">

      {/* PROFESSIONAL PAGES */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">
          🔹 Professional Pages
        </h2>
        {professionalPages.content?.length === 0 ? (
          <p className="text-gray-500">Heç bir professional page tapılmadı.</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professionalPages.content.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-2xl shadow hover:shadow-lg bg-white transition"
                >
                  <h3 className="text-lg font-semibold">{item.serviceName}</h3>
                  <p className="text-gray-600 mt-2">{item.name} {item.surname}</p>
                  <p className="text-gray-500 mt-1 text-xs">ID: {item.id}</p>
                  <p className="text-gray-600 mt-1 text-sm">Qiymət: {item.price}₼</p>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={professionalPages.number + 1}
              lastPage={professionalPages.totalPages}
              onPageChange={(p) => setProfPage(p - 1)}
            />
          </>
        )}
      </section>

      {/* WHEEL SERVICES */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-orange-600">
          🛞 Təkər Servisləri
        </h2>
        {wheelServices.content?.length === 0 ? (
          <p className="text-gray-500">Təkər servisləri tapılmadı.</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wheelServices.content.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-2xl shadow hover:shadow-lg bg-white transition"
                >
                  <h3 className="text-lg font-semibold">{item.serviceName}</h3>
                  <p className="text-gray-600 mt-2">{item.name} {item.surname}</p>
                  <p className="text-gray-500 mt-1 text-xs">ID: {item.id}</p>
                  <p className="text-gray-600 mt-1 text-sm">Qiymət: {item.price}₼</p>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={wheelServices.number + 1}
              lastPage={wheelServices.totalPages}
              onPageChange={(p) => setWheelPage(p - 1)}
            />
          </>
        )}
      </section>

      {/* AUTO WASH */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-purple-600">
          🚗 Avto Yuma Servisləri
        </h2>
        {autoWashServices.content?.length === 0 ? (
          <p className="text-gray-500">Avto yuma servisləri tapılmadı.</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {autoWashServices.content.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-2xl shadow hover:shadow-lg bg-white transition"
                >
                  <h3 className="text-lg font-semibold">{item.serviceName}</h3>
                  <p className="text-gray-600 mt-2">{item.name} {item.surname}</p>
                  <p className="text-gray-500 mt-1 text-xs">ID: {item.id}</p>
                  <p className="text-gray-600 mt-1 text-sm">Qiymət: {item.price}₼</p>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={autoWashServices.number + 1}
              lastPage={autoWashServices.totalPages}
              onPageChange={(p) => setAutoPage(p - 1)}
            />
          </>
        )}
      </section>

    </div>
  );
};

export default ServicesPage;
