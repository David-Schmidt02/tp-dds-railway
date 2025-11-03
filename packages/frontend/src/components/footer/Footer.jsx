import "./Footer.css"
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';



function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Columna 1 */}
        <div className="footer-section">
          <h2 className="footer-title">Tienda Sol</h2>
          <p className="footer-text">
            Tu tienda online de moda. Descubrí las últimas tendencias en
            ropa, calzado y accesorios.
          </p>
        </div>

        {/* Columna 2 */}
        <div className="footer-section">
          <h3 className="footer-subtitle">Enlaces</h3>
          <ul className="footer-links">
            <li><a href="/">Inicio</a></li>
            <li><a href="/productos">Productos</a></li>
            <li><a href="/ofertas">Ofertas</a></li>
            <li><a href="/contacto">Contacto</a></li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div className="footer-section">
          <h3 className="footer-subtitle">Seguinos</h3>
          <div className="footer-icons">
            <a href="#"><InstagramIcon fontSize="large"/></a>
            <a href="#"><FacebookIcon fontSize="large"/></a>
            <a href="#"><XIcon fontSize="large" /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 Tienda Sol. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
