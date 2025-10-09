import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBusinesses,
  fetchBusinessById,
  fetchApprovedBusinesses,
  fetchPendingBusinesses,
  blockBusiness,
  unblockBusiness,
  approveBusiness,
  rejectBusiness,
  acceptTIN,
  rejectTIN,
  searchApprovedBusinesses,
  searchPendingBusinesses,
} from "../../Redux/Features/Businesses";

// Section komponenti
const Section = ({ title, children, style }) => (
  <div
    style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "10px",
      marginBottom: "10px",
      background: "#f9f9f9",
      ...style,
    }}
  >
    <h3 style={{ margin: "0 0 10px", color: "#333" }}>{title}</h3>
    {children}
  </div>
);

const Businesses = () => {
  const dispatch = useDispatch();
  const {
    all: businesses,
    approved,
    pending,
    single: business,
    loading,
    error,
    searchLoading,
    tinAccepting,
    tinRejecting,
  } = useSelector((state) => state.businesses);

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [tinRejectReason, setTinRejectReason] = useState("");
  const [approvedSearchTerm, setApprovedSearchTerm] = useState("");
  const [pendingSearchTerm, setPendingSearchTerm] = useState("");

  // İlk yükleme
  useEffect(() => {
    dispatch(fetchAllBusinesses());
    dispatch(fetchApprovedBusinesses());
    dispatch(fetchPendingBusinesses());
  }, [dispatch]);

  // Search funksiyaları
  const handleSearchApproved = () => {
    if (!approvedSearchTerm.trim()) return;
    dispatch(searchApprovedBusinesses(approvedSearchTerm));
  };
  const handleSearchPending = () => {
    if (!pendingSearchTerm.trim()) return;
    dispatch(searchPendingBusinesses(pendingSearchTerm));
  };

  const handleSelectBusiness = (id) => {
    dispatch(fetchBusinessById(id));
    setSelectedBusiness(id);
  };

  // Status və TIN əməliyyatları
  const handleApprove = (id) => dispatch(approveBusiness(id));
  const handleReject = (id) => {
    if (!rejectReason.trim()) return alert("Rədd səbəbini daxil et!");
    dispatch(rejectBusiness({ companyId: id, reason: rejectReason }));
    setRejectReason("");
  };
  const handleBlock = (id) => {
    if (!blockReason.trim()) return alert("Blok səbəbini daxil et!");
    dispatch(blockBusiness({ companyId: id, reason: blockReason }));
    setBlockReason("");
  };
  const handleUnblock = (id) => dispatch(unblockBusiness(id));

  const handleAcceptTIN = (id) => dispatch(acceptTIN(id));
  const handleRejectTIN = (id) => {
    if (!tinRejectReason.trim()) return alert("TIN rədd səbəbini daxil et!");
    dispatch(rejectTIN({ id, reason: tinRejectReason }));
    setTinRejectReason("");
  };

  // Hər ikisini birlikdə etmək üçün
  const handleApproveAndAcceptTIN = async (id) => {
    await dispatch(approveBusiness(id));
    await dispatch(acceptTIN(id));
  };

  if (loading || searchLoading) return <p>Yüklənir...</p>;
  if (error) return <p>Xəta: {JSON.stringify(error)}</p>;

  const renderBusinessList = (list) =>
    Array.isArray(list) && list.length > 0 ? (
      list.map((b) => (
        <div
          key={b.id}
          onClick={() => handleSelectBusiness(b.id)}
          style={{
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "10px",
            marginBottom: "10px",
            cursor: "pointer",
            background: selectedBusiness === b.id ? "#e0f7fa" : "#fff",
          }}
        >
          <strong>{b.shopName}</strong> <br />
          <small>{b.tagline}</small>
          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color:
                  b.status === "ACTIVE"
                    ? "green"
                    : b.status === "INACTIVE"
                    ? "red"
                    : b.status === "APPROVED"
                    ? "blue"
                    : "#555",
              }}
            >
              {b.status}
            </span>
          </p>
          {b.tinStatus && (
            <p>
              <strong>TIN:</strong>{" "}
              <span
                style={{
                  color:
                    b.tinStatus === "ACCEPTED"
                      ? "green"
                      : b.tinStatus === "REJECTED"
                      ? "red"
                      : "#555",
                }}
              >
                {b.tinStatus}
              </span>
            </p>
          )}
        </div>
      ))
    ) : (
      <p>Biznes tapılmadı</p>
    );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "20px" }}>Biznes Siyahısı</h1>

      {/* Bütün bizneslər */}
      <Section title="Bütün Bizneslər">{renderBusinessList(businesses)}</Section>

      {/* Approved bizneslər + Search */}
      <Section title="Təsdiqlənmiş Bizneslər">
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Search approved..."
            value={approvedSearchTerm}
            onChange={(e) => setApprovedSearchTerm(e.target.value)}
            style={{ marginRight: "5px", padding: "5px" }}
          />
          <button
            onClick={handleSearchApproved}
            style={{
              padding: "6px 10px",
              background: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Axtar 🔍
          </button>
        </div>
        {approvedSearchTerm ? renderBusinessList(approved) : renderBusinessList(approved)}
      </Section>

      {/* Pending bizneslər + Search */}
      <Section title="Gözləmədə olan Bizneslər">
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Search pending..."
            value={pendingSearchTerm}
            onChange={(e) => setPendingSearchTerm(e.target.value)}
            style={{ marginRight: "5px", padding: "5px" }}
          />
          <button
            onClick={handleSearchPending}
            style={{
              padding: "6px 10px",
              background: "#ff9800",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Axtar 🔍
          </button>
        </div>
        {pendingSearchTerm ? renderBusinessList(pending) : renderBusinessList(pending)}
      </Section>

      {/* Seçilmiş biznesin detalları */}
      {business && (
        <Section title={`Biznes: ${business.shopName}`}>
          <p>
            <strong>Tagline:</strong> {business.tagline}
          </p>
          <p>
            <strong>Vergi kodu (TIN):</strong> {business.tin}
          </p>
          <p>
            <strong>Təsvir:</strong> {business.description}
          </p>
          <p>
            <strong>Kod:</strong> {business.businessCode}
          </p>

          {/* Əməliyyat düymələri */}
          <div style={{ marginTop: "15px" }}>
            <input
              type="text"
              placeholder="Rədd səbəbi..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
              type="text"
              placeholder="Blok səbəbi..."
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
              type="text"
              placeholder="TIN rədd səbəbi..."
              value={tinRejectReason}
              onChange={(e) => setTinRejectReason(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />

            <button
              onClick={() => handleApprove(business.id)}
              style={{
                padding: "6px 10px",
                marginRight: "5px",
                background: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              ✅ Status ACTIVE et
            </button>
            <button
              onClick={() => handleReject(business.id)}
              style={{
                padding: "6px 10px",
                marginRight: "5px",
                background: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              ❌ Rədd et
            </button>
            <button
              onClick={() => handleBlock(business.id)}
              style={{
                padding: "6px 10px",
                marginRight: "5px",
                background: "#ff9800",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              🔒 Blokla
            </button>
            <button
              onClick={() => handleUnblock(business.id)}
              style={{
                padding: "6px 10px",
                marginRight: "5px",
                background: "#2196f3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              🔓 Blokdan çıxar
            </button>

            {/* TIN düymələri */}
            <button
              onClick={() => handleAcceptTIN(business.id)}
              style={{
                padding: "6px 10px",
                marginRight: "5px",
                background: "#009688",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              disabled={tinAccepting}
            >
              ✔️ TIN qəbul et
            </button>
            <button
              onClick={() => handleRejectTIN(business.id)}
              style={{
                padding: "6px 10px",
                background: "#607d8b",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              disabled={tinRejecting}
            >
              ❌ TIN rədd et
            </button>

            {/* Hər ikisini birlikdə */}
            <button
              onClick={() => handleApproveAndAcceptTIN(business.id)}
              style={{
                padding: "6px 10px",
                marginLeft: "10px",
                background: "#3f51b5",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              ✅ ACTIVE & ✔️ TIN
            </button>
          </div>

          {/* Filiallar */}
          <Section title="Filiallar">
            {business.branches && business.branches.length > 0 ? (
              business.branches.map((branch) => (
                <Section
                  key={branch.id}
                  title={`📍 ${branch.name} (${branch.location?.address})`}
                  style={{ background: "#fff" }}
                >
                  <p>{branch.description}</p>
                  <p>
                    <strong>Telefon:</strong> {branch.phone}
                  </p>
                  <p>
                    <strong>Reytinq:</strong> ⭐ {branch.averageRating}
                  </p>

                  {/* Xidmətlər */}
                  <Section title="Xidmətlər">
                    {branch.businessPages &&
                    branch.businessPages[0]?.servicePrices?.length > 0 ? (
                      branch.businessPages[0].servicePrices.map((service) => (
                        <Section
                          key={service.id}
                          title={`🧰 ${service.serviceName}`}
                          style={{ background: "#fdfdfd" }}
                        >
                          <p>
                            <strong>Qiymət:</strong> {service.price} ₼
                          </p>
                          <p>
                            <strong>Reytinq:</strong> ⭐ {service.averageRating}
                          </p>
                          <p>
                            <strong>Say:</strong> {service.count}
                          </p>

                          {/* Rəylər */}
                          {service.reviews && service.reviews.length > 0 && (
                            <Section title="Rəylər">
                              {service.reviews.map((review) => (
                                <div
                                  key={review.id}
                                  style={{
                                    borderBottom: "1px solid #eee",
                                    marginBottom: "5px",
                                    paddingBottom: "5px",
                                  }}
                                >
                                  <p>
                                    💬 <em>"{review.comment}"</em>
                                  </p>
                                  <p>
                                    ⭐ <strong>{review.rating}</strong> — {review.name}{" "}
                                    {review.surname}
                                  </p>
                                </div>
                              ))}
                            </Section>
                          )}
                        </Section>
                      ))
                    ) : (
                      <p>Xidmət yoxdur</p>
                    )}
                  </Section>
                </Section>
              ))
            ) : (
              <p>Filial yoxdur</p>
            )}
          </Section>
        </Section>
      )}
    </div>
  );
};

export default Businesses;
