
import "./CategoriaItem.css";

const CategoriaItem = ({ categoria }) => {
  if (!categoria) return null;
  return (
    <div className="wrapper">
      <div className="image">
        <img src={categoria.imagen} alt={categoria.name || categoria.nombre} />
        <div className="content">
          <h1>{categoria.name || categoria.nombre}</h1>
        </div>
      </div>
    </div>
  );
};

export default CategoriaItem;