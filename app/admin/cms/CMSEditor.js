"use client";
import { useState, useRef, useEffect } from "react";
export const metadata = {
  robots: { index: false, follow: false },
};
// ── Editable field — defined OUTSIDE CMSEditor so it never remounts on parent re-render
function E({
  section,
  fieldKey,
  tag: Tag = "span",
  style,
  multiline,
  placeholder,
  content,
  editingId,
  draft,
  setDraft,
  onStartEdit,
  onSave,
  onCancel,
  saving,
  saved,
}) {
  const inputRef = useRef(null);
  const id = `${section}.${fieldKey}`;
  const isEditing = editingId === id;
  const isSaving = saving === id;
  const isSaved = saved === id;
  const val = content[section]?.[fieldKey] ?? "";
  const display = val || placeholder || `[${fieldKey}]`;

  function handleStartEdit() {
    onStartEdit(section, fieldKey, val);
    setTimeout(() => inputRef.current?.focus(), 30);
  }

  if (isEditing) {
    return (
      <span style={{ display: "block", position: "relative", zIndex: 50 }}>
        {multiline ? (
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            style={es.textarea}
            rows={3}
            autoFocus
          />
        ) : (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            style={es.input}
            autoFocus
          />
        )}
        <span style={es.actions}>
          <button
            onClick={() => onSave(section, fieldKey, draft)}
            disabled={isSaving}
            style={es.saveBtn}
          >
            {isSaving ? "Saving..." : "✓ Save"}
          </button>
          <button onClick={onCancel} style={es.cancelBtn}>
            ✕ Cancel
          </button>
        </span>
      </span>
    );
  }

  return (
    <Tag
      style={{
        ...style,
        background: isSaved ? "#dcfce7" : "#fef9c3",
        outline: isSaved ? "2px solid #22c55e" : "1.5px dashed #ca8a04",
        borderRadius: 4,
        padding: "2px 6px",
        cursor: "pointer",
        display: "inline-block",
        minWidth: 60,
        minHeight: 20,
        transition: "background 0.3s",
      }}
      onClick={handleStartEdit}
      title={`Click to edit: ${fieldKey}`}
    >
      {display}
      <span style={{ fontSize: 10, opacity: 0.5, marginLeft: 4 }}>✏️</span>
    </Tag>
  );
}

