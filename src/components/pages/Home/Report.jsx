import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReportTransactions,
  answerReportTransaction,
  clearReportStatus,
} from "../../Redux/Features/reportSlice";
import { toast } from "react-toastify";

const ReportTransactions = () => {
  const dispatch = useDispatch();
  const { list, loading, error, answerLoading, answerSuccess } = useSelector(
    (state) => state.reports
  );

  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");


  useEffect(() => {
    dispatch(fetchReportTransactions());
  }, [dispatch]);


  useEffect(() => {
    if (answerSuccess) {
      toast.success("Cavab uğurla göndərildi ✅");
      setSelectedId(null);
      setMessage("");
      dispatch(clearReportStatus());
      dispatch(fetchReportTransactions());
    }
    if (error) {
      toast.error(error);
      dispatch(clearReportStatus());
    }
  }, [answerSuccess, error, dispatch]);

  if (loading) return <p style={{ textAlign: "center" }}>Yüklənir...</p>;
  if (error) return <p style={{ color: "red" }}>Xəta: {error}</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "center" }}>📋 Report Transactions</h2>

      {list.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Heç bir report tapılmadı.
        </p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={theadRow}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Kateqoriya</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Report Növü</th>
              <th style={thStyle}>İstifadəçi ID</th>
              <th style={thStyle}>Cavab</th>
            </tr>
          </thead>
          <tbody>
            {list.map((report) => (
              <tr key={report.id} style={tbodyRow}>
                <td style={tdStyle}>{report.id}</td>
                <td style={tdStyle}>{report.reportCategoryId || "—"}</td>
                <td style={tdStyle}>{report.reportStatus}</td>
                <td style={tdStyle}>{report.reportType}</td>
                <td style={tdStyle}>{report.fromUserId}</td>
                <td style={tdStyle}>
                  {selectedId === report.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Cavab mesajını daxil et..."
                        style={{
                          padding: "8px",
                          width: "100%",
                          minWidth: "250px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          resize: "none",
                        }}
                      />
                      <div>
                        <button
                          onClick={() =>
                            dispatch(
                              answerReportTransaction({
                                reportTransactionId: report.id,
                                message,
                              })
                            )
                          }
                          disabled={answerLoading || !message.trim()}
                          style={primaryButton}
                        >
                          {answerLoading ? "Göndərilir..." : "Göndər"}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedId(null);
                            setMessage("");
                          }}
                          style={cancelButton}
                        >
                          Ləğv et
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      style={replyButton}
                      onClick={() => setSelectedId(report.id)}
                    >
                      Cavab ver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// 💅 Stil
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
  border: "1px solid #ddd",
};

const theadRow = {
  backgroundColor: "#f8f8f8",
  textAlign: "left",
};

const tbodyRow = {
  borderBottom: "1px solid #eee",
};

const thStyle = {
  padding: "10px",
  borderBottom: "2px solid #ddd",
  fontWeight: "600",
};

const tdStyle = {
  padding: "10px",
  textAlign: "left",
  verticalAlign: "top",
};

const replyButton = {
  backgroundColor: "#f0f0f0",
  padding: "6px 12px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "0.3s",
};

const primaryButton = {
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "8px",
};

const cancelButton = {
  backgroundColor: "#ccc",
  color: "black",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default ReportTransactions;
