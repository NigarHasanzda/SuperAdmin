import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfessionalPages,
  fetchWheelServices,
  fetchAutoWashServices,
} from "../../Redux/Features/WheelSlice";
import Pagination from "../../Pagination/Pagination";

const WheelService = () => {
  const dispatch = useDispatch();
  const { professionalPages, wheelServices, autoWashServices, loading, error } =
    useSelector((state) => state.wheelServices);

    console.log(professionalPages);
    
  const [proPage, setProPage] = useState(1);
  const [wheelPage, setWheelPage] = useState(1);
  const [autoPage, setAutoPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProfessionalPages({ page: proPage - 1, size: 5 }));
  }, [dispatch, proPage]);

  useEffect(() => {
    dispatch(fetchWheelServices({ page: wheelPage - 1, size: 5 }));
  }, [dispatch, wheelPage]);

  useEffect(() => {
    dispatch(fetchAutoWashServices({ page: autoPage - 1, size: 5 }));
  }, [dispatch, autoPage]);

  // 🔹 Card render funksiyası
  const renderCard = (item, color) => (
    <div
      key={item.id}
      className="border border-gray-200 bg-white shadow-sm rounded-xl p-4 hover:shadow-lg transition flex flex-col items-center text-center"
    >
      <img
        src={
          item.profilePictureUrl ||
          item.servicePictureUrl ||
          "https://dummyimage.com/250x250/cccccc/000000.jpg&text=No+Image"
        }
        alt={item.name || item.serviceName}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
      <h3 className={`font-semibold text-${color}-600 text-lg`}>
        {item.name} {item.surname || item.serviceName}
      </h3>
      {item.serviceName && <p className="text-sm text-gray-600">{item.serviceName}</p>}
      {item.address && <p className="text-sm text-gray-500">📍 {item.address}</p>}
      {item.phone && <p className="text-sm text-gray-500">📞 {item.phone}</p>}
      {item.averageRating && (
        <p className="text-yellow-500 mt-1">⭐ {item.averageRating}</p>
      )}
      {item.price && (
        <p className="text-lg font-bold mt-2 text-gray-700">{item.price} ₼</p>
      )}
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Service Catalog</h1>

      {loading && <p>Yüklənir...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="space-y-12">

          {/* 🔹 PROFESSIONAL PAGES */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Professional Pages</h2>
            {professionalPages?.content?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {professionalPages.content.map((item) => renderCard(item, "blue"))}
              </div>
            ) : (
              <p className="text-gray-500">Professional Pages tapılmadı.</p>
            )}
            <Pagination
              currentPage={proPage}
              lastPage={professionalPages?.page?.totalPages || 1}
              onPageChange={setProPage}
            />
          </section>

          {/* 🔹 WHEEL SERVICES */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Wheel Services</h2>
            {wheelServices?.content?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wheelServices.content.map((item) => renderCard(item, "green"))}
              </div>
            ) : (
              <p className="text-gray-500">Wheel Services tapılmadı.</p>
            )}
            <Pagination
              currentPage={wheelPage}
              lastPage={wheelServices?.page?.totalPages || 1}
              onPageChange={setWheelPage}
            />
          </section>

          {/* 🔹 AUTO WASH SERVICES */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Auto Wash Services</h2>
            {autoWashServices?.content?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {autoWashServices.content.map((item) => renderCard(item, "indigo"))}
              </div>
            ) : (
              <p className="text-gray-500">Auto Wash Services tapılmadı.</p>
            )}
            <Pagination
              currentPage={autoPage}
              lastPage={autoWashServices?.page?.totalPages || 1}
              onPageChange={setAutoPage}
            />
          </section>
        </div>
      )}
    </div>
  );
};

export default WheelService;
