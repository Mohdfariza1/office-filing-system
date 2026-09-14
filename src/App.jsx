import React, { useState, useMemo } from "react";

// --- Categories Configuration ---
const CATEGORIES = [
  "Invoices",
  "Contracts",
  "HR",
  "Legal",
  "Operations",
  "Tax",
  "Reports"
];

// --- Initial Mock Documents ---
const INITIAL_DOCS = [
  {
    id: "doc-1",
    originalName: "vendor_aws_bill_sept.pdf",
    standardName: "2026-09-02_Invoices_AWS-Cloud-Hosting.pdf",
    category: "Invoices",
    subject: "AWS-Cloud-Hosting",
    date: "2026-09-02",
    folder: "2026-09",
    size: "1.4 MB",
    uploadedBy: "Accounting Dept",
    driveFileId: "1fA9k_8wQzXm901Pq_L2",
    driveSynced: true,
    starred: true,
    tags: ["Cloud", "Monthly", "Vendor"]
  },
  {
    id: "doc-2",
    originalName: "Signed_NDA_ApexVentures.pdf",
    standardName: "2026-09-05_Legal_ApexVentures-Mutual-NDA.pdf",
    category: "Legal",
    subject: "ApexVentures-Mutual-NDA",
    date: "2026-09-05",
    folder: "2026-09",
    size: "820 KB",
    uploadedBy: "Legal Counsel",
    driveFileId: "1xZ89_mNvPq563Lo_K9",
    driveSynced: true,
    starred: false,
    tags: ["NDA", "ApexVentures", "Confidential"]
  },
  {
    id: "doc-3",
    originalName: "OfferLetter_SeniorDev_Chen.pdf",
    standardName: "2026-09-10_HR_Employment-Contract-Chen.pdf",
    category: "HR",
    subject: "Employment-Contract-Chen",
    date: "2026-09-10",
    folder: "2026-09",
    size: "2.1 MB",
    uploadedBy: "Sarah Lin (HR)",
    driveFileId: "1mO23_7tTrZ092Kp_B4",
    driveSynced: true,
    starred: true,
    tags: ["Onboarding", "Engineering", "Payroll"]
  },
  {
    id: "doc-4",
    originalName: "Office_Lease_Renewal_2026.pdf",
    standardName: "2026-08-14_Contracts_HQ-Lease-Addendum.pdf",
    category: "Contracts",
    subject: "HQ-Lease-Addendum",
    date: "2026-08-14",
    folder: "2026-08",
    size: "4.8 MB",
    uploadedBy: "Facility Lead",
    driveFileId: "1rV66_pPwXq118Lm_M1",
    driveSynced: true,
    starred: false,
    tags: ["RealEstate", "HQ", "Lease"]
  },
  {
    id: "doc-5",
    originalName: "Q2_Corporate_Tax_Filing.pdf",
    standardName: "2026-08-20_Tax_IRB-Quarterly-Return.pdf",
    category: "Tax",
    subject: "IRB-Quarterly-Return",
    date: "2026-08-20",
    folder: "2026-08",
    size: "3.2 MB",
    uploadedBy: "Tax Partner",
    driveFileId: "1tU44_dCvMn875Jk_H7",
    driveSynced: true,
    starred: true,
    tags: ["IRB", "Statutory", "Q2"]
  },
  {
    id: "doc-6",
    originalName: "Annual_Security_Audit_Report.pdf",
    standardName: "2026-07-28_Reports_SOC2-TypeII-Compliance.pdf",
    category: "Reports",
    subject: "SOC2-TypeII-Compliance",
    date: "2026-07-28",
    folder: "2026-07",
    size: "6.7 MB",
    uploadedBy: "SecOps",
    driveFileId: "1kP99_zWqRt334Lk_F0",
    driveSynced: true,
    starred: false,
    tags: ["SOC2", "Audit", "Infosec"]
  }
];

