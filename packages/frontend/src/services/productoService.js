import {productosItems} from "../mockData/mockDataProductos"
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getProductos = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/productos`, {headers:{'Cache-Control' : 'no-cache'}});// el header porque si no hubo cambios en el back no los va a mostrar.
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("Error fetching productos: ", error);
        throw error;
    }
}