import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getProductos = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/productos`, {headers:{'Cache-Control' : 'no-cache'}});// el header porque si no hubo cambios en el back no los va a mostrar.
        console.log(response.data.items);
        return response.data.items;
    } catch (error) {
        console.log("Error fetching productos: ", error);
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