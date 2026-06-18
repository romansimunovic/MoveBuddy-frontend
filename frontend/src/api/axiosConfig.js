import axios from 'axios';

// NAPOMENA: Ako testiraš na pravom mobitelu, zamijeni 'localhost' sa svojom lokalnom IP adresom (npr. 192.168.x.x)
const API = axios.create({
    baseURL: 'http://10.0.2.2:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Presretač koji prije svakog slanja zahtjeva provjerava imamo li spremljen token
API.interceptors.request.use(
    async (config) => {
        // Ovdje u pravoj aplikaciji povlačiš token iz AsyncStorage-a ili Context-a
        // Za testiranje, pretpostavljamo da je spremljen lokalno
        const token = global.userToken; 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;