// ── Main CMS editor
export default function CMSEditor({ initialContent }) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");

  function handleStartEdit(section, fieldKey, currentVal) {
    setDraft(currentVal || "");
    setEditingId(`${section}.${fieldKey}`);
  }

  function handleCancel() {
    setEditingId(null);
    setDraft("");
  }

  async function handleSave(section, fieldKey, value) {
    const id = `${section}.${fieldKey}`;
    setSaving(id);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          key: fieldKey,
          value,
          changedBy: "admin",
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setContent((prev) => ({
        ...prev,
        [section]: { ...prev[section], [fieldKey]: value },
      }));
      setSaved(id);
      setTimeout(() => setSaved(null), 2000);
    } catch (e) {
      alert("Save failed: " + e.message);
    } finally {
      setSaving(null);
      setEditingId(null);
      setDraft("");
    }
  }
  function GalleryManager() {
    const [items, setItems] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadType, setUploadType] = useState("image"); // "image" | "video"
    const [editId, setEditId] = useState(null);
    const [editCaption, setEditCaption] = useState("");
    const fileRef = useRef(null);

    async function load() {
      const res = await fetch("/api/admin/gallery");
      setItems(await res.json());
    }

    useEffect(() => {
      load();
    }, []);

    async function handleUpload(e) {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        // Step 1: Upload to Cloudinary via our API
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", uploadType);

        const uploadRes = await fetch("/api/admin/gallery/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error || "Upload failed");
        }

        const { url, type } = await uploadRes.json();

        // Step 2: Save URL to MongoDB gallery collection
        await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, type, caption: "" }),
        });

        await load();
      } catch (err) {
        alert("Upload failed: " + err.message);
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    }

    async function handleDelete(id) {
      if (!confirm("Delete this item?")) return;
      await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await load();
    }

    async function saveCaption(id) {
      await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, caption: editCaption }),
      });
      setEditId(null);
      await load();
    }

    return (
      <div>
        {/* Type toggle + upload button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div style={gm.typeToggle}>
            {["image", "video"].map((t) => (
              <button
                key={t}
                onClick={() => setUploadType(t)}
                style={{
                  ...gm.typeBtn,
                  ...(uploadType === t ? gm.typeBtnActive : {}),
                }}
              >
                {t === "image" ? "📷 Image" : "🎬 Video"}
              </button>
            ))}
          </div>

          <label style={gm.uploadLabel}>
            <span style={{ ...gm.uploadBtn, opacity: uploading ? 0.6 : 1 }}>
              {uploading
                ? "Uploading…"
                : `＋ Upload ${uploadType === "video" ? "Video" : "Image"}`}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept={uploadType === "video" ? "video/*" : "image/*"}
              hidden
              disabled={uploading}
              onChange={handleUpload}
            />
          </label>
        </div>

        {items.length === 0 && (
          <p style={{ color: "#9ca3af" }}>
            No items yet. Upload an image or video above.
          </p>
        )}

        <div style={gm.grid}>
          {items.map((item) => (
            <div key={item._id} style={gm.card}>
              {/* Thumbnail */}
              {item.type === "video" ? (
                <div style={gm.videoThumb}>
                  <video src={item.url} style={gm.videoEl} muted />
                  <span style={gm.videoTag}>🎬 Video</span>
                </div>
              ) : (
                <img src={item.url} alt={item.caption} style={gm.thumb} />
              )}

              {/* Caption row */}
              <div style={gm.cardBody}>
                {editId === item._id ? (
                  <div style={{ display: "flex", gap: 6 }}>
                    <input
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      style={gm.captionInput}
                      placeholder="Caption…"
                      autoFocus
                    />
                    <button
                      onClick={() => saveCaption(item._id)}
                      style={gm.saveBtn}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      style={gm.cancelBtn}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span style={gm.captionText}>
                      {item.caption || (
                        <em style={{ color: "#9ca3af" }}>No caption</em>
                      )}
                    </span>
                    <button
                      onClick={() => {
                        setEditId(item._id);
                        setEditCaption(item.caption);
                      }}
                      style={gm.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      style={gm.deleteBtn}
                    >
                      🗑
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const gm = {
    typeToggle: {
      display: "flex",
      background: "#f1f5f9",
      borderRadius: 8,
      padding: 3,
      gap: 4,
    },
    typeBtn: {
      padding: "6px 16px",
      border: "none",
      borderRadius: 6,
      fontWeight: 600,
      fontSize: 13,
      cursor: "pointer",
      background: "transparent",
      color: "#374151",
    },
    typeBtnActive: { background: "#0077be", color: "#fff" },
    uploadLabel: { display: "inline-block", cursor: "pointer" },
    uploadBtn: {
      padding: "9px 22px",
      background: "#0077be",
      color: "#fff",
      borderRadius: 8,
      fontWeight: 700,
      fontSize: 14,
      display: "inline-block",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: 16,
      marginTop: 8,
    },
    card: {
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
      overflow: "hidden",
      border: "1px solid #e5e7eb",
    },
    thumb: { width: "100%", height: 140, objectFit: "cover", display: "block" },
    videoThumb: {
      position: "relative",
      width: "100%",
      height: 140,
      background: "#0c1a2e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    videoEl: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: 0.5,
    },
    videoTag: {
      position: "absolute",
      fontSize: 13,
      fontWeight: 700,
      color: "#fff",
      background: "rgba(0,0,0,0.5)",
      padding: "3px 10px",
      borderRadius: 20,
    },
    cardBody: { padding: "10px 12px" },
    captionText: { flex: 1, fontSize: 13, color: "#374151" },
    captionInput: {
      flex: 1,
      padding: "5px 10px",
      fontSize: 13,
      border: "1.5px solid #0077be",
      borderRadius: 6,
      outline: "none",
    },
    saveBtn: {
      padding: "5px 12px",
      background: "#0077be",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      fontWeight: 700,
      fontSize: 12,
      cursor: "pointer",
    },
    cancelBtn: {
      padding: "5px 10px",
      background: "#f1f5f9",
      color: "#374151",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
    },
    editBtn: {
      padding: "3px 10px",
      background: "#f0f9ff",
      color: "#0077be",
      border: "1px solid #bae6fd",
      borderRadius: 6,
      fontSize: 12,
      cursor: "pointer",
    },
    deleteBtn: {
      padding: "3px 8px",
      background: "#fef2f2",
      border: "1px solid #fecaca",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 14,
    },
  };

  // Shared props passed to every E instance
  const eProps = {
    content,
    editingId,
    draft,
    setDraft,
    saving,
    saved,
    onStartEdit: handleStartEdit,
    onSave: handleSave,
    onCancel: handleCancel,
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Toolbar */}
      <div style={tb.bar}>
        <span style={tb.logo}>🔧 CMS Editor</span>
        <span style={tb.hint}>
          Click any{" "}
          <span
            style={{
              background: "#fef9c3",
              color: "#92400e",
              padding: "1px 6px",
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            yellow field
          </span>{" "}
          to edit & save
        </span>
        <a href="/admin/dashboard" style={tb.back}>
          ← Dashboard
        </a>
      </div>

      <div style={{ paddingTop: 56 }}>
        {/* NAVBAR */}
        <Block label="NAVBAR" bg="#f8fafc">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
              padding: "20px 0",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  color: "#0077be",
                  marginBottom: 4,
                }}
              >
                <E
                  {...eProps}
                  section="navbar"
                  fieldKey="brandName"
                  placeholder="M.M.S"
                  style={{ fontWeight: 800, fontSize: 18, color: "#0077be" }}
                />
              </div>
              <E
                {...eProps}
                section="navbar"
                fieldKey="brandTagline"
                placeholder="Water Diviners"
                style={{ fontSize: 12, color: "#6b7280" }}
              />
            </div>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 12, color: "#6b7280" }}>CTA:</span>
              <E
                {...eProps}
                section="navbar"
                fieldKey="ctaLabel"
                placeholder="Call Now"
                style={{
                  background: "#0077be",
                  color: "#111",
                  padding: "8px 16px",
                  borderRadius: 20,
                  fontWeight: 700,
                  fontSize: 13,
                }}
              />
              <E
                {...eProps}
                section="navbar"
                fieldKey="ctaPhone"
                placeholder="tel:XXXXXXXXXX"
                style={{ fontSize: 13, color: "#0077be" }}
              />
            </div>
          </div>
        </Block>

        {/* HERO */}
        <Block label="HERO" bg="linear-gradient(135deg,#f0f9ff,#e0f2fe)">
          <div
            style={{
              maxWidth: 700,
              margin: "0 auto",
              textAlign: "center",
              padding: "20px 0",
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <E
                {...eProps}
                section="hero"
                fieldKey="brandName"
                tag="h1"
                placeholder="M.M.S WATER DIVINERS"
                style={{
                  fontSize: "clamp(24px,4vw,44px)",
                  fontWeight: 900,
                  color: "#0077be",
                }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <E
                {...eProps}
                section="hero"
                fieldKey="tagline"
                placeholder="Discovering Water, Sustaining Life"
                style={{ fontSize: 20, color: "#0369a1", fontWeight: 600 }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <E
                {...eProps}
                section="hero"
                fieldKey="subtitle"
                placeholder="Professional Geophysical Water Survey Experts"
                style={{ fontSize: 14, color: "#6b7280" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "16px 20px",
                }}
              >
                <div
                  style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}
                >
                  Expert Name
                </div>
                <E
                  {...eProps}
                  section="hero"
                  fieldKey="expertName"
                  placeholder="Dhananjay Manohar Sawant"
                  style={{ fontWeight: 800, color: "#0077be" }}
                />
                <div style={{ marginTop: 6 }}>
                  <E
                    {...eProps}
                    section="hero"
                    fieldKey="expertTitle"
                    placeholder="Geophysical Water Survey Expert"
                    style={{ fontSize: 12, color: "#6b7280" }}
                  />
                </div>
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "16px 20px",
                  textAlign: "center",
                }}
              >
                <E
                  {...eProps}
                  section="hero"
                  fieldKey="yearsExperience"
                  placeholder="10"
                  style={{
                    fontSize: 36,
                    fontWeight: 900,
                    color: "#0077be",
                    display: "block",
                  }}
                />
                <E
                  {...eProps}
                  section="hero"
                  fieldKey="yearsLabel"
                  placeholder="Years of Excellence"
                  style={{ fontSize: 12, color: "#6b7280" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 8, fontSize: 12, color: "#9ca3af" }}>
              Feature Badges
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              {["feature1", "feature2", "feature3", "feature4"].map((fk) => (
                <E
                  key={fk}
                  {...eProps}
                  section="hero"
                  fieldKey={fk}
                  placeholder={fk}
                  style={{
                    background: "#fff",
                    border: "1px solid #bae6fd",
                    color: "#0369a1",
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontSize: 13,
                  }}
                />
              ))}
            </div>

            <div style={{ marginBottom: 8, fontSize: 12, color: "#9ca3af" }}>
              CTA Buttons
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              <E
                {...eProps}
                section="hero"
                fieldKey="ctaCallLabel"
                placeholder="Call Now"
                style={{
                  background: "#0077be",
                  color: "#111",
                  padding: "10px 24px",
                  borderRadius: 30,
                  fontWeight: 700,
                }}
              />
              <E
                {...eProps}
                section="hero"
                fieldKey="ctaCallPhone"
                placeholder="tel:XXXXXXXXXX"
                style={{ fontSize: 13, color: "#0077be" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <E
                {...eProps}
                section="hero"
                fieldKey="ctaWhatsappLabel"
                placeholder="WhatsApp"
                style={{
                  background: "#25d366",
                  color: "#111",
                  padding: "10px 24px",
                  borderRadius: 30,
                  fontWeight: 700,
                }}
              />
              <E
                {...eProps}
                section="hero"
                fieldKey="ctaWhatsappHref"
                placeholder="https://wa.me/XXXXXXXXXX"
                style={{ fontSize: 13, color: "#0077be" }}
              />
            </div>
          </div>
        </Block>
        {/* ─── GALLERY BLOCK ─────────────────────────────── */}
        <Block label="GALLERY" bg="#f0f9ff">
          <GalleryManager />
        </Block>
        {/* STATS */}
        <Block label="STATS" bg="#0077be">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
              gap: 24,
              padding: "20px 0",
            }}
          >
            {[
              { num: "experienceTarget", lbl: "experienceLabel" },
              { num: "projectsTarget", lbl: "projectsLabel" },
              { num: "successTarget", lbl: "successLabel" },
              { num: "clientsTarget", lbl: "clientsLabel" },
            ].map(({ num, lbl }) => (
              <div key={num} style={{ textAlign: "center" }}>
                <E
                  {...eProps}
                  section="stats"
                  fieldKey={num}
                  placeholder="0"
                  style={{
                    fontSize: 36,
                    fontWeight: 900,
                    color: "#111",
                    display: "block",
                  }}
                />
                <E
                  {...eProps}
                  section="stats"
                  fieldKey={lbl}
                  placeholder="Label"
                  style={{ fontSize: 13, color: "#111" }}
                />
              </div>
            ))}
          </div>
        </Block>

        {/* JOURNEY */}
        <Block label="JOURNEY" bg="#f8fafc">
          <div style={{ padding: "20px 0" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <E
                {...eProps}
                section="journey"
                fieldKey="sectionTitle"
                tag="h2"
                placeholder="Our Journey With You"
                style={{ fontSize: 28, fontWeight: 800, color: "#0077be" }}
              />
              <br />
              <E
                {...eProps}
                section="journey"
                fieldKey="sectionSubtitle"
                placeholder="From first contact to water discovery"
                style={{ color: "#6b7280", marginTop: 8 }}
                multiline
              />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 16,
                  marginBottom: 20,
                  background: "#fff",
                  borderRadius: 14,
                  padding: 20,
                  boxShadow: "0 2px 8px rgba(0,119,190,0.08)",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#0077be",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {i}
                </div>
                <div style={{ flex: 1 }}>
                  <E
                    {...eProps}
                    section="journey"
                    fieldKey={`step${i}Title`}
                    placeholder={`Step ${i} Title`}
                    style={{
                      fontWeight: 800,
                      color: "#0077be",
                      fontSize: 16,
                      display: "block",
                      marginBottom: 4,
                    }}
                  />
                  <E
                    {...eProps}
                    section="journey"
                    fieldKey={`step${i}Subtitle`}
                    placeholder={`Step ${i} Subtitle`}
                    style={{
                      fontWeight: 600,
                      color: "#0369a1",
                      fontSize: 13,
                      display: "block",
                      marginBottom: 6,
                    }}
                  />
                  <E
                    {...eProps}
                    section="journey"
                    fieldKey={`step${i}Desc`}
                    placeholder="Description..."
                    style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.7 }}
                    multiline
                  />
                </div>
              </div>
            ))}
          </div>
        </Block>

        {/* PROCESS */}
        <Block label="PROCESS" bg="#fff">
          <div style={{ padding: "20px 0" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <E
                {...eProps}
                section="process"
                fieldKey="sectionTitle"
                tag="h2"
                placeholder="How We Work"
                style={{ fontSize: 28, fontWeight: 800, color: "#0077be" }}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                gap: 16,
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    background: "#f0f9ff",
                    borderRadius: 14,
                    padding: 20,
                    border: "1px solid #bae6fd",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#0077be",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {i}
                    </div>
                    <E
                      {...eProps}
                      section="process"
                      fieldKey={`step${i}Title`}
                      placeholder={`Step ${i}`}
                      style={{
                        fontWeight: 700,
                        color: "#0077be",
                        fontSize: 15,
                      }}
                    />
                  </div>
                  <E
                    {...eProps}
                    section="process"
                    fieldKey={`step${i}Desc`}
                    placeholder="Description..."
                    style={{
                      color: "#6b7280",
                      fontSize: 13,
                      display: "block",
                      marginBottom: 10,
                    }}
                    multiline
                  />
                  {[1, 2, 3].map((d) => (
                    <div
                      key={d}
                      style={{
                        borderBottom: "1px dashed #bae6fd",
                        paddingBottom: 4,
                        marginBottom: 4,
                      }}
                    >
                      <E
                        {...eProps}
                        section="process"
                        fieldKey={`step${i}Detail${d}`}
                        placeholder={`Detail ${d}`}
                        style={{ fontSize: 12, color: "#0369a1" }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Block>

        {/* SERVICES */}
        <Block label="SERVICES" bg="linear-gradient(135deg,#f5f7fa,#e8edf2)">
          <div style={{ padding: "20px 0" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <E
                {...eProps}
                section="services"
                fieldKey="sectionTitle"
                tag="h2"
                placeholder="Our Services"
                style={{ fontSize: 28, fontWeight: 800, color: "#0077be" }}
              />
              <br />
              <E
                {...eProps}
                section="services"
                fieldKey="sectionSubtitle"
                placeholder="Comprehensive groundwater survey solutions"
                style={{ color: "#6b7280", marginTop: 8 }}
                multiline
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
                gap: 16,
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    padding: 20,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  }}
                >
                  <E
                    {...eProps}
                    section="services"
                    fieldKey={`service${i}Title`}
                    placeholder={`Service ${i} Title`}
                    style={{
                      fontWeight: 700,
                      color: "#0077be",
                      fontSize: 15,
                      display: "block",
                      marginBottom: 8,
                    }}
                  />
                  <E
                    {...eProps}
                    section="services"
                    fieldKey={`service${i}Desc`}
                    placeholder="Description..."
                    style={{
                      color: "#6b7280",
                      fontSize: 13,
                      display: "block",
                      marginBottom: 10,
                    }}
                    multiline
                  />
                  {[1, 2, 3, 4].map((f) => (
                    <div key={f} style={{ paddingBottom: 3 }}>
                      <E
                        {...eProps}
                        section="services"
                        fieldKey={`service${i}Feature${f}`}
                        placeholder={`Feature ${f}`}
                        style={{ fontSize: 12, color: "#0369a1" }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 40,
                background: "#fff",
                borderRadius: 16,
                padding: 28,
                textAlign: "center",
              }}
            >
              <E
                {...eProps}
                section="services"
                fieldKey="ctaTitle"
                tag="h3"
                placeholder="Need a Custom Solution?"
                style={{
                  fontWeight: 800,
                  color: "#0077be",
                  fontSize: 20,
                  marginBottom: 8,
                }}
              />
              <br />
              <E
                {...eProps}
                section="services"
                fieldKey="ctaText"
                placeholder="Every project is unique..."
                style={{ color: "#6b7280" }}
                multiline
              />
              <br />
              <br />
              <E
                {...eProps}
                section="services"
                fieldKey="ctaButtonLabel"
                placeholder="Get in Touch"
                style={{
                  background: "#0077be",
                  color: "#111",
                  padding: "12px 32px",
                  borderRadius: 30,
                  fontWeight: 700,
                  display: "inline-block",
                }}
              />
            </div>
          </div>
        </Block>

        {/* FOOTER */}
        <Block
          label="FOOTER"
          bg="#0c4a6e"
          labelStyle={{ background: "#fff", color: "#0c4a6e" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 32,
              padding: "20px 0",
            }}
          >
            <div>
              <E
                {...eProps}
                section="footer"
                fieldKey="brandName"
                placeholder="M.M.S Water Diviners"
                style={{
                  fontWeight: 800,
                  color: "#111",
                  fontSize: 18,
                  display: "block",
                  marginBottom: 4,
                }}
              />
              <E
                {...eProps}
                section="footer"
                fieldKey="brandTagline"
                placeholder="Discovering Water, Sustaining Life"
                style={{
                  color: "#1e1e1f",
                  fontSize: 13,
                  display: "block",
                  marginBottom: 10,
                }}
              />
              <E
                {...eProps}
                section="footer"
                fieldKey="description"
                placeholder="About the company..."
                style={{ color: "#1e1e1f", fontSize: 12, lineHeight: 1.7 }}
                multiline
              />
            </div>
            <div>
              <E
                {...eProps}
                section="footer"
                fieldKey="quickLinksTitle"
                placeholder="Quick Links"
                style={{
                  color: "#111",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 8,
                }}
              />
              <E
                {...eProps}
                section="footer"
                fieldKey="servicesTitle"
                placeholder="Our Services"
                style={{
                  color: "#111",
                  fontWeight: 700,
                  display: "block",
                  marginTop: 16,
                  marginBottom: 8,
                }}
              />
              <E
                {...eProps}
                section="footer"
                fieldKey="contactTitle"
                placeholder="Contact Us"
                style={{
                  color: "#111",
                  fontWeight: 700,
                  display: "block",
                  marginTop: 16,
                }}
              />
            </div>
            <div>
              <div style={{ color: "#1e1e1f", fontSize: 13, marginBottom: 8 }}>
                📍{" "}
                <E
                  {...eProps}
                  section="footer"
                  fieldKey="location"
                  placeholder="Kankavli, Maharashtra"
                  style={{ color: "#1e1e1f" }}
                />
              </div>
              <div style={{ color: "#1e1e1f", fontSize: 13, marginBottom: 8 }}>
                📞{" "}
                <E
                  {...eProps}
                  section="footer"
                  fieldKey="phoneDisplay"
                  placeholder="9370427023"
                  style={{ color: "#1e1e1f" }}
                />
              </div>
              <div style={{ color: "#1e1e1f", fontSize: 13, marginBottom: 8 }}>
                ✉️{" "}
                <E
                  {...eProps}
                  section="footer"
                  fieldKey="emailDisplay"
                  placeholder="email@example.com"
                  style={{ color: "#1e1e1f" }}
                />
              </div>
              <div style={{ color: "#1e1e1f", fontSize: 13, marginBottom: 8 }}>
                📱{" "}
                <E
                  {...eProps}
                  section="footer"
                  fieldKey="phone"
                  placeholder="tel:9370427023"
                  style={{ color: "#1e1e1f" }}
                />
              </div>
              <div style={{ color: "#1e1e1f", fontSize: 13, marginBottom: 8 }}>
                💬{" "}
                <E
                  {...eProps}
                  section="footer"
                  fieldKey="whatsappHref"
                  placeholder="https://wa.me/XXXXXXXXXX"
                  style={{ color: "#1e1e1f" }}
                />
              </div>
              <E
                {...eProps}
                section="footer"
                fieldKey="copyrightOwner"
                placeholder="Dhananjay Manohar Sawant"
                style={{
                  color: "#1e1e1f",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "block",
                  marginTop: 12,
                }}
              />
            </div>
          </div>
        </Block>
      </div>
    </div>
  );
}

// ── Block wrapper
function Block({ label, bg, children, labelStyle }) {
  return (
    <div
      style={{
        position: "relative",
        background: bg,
        borderBottom: "3px dashed rgba(0,119,190,0.2)",
        padding: "20px 32px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 12,
          background: "#0077be",
          color: "#fff",
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: 2,
          padding: "3px 10px",
          borderRadius: 4,
          textTransform: "uppercase",
          zIndex: 5,
          ...labelStyle,
        }}
      >
        {label}
      </div>
      <div style={{ paddingTop: 16 }}>{children}</div>
    </div>
  );
}

// ── Styles
const tb = {
  bar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    background: "#1e293b",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "0 20px",
    height: 52,
    boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
  },
  logo: { fontWeight: 800, fontSize: 15, color: "#38bdf8", flexShrink: 0 },
  hint: { fontSize: 13, color: "#fff", flex: 1 },
  back: {
    padding: "6px 14px",
    background: "#334155",
    color: "#e2e8f0",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    textDecoration: "none",
    flexShrink: 0,
  },
};

const es = {
  input: {
    width: "100%",
    padding: "8px 12px",
    border: "2px solid #0077be",
    borderRadius: 6,
    fontSize: 14,
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "8px 12px",
    border: "2px solid #0077be",
    borderRadius: 6,
    fontSize: 14,
    outline: "none",
    background: "#fff",
    resize: "vertical",
    boxSizing: "border-box",
  },
  actions: { display: "flex", gap: 8, marginTop: 6 },
  saveBtn: {
    padding: "6px 16px",
    background: "#0077be",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "6px 12px",
    background: "#f1f5f9",
    color: "#374151",
    border: "none",
    borderRadius: 6,
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
};
