import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles, fetchProfileById } from "../../Redux/Features/ProfessionalProfile";
import Pagination from "../../Pagination/Pagination"; // əvvəl yazdığımız Pagination komponenti

const Profiles = () => {
  const dispatch = useDispatch();
  const { list, single, loading, error } = useSelector((state) => state.profiles);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  console.log(list);
  

  useEffect(() => {
    const fetchData = async () => {
      const action = await dispatch(fetchProfiles(currentPage - 1)); // page 0-based gedir
      if (action.payload?.page?.totalPages) {
        setTotalPages(action.payload.page.totalPages);
      }
    };
    fetchData();
  }, [dispatch, currentPage]);

  const handleProfileClick = (id) => {
    dispatch(fetchProfileById(id));
  };

  if (loading) return <p style={{ textAlign: "center" }}>Yüklənir...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>Xəta: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bütün Profillər</h2>

      {/* Profil siyahısı */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {list?.content?.map((profile) => (
          <li
            key={profile.id}
            onClick={() => handleProfileClick(profile.id)}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              margin: "10px 0",
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            <strong>
              {profile.name} {profile.surname}
            </strong>
            <br />
            <span>@{profile.username}</span>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          lastPage={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* Seçilmiş profil məlumatı */}
      {single && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "2px solid #5D56F1",
            borderRadius: "8px",
            background: "#f9f9ff",
          }}
        >
          <h3>Seçilmiş Profil</h3>
          <p><strong>ID:</strong> {single.id}</p>
          <p><strong>Ad:</strong> {single.name}</p>
          <p><strong>Soyad:</strong> {single.surname}</p>
          <p><strong>İstifadəçi adı:</strong> {single.username}</p>
          <p><strong>Əlaqə:</strong> {single.email || "Məlumat yoxdur"}</p>
        </div>
      )}
    </div>
  );
};

export default Profiles;
