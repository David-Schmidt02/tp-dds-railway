
import React, { useEffect, useMemo, useState } from "react";
import "./ProductosFiltrados.css";
import { CircularProgress } from "@mui/material";
import { getProductos } from "../../services/productoService.js";
import Grid from "../../components/grid/grid.jsx";


import productosItem from "../../mockData/mockDataProductos.js";

const ProductosFiltrados = ({ actualizarCarrito }) => {
  const [productos, setProductos] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [busquedaDescripcion, setBusquedaDescripcion] = useState("");
  const [seleccionCategorias, setSeleccionCategorias] = useState(new Set());
  const [precioTope, setPrecioTope] = useState(0);
  const [orden, setOrden] = useState("priceAsc");

  const cargarProductos = async () => {

    if (true) {
      setProductos(productosItem);
      return;
    }
    const p = await getProductos();
    setProductos(p);
  };

  useEffect(() => {
    cargarProductos();
  }, []);


  const categorias = useMemo(() => {
    const set = new Set(productos.map((p) => p.categoria).filter(Boolean));
    return Array.from(set).sort();
  }, [productos]);


  const maxPrecio = useMemo(() => {
    if (!productos.length) return 0;
    return Math.ceil(Math.max(...productos.map((p) => Number(p.precio) || 0)));
  }, [productos]);

 
  useEffect(() => {
    if (maxPrecio) setPrecioTope(maxPrecio);
  }, [maxPrecio]);


  const toggleCategoria = (cat) => {
    const next = new Set(seleccionCategorias);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setSeleccionCategorias(next);
  };


  const productosFiltrados = useMemo(() => {
    let lista = productos.filter((p) => {
      const coincideNombre = p.nombre
        ?.toLowerCase()
        .includes(busquedaNombre.toLowerCase());
      const coincideDesc = p.descripcion
        ?.toLowerCase()
        .includes(busquedaDescripcion.toLowerCase());
      const coincidePrecio = (Number(p.precio) || 0) <= (Number(precioTope) || 0);
      const coincideCategoria =
        !seleccionCategorias.size || seleccionCategorias.has(p.categoria);

      return coincideNombre && coincideDesc && coincidePrecio && coincideCategoria;
    });

    switch (orden) {
      case "priceDesc":
        lista.sort((a, b) => (Number(b.precio) || 0) - (Number(a.precio) || 0));
        break;
      case "nameAsc":
        lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "nameDesc":
        lista.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      default: 
        lista.sort((a, b) => (Number(a.precio) || 0) - (Number(b.precio) || 0));
    }

    return lista;
  }, [
    productos,
    busquedaNombre,
    busquedaDescripcion,
    precioTope,
    seleccionCategorias,
    orden,
  ]);

  return (
    <>
      <div className="pf-wrapper">
        <aside className="pf-sidebar">
          <h3 className="pf-sidebar-title">Filtros</h3>

          <div className="pf-filter-block">
            <label className="pf-label">Por precio</label>
            <div className="pf-price-row">
              <input
                type="range"
                min="0"
                max={maxPrecio || 0}
                value={precioTope || 0}
                onChange={(e) => setPrecioTope(Number(e.target.value))}
              />
              <span className="pf-badge">${precioTope}</span>
            </div>
          </div>

          <div className="pf-filter-block">
            <label className="pf-label">Por nombre</label>
            <input
              className="pf-input"
              type="text"
              placeholder="Buscar nombre..."
              value={busquedaNombre}
              onChange={(e) => setBusquedaNombre(e.target.value)}
            />
          </div>

          <div className="pf-filter-block">
            <label className="pf-label">Por descripción</label>
            <input
              className="pf-input"
              type="text"
              placeholder="Palabras clave..."
              value={busquedaDescripcion}
              onChange={(e) => setBusquedaDescripcion(e.target.value)}
            />
          </div>

          {!!categorias.length && (
            <div className="pf-filter-block">
              <label className="pf-label">Por categoría</label>
              <ul className="pf-cats">
                {categorias.map((c) => (
                  <li key={c}>
                    <label className="pf-check">
                      <input
                        type="checkbox"
                        checked={seleccionCategorias.has(c)}
                        onChange={() => toggleCategoria(c)}
                      />
                      <span>{c}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            className="pf-clear"
            onClick={() => {
              setBusquedaNombre("");
              setBusquedaDescripcion("");
              setSeleccionCategorias(new Set());
              setPrecioTope(maxPrecio);
              setOrden("priceAsc");
            }}
          >
            Limpiar filtros
          </button>
        </aside>

        <main className="pf-content">
          <header className="pf-header">
            <h1 className="pf-title">Nuestros productos</h1>

            <div className="pf-sort">
              <label htmlFor="ordenar">Ordenar por</label>
              <select
                id="ordenar"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
              >
                <option value="priceAsc">Precio más bajo</option>
                <option value="priceDesc">Precio más alto</option>
                <option value="nameAsc">Nombre A-Z</option>
                <option value="nameDesc">Nombre Z-A</option>
              </select>
            </div>
          </header>

          {!productos.length ? (
            <div className="pf-spinner">
              <CircularProgress />
            </div>
          ) : productosFiltrados.length ? (
            <Grid
              productos={productosFiltrados}
              actualizarCarrito={actualizarCarrito}
            />
          ) : (
            <div className="pf-empty">
              <p>No encontramos resultados con los filtros aplicados.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ProductosFiltrados;
