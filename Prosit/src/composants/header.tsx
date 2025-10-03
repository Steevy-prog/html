import { useState } from "react";
import Logo from '../assets/logo.png';
import { Link } from "react-router-dom";


export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white/90 backdrop-blur-sm shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-3">
          <img src={Logo} alt="Archiva logo" className="w-10 h-10 object-contain" />
          <span className="hidden sm:inline-block text-xl font-semibold text-slate-800">Archiva</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6 text-slate-700">
            <li><Link className="px-3 py-2 text-gray-500 rounded-md hover:bg-slate-100 hover:text-gray-800 transition" to="/">Accueil</Link></li>
            <li><Link className="px-3 py-2 text-gray-500 rounded-md hover:bg-slate-100 hover:text-gray-800 transition" to="/cers">Explorer les CERs</Link></li>
            <li><Link className="px-3 py-2 text-gray-500 rounded-md hover:bg-slate-100 hover:text-gray-800 transition" to="/favoris">Mes Favoris</Link></li>
            <li><Link className="px-3 py-2 text-gray-500 rounded-md hover:bg-slate-100 hover:text-gray-800 transition" to="/dashboard">Mon Dashboard</Link></li>
          </ul>
        </nav>

        
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/connexion"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm transition"
          >
            Connexion
          </Link>
        </div>

        
        <button
          className="md:hidden p-2 rounded-md text-slate-700"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-label="Ouvrir le menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

     
      <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 pb-6 flex flex-col gap-3">
          <nav>
            <ul className="flex flex-col gap-2">
              <li><Link onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-100" to="/">Accueil</Link></li>
              <li><Link onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-100" to="/cers">Explorer les CERs</Link></li>
              <li><Link onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-100" to="/favoris">Mes Favoris</Link></li>
              <li><Link onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-100" to="/dashboard">Mon Dashboard</Link></li>
            </ul>
          </nav>

          <Link
            onClick={() => setOpen(false)}
            to="/connexion"
            className="inline-block px-4 py-2 bg-[#e6930a]-500 hover:bg-orange-600 hover:text-white-500 rounded-md text-center"
          >
            Connexion
          </Link>
        </div>
      </div>
    </header>
  );
}
