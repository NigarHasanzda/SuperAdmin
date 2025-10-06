import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReportTransactions } from "../../Redux/Features/reportSlice";

const ReportTransactions = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.reports);

  useEffect(() => {
    dispatch(fetchReportTransactions());
  }, [dispatch]);

  if (loading) return <p style={{ textAlign: "center" }}>Yüklənir...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>Xəta: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Hesabat Əməliyyatları</h2>

      {list.length === 0 ? (
        <p>Hesabat tapılmadı.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            border: "1px solid #ddd",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Məbləğ</th>
              <th style={thStyle}>Tarix</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>İstifadəçi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{item.id}</td>
                <td style={tdStyle}>{item.amount || "—"}</td>
                <td style={tdStyle}>{item.date || "—"}</td>
                <td style={tdStyle}>{item.status || "—"}</td>
                <td style={tdStyle}>{item.user?.name || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Stil
const thStyle = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "2px solid #ddd",
};

const tdStyle = {
  padding: "10px",
  textAlign: "left",
};

export default ReportTransactions;