export default function OfficeFilingApp() {
  // State
  const [documents, setDocuments] = useState(INITIAL_DOCS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all"); // 'all' or 'YYYY-MM'
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'
  const [activeDoc, setActiveDoc] = useState(INITIAL_DOCS[0]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Trigger temporary toast notifications
  const notify = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  // Derive distinct folders (sorted newest first)
  const availableFolders = useMemo(() => {
    const folders = Array.from(new Set(documents.map((d) => d.folder)));
    return folders.sort().reverse();
  }, [documents]);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.standardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFolder =
        selectedFolder === "all" ? true : doc.folder === selectedFolder;
      const matchesCategory =
        selectedCategory === "all" ? true : doc.category === selectedCategory;

      return matchesSearch && matchesFolder && matchesCategory;
    });
  }, [documents, searchQuery, selectedFolder, selectedCategory]);

  const toggleStar = (id) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, starred: !doc.starred } : doc
      )
    );
  };

  const deleteDocument = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (activeDoc?.id === id) {
      setActiveDoc(null);
    }
    notify("Document removed from Office Hub and Google Drive index.");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0c10] text-neutral-100 font-sans antialiased selection:bg-[#FFCC00] selection:text-black">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1c222c] border-l-4 border-[#FFCC00] text-neutral-200 px-4 py-3 rounded shadow-2xl animate-fade-in text-sm">
          <svg className="w-5 h-5 text-[#FFCC00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{notification}</span>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-[#1f2633] bg-[#0d1017] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Drive Header */}
          <div className="p-5 border-b border-[#1f2633] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-[#FFCC00] text-black font-black flex items-center justify-center text-xl shadow-[0_0_15px_rgba(255,204,0,0.35)]">
                ▲
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
                  VaultDrive
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFCC00]/15 text-[#FFCC00] border border-[#FFCC00]/30 font-semibold uppercase">
                    Sync
                  </span>
                </h1>
                <p className="text-[11px] text-neutral-400">Google Drive Enterprise</p>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="p-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#FFCC00] hover:bg-[#ffdb33] text-black font-bold py-2.5 px-4 rounded-lg transition-all duration-150 shadow-md hover:shadow-[0_0_15px_rgba(255,204,0,0.4)] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Upload PDF</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 text-xs">
            <button
              onClick={() => { setSelectedFolder("all"); setSelectedCategory("all"); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium transition ${
                selectedFolder === "all" && selectedCategory === "all"
                  ? "bg-[#FFCC00]/15 text-[#FFCC00] border-l-2 border-[#FFCC00]"
                  : "text-neutral-300 hover:bg-[#161c26] hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                All Documents
              </span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#1f2633] text-neutral-300">
                {documents.length}
              </span>
            </button>

            {/* Folder Trees (Month Grouping) */}
            <div className="pt-4 pb-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Monthly Drive Folders
              </span>
            </div>

            <div className="space-y-0.5 max-h-40 overflow-y-auto pr-1">
              {availableFolders.map((f) => {
                const count = documents.filter((d) => d.folder === f).length;
                const isSelected = selectedFolder === f;
                return (
                  <button
                    key={f}
                    onClick={() => setSelectedFolder(isSelected ? "all" : f)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md font-medium text-xs transition ${
                      isSelected
                        ? "bg-[#FFCC00]/10 text-[#FFCC00] font-semibold"
                        : "text-neutral-400 hover:bg-[#161c26] hover:text-neutral-200"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <svg className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#FFCC00]" : "text-neutral-500"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      </svg>
                      {f}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#161c26] text-neutral-400">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Categories */}
            <div className="pt-4 pb-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Categories
              </span>
            </div>

            <div className="space-y-0.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(isSelected ? "all" : cat)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition ${
                      isSelected
                        ? "bg-[#1f2633] text-[#FFCC00] font-bold"
                        : "text-neutral-400 hover:bg-[#161c26] hover:text-neutral-200"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-[#FFCC00]" : "bg-neutral-600"}`} />
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Drive Storage Quota widget */}
        <div className="p-4 border-t border-[#1f2633] bg-[#0b0e14]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Drive Synced
            </span>
            <span className="text-neutral-400 font-mono">18.6 MB / 15 GB</span>
          </div>
          <div className="w-full bg-[#1c222c] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#FFCC00] h-full rounded-full w-[4%]" />
          </div>
          <div className="flex justify-between items-center mt-2 text-[10px] text-neutral-500">
            <span>Enterprise Vault</span>
            <span className="text-[#FFCC00] hover:underline cursor-pointer">Manage API</span>
          </div>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0c0f14]">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#1f2633] px-6 flex items-center justify-between shrink-0 bg-[#0d1017]/80 backdrop-blur-sm">
          {/* Search Box */}
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search standardized names, subjects, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141822] text-xs text-neutral-200 placeholder-neutral-500 pl-9 pr-4 py-2 rounded-lg border border-[#242d3d] focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] outline-none transition"
            />
            <svg
              className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-xs text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Controls: Active filters, View Switch, Refresh */}
          <div className="flex items-center space-x-3">
            {/* Folder badge if filtered */}
            {selectedFolder !== "all" && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-[#FFCC00]/10 text-[#FFCC00] border border-[#FFCC00]/30 px-2.5 py-1 rounded-full">
                Folder: {selectedFolder}
                <button onClick={() => setSelectedFolder("all")} className="hover:text-white font-bold">×</button>
              </span>
            )}

            {/* Category badge */}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-neutral-800 text-neutral-200 border border-neutral-700 px-2.5 py-1 rounded-full">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("all")} className="hover:text-[#FFCC00] font-bold">×</button>
              </span>
            )}

            {/* View switcher */}
            <div className="flex bg-[#141822] border border-[#242d3d] rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded ${viewMode === "table" ? "bg-[#FFCC00] text-black" : "text-neutral-400 hover:text-white"}`}
                title="List view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-[#FFCC00] text-black" : "text-neutral-400 hover:text-white"}`}
                title="Grid view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>

            {/* Standard Naming Schema Reminder Button */}
            <button
              onClick={() => notify("Standard Format: YYYY-MM-DD_Category_Subject.pdf")}
              className="text-xs text-neutral-400 hover:text-[#FFCC00] border border-[#242d3d] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition"
              title="Naming Convention Rule"
            >
              <span className="font-mono text-[11px] text-[#FFCC00]">ISO</span>
              Schema
            </button>
          </div>
        </header>

        {/* Breadcrumb Path Banner */}
        <div className="px-6 py-2.5 bg-[#0f131a] border-b border-[#1a212d] flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center space-x-2">
            <span className="text-[#FFCC00] font-semibold">Google Drive</span>
            <span>/</span>
            <span>OfficeVault</span>
            <span>/</span>
            <span className="text-neutral-200 font-medium">
              {selectedFolder === "all" ? "All Months" : selectedFolder}
            </span>
          </div>
          <span className="text-neutral-400 font-mono">
            Showing {filteredDocs.length} {filteredDocs.length === 1 ? "document" : "documents"}
          </span>
        </div>

        {/* Content Body: Table or Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredDocs.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-[#1f2633] rounded-xl text-center p-6">
              <div className="w-12 h-12 rounded-full bg-[#181f2c] flex items-center justify-center text-[#FFCC00] mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-sm">No Documents Matched</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                No indexed PDFs found matching the current search parameters or selected month/category filters.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedFolder("all"); setSelectedCategory("all"); }}
                className="mt-4 text-xs font-semibold text-[#FFCC00] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === "table" ? (
            <div className="border border-[#1f2633] rounded-xl overflow-hidden bg-[#0d1017]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1f2633] bg-[#121620] text-neutral-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 w-10">★</th>
                    <th className="py-3 px-4 font-semibold">Standardized Name</th>
                    <th className="py-3 px-4 font-semibold">Target Folder</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Size</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171d27]">
                  {filteredDocs.map((doc) => {
                    const isSelected = activeDoc?.id === doc.id;
                    return (
                      <tr
                        key={doc.id}
                        onClick={() => setActiveDoc(doc)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#FFCC00]/10 text-white"
                            : "hover:bg-[#151a24] text-neutral-300"
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(doc.id);
                            }}
                            className={`${doc.starred ? "text-[#FFCC00]" : "text-neutral-600 hover:text-neutral-400"}`}
                          >
                            ★
                          </button>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-white flex items-center gap-2">
                          <span className="text-red-400 text-sm">📄</span>
                          <span className="truncate max-w-md">{doc.standardName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-neutral-300 bg-[#161c26] px-2 py-0.5 rounded border border-[#232b3a]">
                            {doc.folder}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#1e2634] text-[#FFCC00] border border-[#FFCC00]/20">
                            {doc.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-neutral-400 whitespace-nowrap">{doc.date}</td>
                        <td className="py-3 px-4 text-neutral-400 whitespace-nowrap">{doc.size}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                setActiveDoc(doc);
                                notify(`Opening metadata for: ${doc.standardName}`);
                              }}
                              className="text-neutral-400 hover:text-white p-1 rounded hover:bg-[#202734]"
                              title="Inspector"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => notify(`Downloading: ${doc.standardName}`)}
                              className="text-neutral-400 hover:text-[#FFCC00] p-1 rounded hover:bg-[#202734]"
                              title="Download"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteDocument(doc.id)}
                              className="text-neutral-500 hover:text-red-400 p-1 rounded hover:bg-[#202734]"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocs.map((doc) => {
                const isSelected = activeDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setActiveDoc(doc)}
                    className={`rounded-xl border p-4 cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#141923] border-[#FFCC00] shadow-[0_0_15px_rgba(255,204,0,0.15)]"
                        : "bg-[#0d1017] border-[#1f2633] hover:border-neutral-600 hover:bg-[#121620]"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-lg bg-red-950/40 border border-red-800/40 text-red-400 flex items-center justify-center font-bold text-xs">
                          PDF
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(doc.id);
                          }}
                          className={`${doc.starred ? "text-[#FFCC00]" : "text-neutral-600 hover:text-neutral-400"}`}
                        >
                          ★
                        </button>
                      </div>

                      <h4 className="font-mono text-xs font-semibold text-white mt-3 line-clamp-2 leading-snug">
                        {doc.standardName}
                      </h4>

                      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#161c26] text-[#FFCC00] border border-[#FFCC00]/20 font-medium">
                          {doc.category}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#181e2b] text-neutral-400">
                          📁 {doc.folder}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1a212c] flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{doc.date}</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* --- RIGHT PANEL / METADATA INSPECTOR --- */}
      <aside className="w-80 border-l border-[#1f2633] bg-[#0d1017] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#1f2633] flex items-center justify-between">
          <h3 className="font-bold text-xs tracking-wider uppercase text-neutral-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
            File Inspector
          </h3>
          <span className="text-[10px] font-mono text-[#FFCC00] bg-[#FFCC00]/10 px-2 py-0.5 rounded">
            Drive Metadata
          </span>
        </div>

        {activeDoc ? (
          <div className="p-5 flex-1 overflow-y-auto space-y-6 text-xs">
            {/* Document Preview Card */}
            <div className="bg-[#141822] border border-[#202735] p-4 rounded-xl flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-xl bg-red-950/40 border border-red-700/50 flex items-center justify-center text-red-400 text-2xl mb-2">
                📄
              </div>
              <p className="font-mono text-white text-xs font-semibold break-all">
                {activeDoc.standardName}
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Original: {activeDoc.originalName}
              </p>
              <div className="mt-3 flex gap-2 w-full">
                <button
                  onClick={() => notify(`Opening Google Drive preview for ${activeDoc.standardName}`)}
                  className="flex-1 py-1.5 bg-[#FFCC00] text-black font-bold rounded text-[11px] hover:bg-[#ffdb33] transition"
                >
                  View in Drive
                </button>
                <button
                  onClick={() => notify(`Copied Drive link to clipboard.`)}
                  className="px-3 py-1.5 bg-[#1f2735] text-neutral-300 font-semibold rounded text-[11px] hover:text-white transition"
                  title="Copy share link"
                >
                  🔗 Link
                </button>
              </div>
            </div>

            {/* Standard Naming Breakdown */}
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-2">
                Naming Breakdown (Standard)
              </label>
              <div className="space-y-1.5 font-mono text-[11px] bg-[#121620] p-3 rounded-lg border border-[#1e2533]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Date Prefix:</span>
                  <span className="text-[#FFCC00]">{activeDoc.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Category:</span>
                  <span className="text-white">{activeDoc.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subject:</span>
                  <span className="text-white">{activeDoc.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Extension:</span>
                  <span className="text-neutral-400">.pdf</span>
                </div>
              </div>
            </div>

            {/* Storage & Drive Specifics */}
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-2">
                Google Drive Storage Sync
              </label>
              <div className="space-y-2 text-neutral-300">
                <div className="flex justify-between py-1 border-b border-[#1b222e]">
                  <span className="text-neutral-500">Target Folder</span>
                  <span className="font-mono text-white">/OfficeVault/{activeDoc.folder}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1b222e]">
                  <span className="text-neutral-500">Drive File ID</span>
                  <span className="font-mono text-[#FFCC00]">{activeDoc.driveFileId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1b222e]">
                  <span className="text-neutral-500">File Size</span>
                  <span>{activeDoc.size}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1b222e]">
                  <span className="text-neutral-500">Uploaded By</span>
                  <span className="text-white">{activeDoc.uploadedBy}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1b222e]">
                  <span className="text-neutral-500">Sync Status</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Live Cloud Sync
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-2">
                Indexing Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {activeDoc.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-[#161c26] text-neutral-300 border border-[#263042] text-[11px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-500 flex-1 flex flex-col items-center justify-center text-xs">
            <svg className="w-10 h-10 mb-2 opacity-30 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Select any PDF document to inspect its naming schema, Google Drive folder target, and attributes.
          </div>
        )}
      </aside>

      {/* --- UPLOAD & STANDARDIZATION MODAL --- */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onAddDocument={(newDoc) => {
            setDocuments((prev) => [newDoc, ...prev]);
            setActiveDoc(newDoc);
            notify(`Success: ${newDoc.standardName} created and sorted to ${newDoc.folder}`);
          }}
        />
      )}
    </div>
  );
}

// --- SUBCOMPONENT: UPLOAD MODAL WITH AUTO-NAMING & GROUPING ---
function UploadModal({ onClose, onAddDocument }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [docDate, setDocDate] = useState("2026-09-14"); // Current date
  const [category, setCategory] = useState("Invoices");
  const [subject, setSubject] = useState("");
  const [uploadedBy, setUploadedBy] = useState("Admin Office");
  const [tagInput, setTagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Sanitized subject for filename
  const cleanSubject = useMemo(() => {
    return (
      subject
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "-")
        .replace(/-+/g, "-") || "Document-Title"
    );
  }, [subject]);

  // Standardized filename: YYYY-MM-DD_Category_Subject.pdf
  const standardizedName = useMemo(() => {
    const dateStr = docDate || "YYYY-MM-DD";
    return `${dateStr}_${category}_${cleanSubject}.pdf`;
  }, [docDate, category, cleanSubject]);

  // Derived Month-Based Target Folder: YYYY-MM
  const targetFolder = useMemo(() => {
    if (!docDate || docDate.length < 7) return "Unsorted";
    return docDate.substring(0, 7); // e.g., 2026-09
  }, [docDate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        alert("Only PDF documents are permitted for standardized archive filing.");
        return;
      }
      setSelectedFile(file);
      // If subject is empty, seed from original filename
      if (!subject) {
        const rawName = file.name.replace(/\.[^/.]+$/, "");
        setSubject(rawName.replace(/\s+/g, "-"));
      }
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile && !subject) {
      alert("Please select a PDF file or provide a subject.");
      return;
    }

    setIsUploading(true);

    // Simulate Google Drive upload API progress
    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      setUploadProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const newDoc = {
            id: `doc-${Date.now()}`,
            originalName: selectedFile ? selectedFile.name : `${cleanSubject}.pdf`,
            standardName: standardizedName,
            category: category,
            subject: cleanSubject,
            date: docDate,
            folder: targetFolder,
            size: selectedFile
              ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
              : "1.20 MB",
            uploadedBy: uploadedBy || "Staff Member",
            driveFileId: `1d_${Math.random().toString(36).substring(2, 11)}`,
            driveSynced: true,
            starred: false,
            tags: tagInput
              ? tagInput.split(",").map((t) => t.trim()).filter(Boolean)
              : [category, "Archived"]
          };
          onAddDocument(newDoc);
          setIsUploading(false);
          onClose();
        }, 400);
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f131a] border border-[#242d3d] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1f2633] flex items-center justify-between bg-[#131822]">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFCC00]" />
              Standardized PDF Ingestion
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Files are automatically formatted and routed to month-based Drive folders.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-md text-sm"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
          {/* File Drag / Selector */}
          <div className="border-2 border-dashed border-[#263143] rounded-xl p-5 text-center bg-[#11151e] hover:border-[#FFCC00]/50 transition">
            <input
              type="file"
              id="file-upload"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg className="w-8 h-8 text-[#FFCC00] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-neutral-200 font-medium">
                {selectedFile ? selectedFile.name : "Click to select PDF document"}
              </span>
              <span className="text-[11px] text-neutral-500 mt-1">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Supports PDF files up to 50MB"}
              </span>
            </label>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 font-semibold mb-1 text-[11px]">
                Document Date <span className="text-[#FFCC00]">*</span>
              </label>
              <input
                type="date"
                required
                value={docDate}
                onChange={(e) => setDocDate(e.target.value)}
                className="w-full bg-[#161c26] border border-[#283344] rounded-lg px-3 py-2 text-white outline-none focus:border-[#FFCC00]"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1 text-[11px]">
                Filing Category <span className="text-[#FFCC00]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#161c26] border border-[#283344] rounded-lg px-3 py-2 text-white outline-none focus:border-[#FFCC00]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 font-semibold mb-1 text-[11px]">
              Document Subject / Title <span className="text-[#FFCC00]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AWS-Monthly-Bill or Quarterly-Lease-Renewal"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#161c26] border border-[#283344] rounded-lg px-3 py-2 text-white outline-none focus:border-[#FFCC00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 font-semibold mb-1 text-[11px]">
                Uploaded By
              </label>
              <input
                type="text"
                value={uploadedBy}
                onChange={(e) => setUploadedBy(e.target.value)}
                className="w-full bg-[#161c26] border border-[#283344] rounded-lg px-3 py-2 text-white outline-none focus:border-[#FFCC00]"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1 text-[11px]">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="Finance, Statutory, Urgent"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full bg-[#161c26] border border-[#283344] rounded-lg px-3 py-2 text-white outline-none focus:border-[#FFCC00]"
              />
            </div>
          </div>

          {/* AUTOMATED PREVIEW BOX */}
          <div className="bg-[#141924] border border-[#222b3a] rounded-xl p-3.5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFCC00]">
              Automated Google Drive Routing Preview
            </span>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="text-neutral-400 flex items-start gap-2">
                <span className="text-neutral-500 shrink-0">Standardized:</span>
                <span className="text-white font-semibold break-all">
                  {standardizedName}
                </span>
              </div>
              <div className="text-neutral-400 flex items-center gap-2">
                <span className="text-neutral-500 shrink-0">Drive Folder:</span>
                <span className="text-[#FFCC00] font-bold">
                  /OfficeVault/{targetFolder}/
                </span>
              </div>
            </div>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                <span>Syncing with Google Drive API...</span>
                <span className="text-[#FFCC00] font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[#1c222c] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#FFCC00] h-full transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-lg bg-[#181d27] text-neutral-300 hover:text-white font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2 rounded-lg bg-[#FFCC00] hover:bg-[#ffdb33] text-black font-bold transition flex items-center gap-2 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-black" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Syncing...</span>
                </>
              ) : (
                <span>Confirm & File to Drive</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
