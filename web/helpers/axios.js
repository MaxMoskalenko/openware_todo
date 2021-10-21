import axios from 'axios';
var port = 9001;
export const instance = () => {
    return axios.create({
        baseURL: location.protocol + '//' + location.hostname + ':' + port,
        withCredentials: false,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "access-control-allow-origin, access-control-allow-headers"
        }
    })
};