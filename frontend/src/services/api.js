import axios from "axios";

// Our FastAPI backend runs on 8001 now.
const API_URL = "http://127.0.0.1:8001/api";

export const uploadPolicy = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${API_URL}/policy/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const triggerScan = async () => {
    return axios.post(`${API_URL}/scan/trigger`);
};

export const fetchViolations = async () => {
    return axios.get(`${API_URL}/violations`);
};

export const resolveViolation = async (id, action) => {
    return axios.post(`${API_URL}/violations/${id}/resolve?action=${action}`);
};
