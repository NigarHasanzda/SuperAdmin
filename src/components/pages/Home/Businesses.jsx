// Businesses.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBusinesses,
  fetchBusinessById,
  fetchBranchesByAdmin,
  fetchBranchById,
} from "../../Redux/Features/Businesses";

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
  const { all: businesses, single: business, loading, error } = useSelector(
    (state) => state.businesses
  );

  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    dispatch(fetchAllBusinesses());
  }, [dispatch]);

  const handleSelectBusiness = (id) => {
    dispatch(fetchBusinessById(id));
    setSelectedBusiness(id);
  };

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p>Xəta: {JSON.stringify(error)}</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "20px" }}>Biznes Siyahısı</h1>

      {/* Bütün bizneslər */}
      <Section title="Bütün Bizneslər">
        {businesses.map((b) => (
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
          </div>
        ))}
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
                                    ⭐ <strong>{review.rating}</strong> —{" "}
                                    {review.name} {review.surname}
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
