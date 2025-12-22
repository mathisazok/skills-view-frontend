import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Layout component pour les pages avec Navbar et Footer
 * Évite la duplication de code dans App.jsx
 */
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="grow">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
