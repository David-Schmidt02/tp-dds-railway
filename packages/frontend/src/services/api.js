import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getProductos = async (filtros = {}) => {
    try {
        const params = {
            min: filtros.precioMin,
            max: filtros.precioMax,
            nombre: filtros.nombre,
            descripcion: filtros.descripcion,
            categorias: filtros.categorias,
            page: filtros.page,
            limit: filtros.limit,
            orden: filtros.ordenar,
            idVendedor: filtros.vendedores, // Cambiado de idVendedor a vendedores
            q: filtros.q
        };

        Object.keys(params).forEach(key => {
            if (params[key] === '' || params[key] === undefined || (Array.isArray(params[key]) && params[key].length === 0)) {
                delete params[key];
            }
        });
        
        const response = await axios.get(`${API_BASE_URL}/productos`, {
            params: params,
            headers:{'Cache-Control' : 'no-cache'},
            paramsSerializer: {
                indexes: null
            }
        });
        return response.data;
    } catch (error) {
        console.log("Error fetching productos: ", error);
        throw error;
    }
}

export const postUsuario = async (usuarioData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/usuarios`, usuarioData, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("Error creating usuario: ", error);
        throw error;
    }
}

export const getUsuarios = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/usuarios`, {headers:{'Cache-Control' : 'no-cache'}});
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("Error fetching usuarios: ", error);
        throw error;
    }
}

export const postPedido = async (pedidoData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/pedidos`, pedidoData, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("Error creating pedido: ", error);
        throw error;
    }
}

export const getVendedores = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/vendedores`, {
            headers: {'Cache-Control': 'no-cache'}
        });
        return response.data;
    } catch (error) {
        console.log("Error fetching vendedores: ", error);
        throw error;
    }
}

export const getCategorias = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/categorias`, {
            headers: {'Cache-Control': 'no-cache'}
        });
        return response.data;
    } catch (error) {
        console.log("Error fetching categorias: ", error);
        throw error;
    }
}

export const getProductoPorId = async (id) => {
    try {
        if (!id) {
            throw new Error('Se requiere un id de producto');
        }

        const response = await axios.get(`${API_BASE_URL}/productos/${id}`, {
            headers: { 'Cache-Control': 'no-cache' }
        });
        return response.data;
    } catch (error) {
        console.log(`Error fetching producto ${id}: `, error);
        throw error;
    }
}
