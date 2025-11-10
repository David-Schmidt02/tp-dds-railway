import React, { useState } from 'react';

const categorias = [
    'Electrónica',
    'Ropa',
    'Hogar',
    'Libros',
    'Juguetes',
];

const precios = [
    { label: 'Menos de $1000', value: 'menos-1000' },
    { label: '$1000 - $5000', value: '1000-5000' },
    { label: 'Más de $5000', value: 'mas-5000' },
];

function ProductosFiltros({ onFiltrar }) {
    const [categoria, setCategoria] = useState('');
    const [precio, setPrecio] = useState('');

    const handleFiltrar = () => {
        onFiltrar({ categoria, precio });
    };

    return (
        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
            <h3>Filtrar productos</h3>
            <div>
                <label>
                    Categoría:
                    <select
                        value={categoria}
                        onChange={e => setCategoria(e.target.value)}
                        style={{ marginLeft: 8 }}
                    >
                        <option value="">Todas</option>
                        {categorias.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div style={{ marginTop: 12 }}>
                <label>
                    Precio:
                    <select
                        value={precio}
                        onChange={e => setPrecio(e.target.value)}
                        style={{ marginLeft: 8 }}
                    >
                        <option value="">Todos</option>
                        {precios.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </label>
            </div>
            <button
                style={{ marginTop: 16 }}
                onClick={handleFiltrar}
            >
                Aplicar filtros
            </button>
        </div>
    );
}

export default ProductosFiltros