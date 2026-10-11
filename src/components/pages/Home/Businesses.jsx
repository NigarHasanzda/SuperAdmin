import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiSearch,
  FiBriefcase,
  FiX,
  FiMail,
  FiPhone,
  FiHash,
  FiEye,
  FiCheck,
  FiSlash,
  FiLock,
  FiUnlock,
  FiFileText,
} from "react-icons/fi";
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
} from "../../Redux/Features/Businesses";
import "./Businesses.css";

const TABS = [
  { id: "all", label: "All" },
  { id: "approved", label: "Approved" },
  { id: "pending", label: "Pending" },
];

function displayName(b) {
  return b.shopName || b.companyName || "—";
}

function pillClass(status) {
  if (!status) return "biz-pill biz-pill--muted";
  const s = String(status).toUpperCase();
  if (["ACTIVE", "ACCEPTED", "APPROVED"].includes(s))
    return "biz-pill biz-pill--ACTIVE";
  if (s === "PENDING") return "biz-pill biz-pill--PENDING";
  if (["INACTIVE", "REJECTED", "BLOCKED"].includes(s))
    return "biz-pill biz-pill--INACTIVE";
  return "biz-pill biz-pill--muted";
}

function matchesSearch(b, term) {
  if (!term.trim()) return true;
  const q = term.toLowerCase();
  const fields = [
    displayName(b),
    b.email,
    b.phone,
    b.tin,
    b.businessCode,
    b.tagline,
    String(b.id),
  ];
  return fields.some((f) => f && String(f).toLowerCase().includes(q));
}

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

  const [rejectReason, setRejectReason] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [tinRejectReason, setTinRejectReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllBusinesses());
    dispatch(fetchApprovedBusinesses());
    dispatch(fetchPendingBusinesses());
  }, [dispatch]);

  const tabList = useMemo(() => {
    switch (activeTab) {
      case "approved":
        return approved ?? [];
      case "pending":
        return pending ?? [];
      default:
        return businesses ?? [];
    }
  }, [activeTab, businesses, approved, pending]);

  const filteredList = useMemo(
    () => tabList.filter((b) => matchesSearch(b, searchTerm)),
    [tabList, searchTerm]
  );

  const openDetail = (id) => {
    dispatch(fetchBusinessById(id));
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setRejectReason("");
    setBlockReason("");
    setTinRejectReason("");
  };

  useEffect(() => {
    if (!showDetailModal) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [showDetailModal]);

  const handleReject = (id) => {
    if (!rejectReason.trim()) return alert("Enter a rejection reason");
    dispatch(rejectBusiness({ companyId: id, reason: rejectReason }));
    setRejectReason("");
  };

  const handleBlock = (id) => {
    if (!blockReason.trim()) return alert("Enter a block reason");
    dispatch(blockBusiness({ companyId: id, reason: blockReason }));
    setBlockReason("");
  };

  const handleRejectTIN = (id) => {
    if (!tinRejectReason.trim()) return alert("Enter a TIN rejection reason");
    dispatch(rejectTIN({ id, reason: tinRejectReason }));
    setTinRejectReason("");
  };

  const isBusy = loading || searchLoading;

  return (
    <div className="biz-page">
      <header className="biz-page__header">
        <div>
          <h2>Business management</h2>
          <p>
            Review registered companies and apply status and TIN decisions.
          </p>
        </div>
        <div className="biz-page__stats">
          <div className="biz-stat">
            <div className="biz-stat__value">{businesses?.length ?? 0}</div>
            <div className="biz-stat__label">All</div>
          </div>
          <div className="biz-stat biz-stat--active">
            <div className="biz-stat__value">{approved?.length ?? 0}</div>
            <div className="biz-stat__label">Active</div>
          </div>
          <div className="biz-stat biz-stat--pending">
            <div className="biz-stat__value">{pending?.length ?? 0}</div>
            <div className="biz-stat__label">Pending</div>
          </div>
        </div>
      </header>

      <div className="biz-tabs" role="tablist">
        {TABS.map((tab) => {
          const count =
            tab.id === "all"
              ? businesses?.length
              : tab.id === "approved"
                ? approved?.length
                : pending?.length;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`biz-tabs__btn${activeTab === tab.id ? " is-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} ({count ?? 0})
            </button>
          );
        })}
      </div>

      <div className="biz-toolbar">
        <div className="biz-search">
          <FiSearch size={18} aria-hidden />
          <input
            type="search"
            placeholder="Search by name, email, TIN, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Business search"
          />
        </div>
      </div>

      {error && (
        <div className="biz-page__error" role="alert">
          Error: {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      )}

      {isBusy && (
        <div className="biz-page__state">
          <div className="biz-page__spinner" />
          <p>Loading businesses...</p>
        </div>
      )}

      {!isBusy && !error && filteredList.length === 0 && (
        <div className="biz-page__state">
          <FiBriefcase size={40} strokeWidth={1.5} opacity={0.35} />
          <h3>No businesses found</h3>
          <p>
            {searchTerm
              ? "Try different search terms."
              : "No businesses in this filter."}
          </p>
        </div>
      )}

      {!isBusy && !error && filteredList.length > 0 && (
        <div className="biz-grid">
          {filteredList.map((b) => (
            <article
              key={b.id}
              className="biz-card"
              onClick={() => openDetail(b.id)}
              onKeyDown={(e) => e.key === "Enter" && openDetail(b.id)}
              role="button"
              tabIndex={0}
            >
              <div className="biz-card__bar" aria-hidden />
              <div className="biz-card__body">
                <div className="biz-card__head">
                  <div>
                    <h3 className="biz-card__name">{displayName(b)}</h3>
                    {b.tagline && (
                      <p className="biz-card__tagline">{b.tagline}</p>
                    )}
                  </div>
                  <span className="biz-card__id">#{b.id}</span>
                </div>
                <div className="biz-card__badges">
                  <span className={pillClass(b.status)}>{b.status}</span>
                  {b.tinStatus && (
                    <span className={pillClass(b.tinStatus)}>
                      TIN · {b.tinStatus}
                    </span>
                  )}
                </div>
                <div className="biz-card__meta">
                  {b.email && (
                    <span>
                      <FiMail size={14} /> {b.email}
                    </span>
                  )}
                  {b.phone && (
                    <span>
                      <FiPhone size={14} /> {b.phone}
                    </span>
                  )}
                  {b.businessCode && (
                    <span>
                      <FiHash size={14} /> {b.businessCode}
                    </span>
                  )}
                </div>
              </div>
              <div className="biz-card__footer">
                <button
                  type="button"
                  className="biz-card__link-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetail(b.id);
                  }}
                >
                  <FiEye size={14} />
                  View details
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showDetailModal &&
        business &&
        createPortal(
          <div
            className="biz-modal-overlay"
            onClick={closeModal}
            role="presentation"
          >
            <div
              className="biz-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="biz-modal-title"
            >
              <div className="biz-modal__head">
                <div className="biz-modal__title-row">
                  <h2 id="biz-modal-title">{displayName(business)}</h2>
                  <button
                    type="button"
                    className="biz-modal__close"
                    onClick={closeModal}
                    aria-label="Close"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                <div className="biz-modal__badges">
                  <span className={pillClass(business.status)}>
                    {business.status}
                  </span>
                  {business.tinStatus && (
                    <span className={pillClass(business.tinStatus)}>
                      TIN · {business.tinStatus}
                    </span>
                  )}
                </div>
              </div>

              <div className="biz-modal__scroll">
                <div className="biz-modal__body">
              <h3 className="biz-section-title">Overview</h3>
              <div className="biz-info-grid">
                <div className="biz-info-item">
                  <strong>Tagline</strong>
                  {business.tagline || "—"}
                </div>
                <div className="biz-info-item">
                  <strong>TIN</strong>
                  {business.tin || "—"}
                </div>
                <div className="biz-info-item">
                  <strong>Business code</strong>
                  {business.businessCode || "—"}
                </div>
                <div className="biz-info-item">
                  <strong>Email</strong>
                  {business.email || "—"}
                </div>
                <div className="biz-info-item">
                  <strong>Phone</strong>
                  {business.phone || "—"}
                </div>
                <div className="biz-info-item">
                  <strong>Description</strong>
                  {business.description || "—"}
                </div>
              </div>

              <h3 className="biz-section-title">Decision reasons</h3>
              <div className="biz-reasons">
                <input
                  type="text"
                  placeholder="Rejection reason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Block reason"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="TIN rejection reason"
                  value={tinRejectReason}
                  onChange={(e) => setTinRejectReason(e.target.value)}
                />
              </div>

              <h3 className="biz-section-title">Actions</h3>
              <div className="biz-actions">
                {business.status === "PENDING" && (
                  <>
                    <button
                      type="button"
                      className="biz-action biz-action--success"
                      onClick={() => dispatch(approveBusiness(business.id))}
                    >
                      <FiCheck size={14} />
                      Approve
                    </button>
                    <button
                      type="button"
                      className="biz-action biz-action--danger"
                      onClick={() => handleReject(business.id)}
                    >
                      <FiSlash size={14} />
                      Reject
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="biz-action biz-action--warning"
                  onClick={() => handleBlock(business.id)}
                >
                  <FiLock size={14} />
                  Block
                </button>
                <button
                  type="button"
                  className="biz-action biz-action--ghost"
                  onClick={() => dispatch(unblockBusiness(business.id))}
                >
                  <FiUnlock size={14} />
                  Unblock
                </button>
                <button
                  type="button"
                  className="biz-action biz-action--primary"
                  onClick={() => dispatch(acceptTIN(business.id))}
                  disabled={tinAccepting}
                >
                  <FiFileText size={14} />
                  Accept TIN
                </button>
                <button
                  type="button"
                  className="biz-action biz-action--danger"
                  onClick={() => handleRejectTIN(business.id)}
                  disabled={tinRejecting}
                >
                  <FiSlash size={14} />
                  Reject TIN
                </button>
              </div>

              {business.branches?.length > 0 && (
                <div className="biz-branches">
                  <h3 className="biz-section-title">
                    Branches ({business.branches.length})
                  </h3>
                  {business.branches.map((branch) => (
                    <div key={branch.id} className="biz-branch-card">
                      <h4>{branch.name}</h4>
                      <p>{branch.location?.address || branch.phone || "—"}</p>
                    </div>
                  ))}
                </div>
              )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Businesses;
