import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBroadcasts, sendBroadcast } from "../../Redux/Features/notificationSlice";

export const Notification = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.notifications);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  // 🔍 Debug üçün
  useEffect(() => {
    console.log("📩 Notification List:", list);
  }, [list]);

  // Fetch all notifications on mount
  useEffect(() => {
    dispatch(fetchBroadcasts());
  }, [dispatch]);

  // Form submit
  const handleSend = (e) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) {
      return alert("Title və Description doldurulmalıdır!");
    }
    dispatch(sendBroadcast({ title, description: desc }));
    setTitle("");
    setDesc("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Broadcast Notifications</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Xəta: {error}</p>}

      {/* Form */}
      <form onSubmit={handleSend} style={{ marginBottom: "20px" }}>
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: "6px", width: "300px", marginRight: "10px" }}
          />
          <input
            type="text"
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{ padding: "6px", width: "300px", marginRight: "10px" }}
          />
          <button type="submit" style={{ padding: "6px 12px" }}>Send</button>
        </div>
      </form>

      {/* Notification List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {Array.isArray(list) && list.length > 0 ? (
          list
            .filter((item) => item && item !== "" && item.title) // boş stringləri və null dəyərləri atırıq
            .map((item, index) => (
              <li
                key={item.id || index} // unikal key
                style={{
                  border: "1px solid #ccc",
                  marginBottom: "8px",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              >
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                {item.id && <small>ID: {item.id}</small>}
              </li>
            ))
        ) : (
          <p>No notifications available</p>
        )}
      </ul>
    </div>
  );
};
