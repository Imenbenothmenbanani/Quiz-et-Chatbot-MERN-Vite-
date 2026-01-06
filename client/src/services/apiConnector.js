import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true, // ✅ pour que les cookies passent
});

export const apiConnector = async (method, url, bodyData, headers, params) => {
  return await axiosInstance({
    method: method,
    url: url,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};
