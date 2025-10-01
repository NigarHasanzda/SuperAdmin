import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBusinesses,
  fetchBusinessById,
  fetchBranchesByAdmin,
  fetchAllBranches,
  fetchBranchById,
  fetchBranchStatsById,
  fetchBranchesStats,
} from "../../Redux/Features/Businesses";

const Businesses = () => {
  const dispatch = useDispatch();
  const {
    all: businesses,
    single: business,
    branches,
    branch,
    branchesStats,
    branchStats,
    loading,
    error,
  } = useSelector((state) => state.businesses);

  // Hamısını bir dəfə gətirmək
  useEffect(() => {
    dispatch(fetchAllBusinesses());
    dispatch(fetchAllBranches());
    dispatch(fetchBranchesStats());
  }, [dispatch]);

  // İlk biznesi seçib onun məlumatlarını və filiallarını gətir
  useEffect(() => {
    if (businesses?.length > 0) {
      const firstBusiness = businesses[0];
      dispatch(fetchBusinessById(firstBusiness.id));
      dispatch(fetchBranchesByAdmin(firstBusiness.userId));
    }
  }, [dispatch, businesses]);

  // İlk filialı seçib onun məlumatlarını və statistikalarını gətir
  useEffect(() => {
    if (branches?.length > 0) {
      const firstBranch = branches[0];
      dispatch(fetchBranchById(firstBranch.id));
      dispatch(fetchBranchStatsById(firstBranch.id));
    }
  }, [dispatch, branches]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;

  // Hamısını bir array-ə yığıb ekrana çıxarmaq
  const combinedData = [
    { title: "All Businesses", data: businesses },
    { title: "Business By ID", data: business ? [business] : [] },
    { title: "All Branches", data: branches?.map(br => br.content || br) || [] },
    { title: "Branches By Admin", data: branches },
    { title: "Branch By ID", data: branch ? [branch] : [] },
    { title: "Branches Stats", data: branchesStats },
    { title: "Branch Stats By ID", data: branchStats ? [branchStats] : [] },
  ];

  return (
    <div className="businesses-container" style={{ padding: "20px", fontFamily: "Arial" }}>
      {combinedData.map((section, idx) => (
        <div key={idx} style={{ marginBottom: "20px" }}>
          <h2>{section.title}</h2>
          {section.data && section.data.length > 0 ? (
            section.data.map((item, i) => (
              <div key={i} style={{ border: "1px solid #ccc", margin: "5px 0", padding: "10px", borderRadius: "5px" }}>
                <pre>{JSON.stringify(item, null, 2)}</pre>
              </div>
            ))
          ) : (
            <p>No data</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Businesses;
