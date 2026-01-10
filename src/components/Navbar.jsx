import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

/**
 * Composant Navbar
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-primary text-white py-3 px-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Skills View Logo" className=" md:h-9 h-7 " />
        </Link>

        {/* Menu Toggle pour mobile */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links */}
        <ul className={`${
          isOpen ? 'flex' : 'hidden'
        } md:flex flex-col md:flex-row gap-8 absolute md:static top-13 left-0 right-0 bg-primary md:bg-transparent p-6 md:p-0 items-center md:align-baseline`}>
          <li className="hidden"><a href="#services" className="hover:opacity-80 transition">Fonctionnalité</a></li>
          <li className="hidden"><Link to='pricing' className="hover:opacity-80 transition">Tarifs</Link></li>
          <li className="hidden"><a href="#reviews" className="hover:opacity-80 transition">Témoignages</a></li>
          <li className="hidden"><a href="#contact" className="hover:opacity-80 transition">Contact</a></li>
          <li className="flex gap-2 hidden">
            <Link
              to="/login"
              className="bg-white text-primary px-4 py-1  rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              Connexion
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
