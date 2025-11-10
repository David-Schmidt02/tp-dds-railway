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

function ProductosFiltros(filtros, handleFiltroChange) {
    const [vendedor, setCategoria] = useState('');
    const [precio, setPrecio] = useState('');
    const [vendedor, setVendedor] = useState('');

    return (
        
    );
}

export default ProductosFiltros