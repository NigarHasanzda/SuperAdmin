import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBroadcasts, sendBroadcast } from "../../Redux/Features/notificationSlice";

export const Notification = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector(state => state.notifications);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    dispatch(fetchBroadcasts());
  }, [dispatch]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!title || !desc) return alert("Title və Description doldurulmalıdır!");
    dispatch(sendBroadcast({ title, description: desc }));
    setTitle("");
    setDesc("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Broadcast Notifications</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

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

      <ul style={{ listStyle: "none", padding: 0 }}>
        {list.map((item) => (
          <li key={item.id} style={{ border: "1px solid #ccc", marginBottom: "8px", padding: "8px", borderRadius: "4px" }}>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
            <small>ID: {item.id}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};
