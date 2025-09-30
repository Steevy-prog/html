import React, { useState } from "react";
import Header from "../composants/header";
import Footer from "../composants/footer";
import Card from "../composants/card";

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
      <main className="container mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="tabs flex gap-2 mb-6">
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
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium mb-2">Aucun CER créé</h3>
                <p className="mb-6">Commencez par créer votre premier CER</p>
                <button
                  className="px-4 py-2 bg-orange-500 text-white rounded-md"
                  onClick={() => showTab("addCer")}
                >
                  Créer un CER
                </button>
              </div>
            ) : (
              <div className="cer-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCers.map((cer) => (
                  <Card
                    key={cer.id}
                    image={cer.image}
                    title={cer.title}
                    author={cer.category}
                    description={`${cer.date} • ${getStatusBadge(cer.status).text} • ${cer.views} vues`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "addCer" && (
          <div className="tab-content">
            <form id="cer-form" onSubmit={handleFormSubmit} className="space-y-4">
              <input className="w-full border rounded px-3 py-2" type="text" name="title" placeholder="Titre du CER" />
              <input className="w-full border rounded px-3 py-2" type="text" name="category" placeholder="Catégorie" />
              <input className="w-full" type="file" name="image" />
              <input className="w-full" type="file" name="content" />
              <div className="tags-input flex flex-wrap gap-2 items-center">
                {tags.map((tag, i) => (
                  <div key={i} className="tag bg-gray-100 px-2 py-1 rounded flex items-center gap-2">
                    <span>{tag}</span>
                    <button type="button" onClick={() => removeTag(i)} className="text-sm">×</button>
                  </div>
                ))}
                <input
                  className="px-3 py-2 border rounded"
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
              <button className="px-4 py-2 bg-green-600 text-white rounded" type="submit">Ajouter CER</button>
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