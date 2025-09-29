import React, { useState } from "react";
import Header from "../composants/header";
import Footer from "../composants/footer";

interface CER {
  id: number;
  title: string;
  category: string;
  image: string;
  date: string;
  status: "published" | "draft" | "pending";
  views: number;
  favorites: number;
}

function Gestion() {
  const [userCers, setUserCers] = useState<CER[]>([
    {
      id: 1,
      title: "Prosit 4.1 Développement avancé",
      category: "Développement",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=80&h=60&fit=crop",
      date: "15 Nov 2024",
      status: "published",
      views: 245,
      favorites: 8,
    },
    {
      id: 2,
      title: "Prosit 3.2 Base de données",
      category: "Base de données",
      image:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=80&h=60&fit=crop",
      date: "10 Nov 2024",
      status: "published",
      views: 189,
      favorites: 5,
    },
    {
      id: 3,
      title: "Prosit 2.3 Sécurité Web",
      category: "Sécurité",
      image:
        "https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?w=80&h=60&fit=crop",
      date: "08 Nov 2024",
      status: "draft",
      views: 0,
      favorites: 0,
    },
  ]);

  const [activeTab, setActiveTab] = useState<"myCers" | "addCer" | "analytics">(
    "myCers"
  );
  const [tags, setTags] = useState<string[]>([]);

  // --- Functions ---

  const showTab = (tab: "myCers" | "addCer" | "analytics") => {
    setActiveTab(tab);
  };

  const getStatusBadge = (status: CER["status"]) => {
    const statusMap: Record<
      CER["status"],
      { class: string; text: string }
    > = {
      published: { class: "status-published", text: "Publié" },
      draft: { class: "status-draft", text: "Brouillon" },
      pending: { class: "status-pending", text: "En attente" },
    };
    return statusMap[status] || statusMap.draft;
  };

  const addTag = (tag: string) => {
    const newTag = tag.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const editCER = (id: number) => {
    alert(`Fonctionnalité d'édition pour le CER ${id} sera implémentée`);
  };

  const deleteCER = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce CER ?")) {
      setUserCers(userCers.filter((cer) => cer.id !== id));
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newCER: CER = {
      id: userCers.length + 1,
      title: formData.get("title")?.toString() || "Nouveau CER",
      category: formData.get("category")?.toString() || "",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=80&h=60&fit=crop",
      date: new Date().toLocaleDateString("fr-FR"),
      status: "published",
      views: 0,
      favorites: 0,
    };

    setUserCers([newCER, ...userCers]);
    setTags([]);
    showTab("myCers");
    alert("CER ajouté avec succès !");
    form.reset();
  };

  // --- JSX Render ---

  return (
    <>
      <Header />
      <main>
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "myCers" ? "active" : ""}`}
            onClick={() => showTab("myCers")}
          >
            Mes CERs
          </button>
          <button
            className={`tab-btn ${activeTab === "addCer" ? "active" : ""}`}
            onClick={() => showTab("addCer")}
          >
            Ajouter un CER
          </button>
          <button
            className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => showTab("analytics")}
          >
            Analytics
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "myCers" && (
          <div className="tab-content">
            {userCers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 60, marginBottom: 20 }}>📝</div>
                <h3>Aucun CER créé</h3>
                <p style={{ marginBottom: 30 }}>
                  Commencez par créer votre premier CER
                </p>
                <button onClick={() => showTab("addCer")}>Créer un CER</button>
              </div>
            ) : (
              <div className="cer-list">
                {userCers.map((cer) => (
                  <div className="cer-item" key={cer.id}>
                    <img src={cer.image} alt={cer.title} />
                    <div className="cer-item-info">
                      <div className="cer-item-title">{cer.title}</div>
                      <div className="cer-item-meta">
                        {cer.category} • {cer.date} •{" "}
                        <span
                          className={`status-badge ${
                            getStatusBadge(cer.status).class
                          }`}
                        >
                          {getStatusBadge(cer.status).text}
                        </span>
                      </div>
                      <div className="cer-item-stats">
                        <span>👁 {cer.views} vues</span>
                        <span>♥ {cer.favorites} favoris</span>
                      </div>
                    </div>
                    <div className="cer-item-actions">
                      <button
                        className="btn-sm btn-edit"
                        onClick={() => editCER(cer.id)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn-sm btn-delete"
                        onClick={() => deleteCER(cer.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "addCer" && (
          <div className="tab-content">
            <form id="cer-form" onSubmit={handleFormSubmit}>
              <input type="text" name="title" placeholder="Titre du CER" />
              <input type="text" name="category" placeholder="Catégorie" />
              <input type="file" name="image" />
              <input type="file" name="content" />
              <div className="tags-input">
                {tags.map((tag, i) => (
                  <div className="tag" key={i}>
                    {tag}{" "}
                    <button type="button" onClick={() => removeTag(i)}>
                      ×
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="Ajouter un tag..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
              </div>
              <button type="submit">Ajouter CER</button>
            </form>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="tab-content">Analytics content goes here...</div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Gestion;