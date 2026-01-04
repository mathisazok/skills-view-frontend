import React from 'react';
import { Link } from 'react-router-dom'; // only if you use React Router

/**
 * Composant Button réutilisable
 * @param {string} children - Texte du bouton
 * @param {boolean} primary - Style primaire ou secondaire
 * @param {function} onClick - Fonction au clic
 * @param {string} className - Classes CSS supplémentaires
 * @param {string} href - URL externe (navigue vers un lien)
 * @param {string} to - URL interne React Router (navigue sans reload)
 * @param {string} type - type du bouton (button, submit, reset)
 * @param {boolean} disabled - désactiver le bouton
 */
const Button = ({ children, primary = false, onClick, className = '', type = 'button', disabled = false, href, to }) => {
  const baseStyle = 'px-6 py-2 max-h-[60px] rounded-[16px] font-semibold transition-all duration-300 cursor-pointer';
  
  const primaryStyle = primary
    ? 'bg-primary text-white hover:bg-opacity-90 hover:shadow-lg'
    : 'bg-btn-secondary border-2 border-btn-secondary hover:border-primary hover:bg-primary hover:text-white';

  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const finalClass = `${baseStyle} ${primaryStyle} ${disabledStyle} ${className}`;

  if (href) {
    // External link
    return (
      <a href={href} className={finalClass} target='_blank' rel='noopener noreferrer'>
        {children}
      </a>
    );
  }

  if (to) {
    // Internal link (React Router)
    return (
      <Link to={to} className={finalClass}>
        {children}
      </Link>
    );
  }

  // Default button
  return (
    <button
      type={type}
      className={finalClass}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
