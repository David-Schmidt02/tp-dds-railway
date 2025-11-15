import './ColumnaFotos.css'
const ColumnaFotos = ({ fotos, fotoprincipal, setFotoprincipal, item }) => {
  return (
    <div className="seccion-imagen">
      <div className="columna-miniaturas" role="tablist" aria-label="Miniaturas">
        {fotos.map((foto, index) => (
              <button
                key={index} 
                className={`minuatura-btn ${foto == fotoprincipal ? 'minuatoria-activa' : ''}`}
                onClick={() => setFotoprincipal(foto)}
                aria-label={`Ver foto ${index + 1}`}
                type="button"
              >
                <img 
                  src={foto} 
                  alt={`${item.titulo} ${index + 1}`} 
                  className="minuatura-img" 
                />
              </button>
            ))}
          </div>

      {/* Imagen principal */}
      <div className="contenedor-imagen-principal">
        <img
          src={fotoprincipal }
          alt={item.titulo}
          className="imagen-principal"
        />
      </div>
    </div>
  );
};

export default ColumnaFotos;