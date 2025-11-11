
import "./CategoriaItem.css";
import { useNavigate } from 'react-router-dom';

const CategoriaItem = ({ categoria }) => {
  const navigate = useNavigate();

  if (!categoria) return null;

  const nombreCategoria = typeof categoria === 'string' ? categoria : (categoria.name || categoria.nombre);

  const handleClick = () => {
    navigate('/productos', { state: { categoriaSeleccionada: nombreCategoria } });
  };

  return (
    <div className="categoria-wrapper">
      <div className="categoria-box" onClick={handleClick}>
        <h1 className="categoria-texto">{nombreCategoria.toUpperCase()}</h1>
      </div>
    </div>
  );
};

export default CategoriaItem;