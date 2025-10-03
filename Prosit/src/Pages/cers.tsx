// src/Pages/Cers.tsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../composants/header";
import Footer from "../composants/footer";
import apiService from "../services/apiService";
import type { Cer } from "../types";

/** Type */
interface CER {
  id: number;
  title: string;
  author: string;
  category: string;
  domains: string[]; // domaines / tag categories
  level: string; // X1..X5
  image: string;
  date: string; // display date
  description: string;
  views: number;
  status: "published" | "draft" | "pending";
}

const LEVELS = ["X1", "X2", "X3", "X4", "X5"];
const DOMAINS = [
  "Réseau & Infra",
  "Securite",
  "Genie logiciel",
  "Data",
  "Gestion de projet",
];

const PAGE_SIZE = 6;

const Cers: React.FC = () => {
  const navigate = useNavigate();
  const [cerList, setCerList] = useState<CER[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "recent" | "ancien" | "populaire" | "titre"
  >("recent");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(1);

  // Charger les CERs depuis l'API
  useEffect(() => {
    loadCers();
  }, []);

  const loadCers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCers({ limit: 100, status: 'published' });
      if (response.success && response.data) {
        const apiCers = response.data as Cer[];
        // Convertir les CERs de l'API au format local
        const converted: CER[] = apiCers.map((cer) => ({
          id: cer.cer_id,
          title: cer.title,
          author: `${cer.author_first_name} ${cer.author_last_name}`,
          category: cer.category_name || 'Sans catégorie',
          domains: cer.keywords ? cer.keywords.split(',').map(k => k.trim()) : [],
          level: 'X3', // Vous pouvez ajouter ce champ dans votre base de données
          image: cer.thumbnail || 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop',
          date: new Date(cer.created_at).toLocaleDateString('fr-FR'),
          description: cer.description,
          views: cer.views_count || 0,
          status: cer.status as 'published' | 'draft' | 'pending'
        }));
        setCerList(converted);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des CERs:', error);
      // Garder les données de test en cas d'erreur
      setCerList([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Functions (kept / adapted) ---

  function toggleSidebar() {
    setSidebarOpen((s) => !s);
  }

  function toggleLevel(level: string) {
    setPage(1);
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  }

  function toggleDomain(domain: string) {
    setPage(1);
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  }

  function handleFavorite(id: number) {
    setFavorites((prev) => {
      const copy = { ...prev };
      if (copy[id]) delete copy[id];
      else copy[id] = true;
      return copy;
    });
  }

  function handleConsult(id: number) {
    // Navigate to CER detail page
    navigate(`/cers/${id}`);
  }

  function editCER(id: number) {
    alert(`Fonction d'édition pour CER ${id} (à implémenter).`);
  }

  function deleteCER(id: number) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce CER ?")) return;
    setCerList((prev) => prev.filter((c) => c.id !== id));
  }

  // --- Filtering & Sorting (original logic preserved) ---
  const filtered = useMemo(() => {
    let list = [...cerList];

    // search by title / author / tags / category
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.author.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.domains.some((d) => d.toLowerCase().includes(q))
      );
    }

    // levels filter
    if (selectedLevels.length > 0) {
      list = list.filter((c) => selectedLevels.includes(c.level));
    }

    // domain filter
    if (selectedDomains.length > 0) {
      list = list.filter((c) =>
        c.domains.some((d) =>
          selectedDomains.some((sd) => d.toLowerCase().includes(sd.toLowerCase()))
        )
      );
    }

    // sort
    switch (sortBy) {
      case "recent":
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "ancien":
        list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "populaire":
        list.sort((a, b) => b.views - a.views);
        break;
      case "titre":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return list;
  }, [cerList, search, selectedLevels, selectedDomains, sortBy]);

  // pagination
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function changePage(p: number) {
    if (p < 1 || p > pageCount) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // --- Render ---
  return (
    <>
      <header className="relative">
        <Header />
      </header>
      <main className="bg-gray-100 text-gray-800 min-h-[80vh]">
        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* page header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Tous les CERs</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explorez notre collection complète de Comptes d'Expérience Réfléchie.
              Utilisez les filtres pour trouver exactement ce que vous cherchez.
            </p>
          </div>

          {/* filters + burger + sidebar */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* main filters */}
            <div className="flex-1">
              <div className="bg-white p-5 rounded-xl shadow-md">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg flex-1 min-w-[220px]">
                    <input
                      aria-label="Recherche"
                      type="search"
                      placeholder="Rechercher par titre, auteur ou mot-clé..."
                      className="bg-transparent outline-none flex-1 text-sm"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>

                  <label className="text-sm font-medium">Trier par :</label>
                  <select
                    id="sortFilter"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value as any);
                      setPage(1);
                    }}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="recent">Plus récent</option>
                    <option value="ancien">Plus ancien</option>
                    <option value="populaire">Plus populaire</option>
                    <option value="titre">Par titre</option>
                  </select>

                  {/* burger for sidebar on small screens */}
                  <button
                    onClick={toggleSidebar}
                    className="ml-auto lg:hidden p-2 rounded-md bg-yellow-400 text-black"
                    aria-label="Afficher/masquer filtres"
                  >
                    <div className="space-y-1">
                      <span className="block w-5 h-0.5 bg-black" />
                      <span className="block w-5 h-0.5 bg-black" />
                      <span className="block w-5 h-0.5 bg-black" />
                    </div>
                  </button>
                </div>
              </div>

              {/* cer grid */}
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                  <p className="mt-4 text-gray-600">Chargement des CERs...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6" id="cer-grid">
                  {current.map((cer) => (
                    <article
                      key={cer.id}
                      className="cer-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
                    >
                      <img
                        src={cer.image}
                        alt={cer.title}
                        className="w-full h-44 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-yellow-500 font-semibold">{cer.author}</p>
                          <span className="text-xs text-gray-500">{cer.date}</span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{cer.title}</h3>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-3" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                          {cer.description}
                        </p>

                        <div className="flex gap-2 mb-3">
                          {cer.domains.map((d, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
                              {d}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConsult(cer.id)}
                            className="flex-1 consult-btn bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-md font-semibold"
                          >
                            Consulter
                          </button>

                          <button
                            onClick={() => handleFavorite(cer.id)}
                            className={`px-3 py-2 rounded-md border font-medium ${
                              favorites[cer.id]
                                ? "bg-yellow-400 text-white border-yellow-400"
                                : "border-yellow-400 text-yellow-500"
                            }`}
                            aria-pressed={!!favorites[cer.id]}
                          >
                            {favorites[cer.id] ? "♥" : "♡"}
                          </button>

                          <button
                            onClick={() => editCER(cer.id)}
                            className="px-3 py-2 rounded-md border text-sm"
                          >
                            Éditer
                          </button>

                          <button
                            onClick={() => deleteCER(cer.id)}
                            className="px-3 py-2 rounded-md border text-sm text-red-600"
                          >
                            Suppr.
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}

                  {current.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-600">
                      Aucun résultat — essaie d'ajuster tes filtres.
                    </div>
                  )}
                </div>
              )}

              {/* pagination */}
              <div className="flex justify-center gap-3 mt-8">
                <button
                  onClick={() => changePage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-md border"
                >
                  Prev
                </button>

                {Array.from({ length: pageCount }).map((_, i) => {
                  const p = i + 1;
                  // show only some pages if many
                  if (pageCount > 7) {
                    if (p === 1 || p === pageCount || Math.abs(page - p) <= 1 || p === page - 2 || p === page + 2) {
                      return (
                        <button
                          key={p}
                          onClick={() => changePage(p)}
                          className={`px-3 py-1 rounded-full border ${p === page ? "bg-yellow-400 text-white" : ""}`}
                        >
                          {p}
                        </button>
                      );
                    }
                    if (p === 2 && page > 4) return <span key={"d1"} className="px-2">…</span>;
                    if (p === pageCount - 1 && page < pageCount - 3) return <span key={"d2"} className="px-2">…</span>;
                    return null;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => changePage(p)}
                      className={`px-3 py-1 rounded-full border ${p === page ? "bg-yellow-400 text-white" : ""}`}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => changePage(page + 1)}
                  disabled={page === pageCount}
                  className="px-3 py-1 rounded-md border"
                >
                  Next
                </button>
              </div>
            </div>

            {/* sidebar */}
            <aside
              className={`w-full lg:w-80 lg:flex-none transition-transform ${
                sidebarOpen ? "translate-x-0" : "translate-x-0 lg:translate-x-0"
              }`}
              aria-hidden={!sidebarOpen && false}
            >
              {/* On small screens, show/hide by state */}
              <div className={`side-bar ${sidebarOpen ? "" : "hidden lg:block"} bg-white p-5 rounded-xl shadow-md`}>
                <h3 className="text-lg font-semibold mb-3">Niveaux</h3>
                <div className="flex flex-col gap-2 mb-4">
                  {LEVELS.map((lvl) => (
                    <label key={lvl} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(lvl)}
                        onChange={() => toggleLevel(lvl)}
                        className="form-checkbox"
                      />
                      <span className="text-sm">{lvl}</span>
                    </label>
                  ))}
                </div>

                <h3 className="text-lg font-semibold mb-3">Domaine de spécialisation</h3>
                <div className="flex flex-col gap-2 mb-4">
                  {DOMAINS.map((dom) => (
                    <label key={dom} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedDomains.includes(dom)}
                        onChange={() => toggleDomain(dom)}
                        className="form-checkbox"
                      />
                      <span className="text-sm">{dom}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedLevels([]);
                      setSelectedDomains([]);
                      setSearch("");
                    }}
                    className="flex-1 px-3 py-2 rounded-md border"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                    }}
                    className="px-3 py-2 rounded-md bg-yellow-400 text-black"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <footer>
      <Footer />
      </footer>
    </>
  );
};

export default Cers;