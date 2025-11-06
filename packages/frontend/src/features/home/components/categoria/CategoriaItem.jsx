
import "./CategoriaItem.css";

const CategoriaItem = ({ categoria }) => {
  if (!categoria) return null;
  return (
    <div className="categoria-wrapper">
      <div className="image">
        <img src={categoria.imagen} alt={categoria.name || categoria.nombre} />
        <div className="content-categoria">
          <h1>{categoria.name || categoria.nombre}</h1>
        </div>
      </div>
    </div>
  );
};

export default CategoriaItem;