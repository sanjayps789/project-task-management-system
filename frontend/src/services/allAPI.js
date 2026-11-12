
import SERVER_URL from "./baseUrl";
import { commonAPI } from "./commonAPI";

// ================= AUTH SECTION =================
export const registerAPI = async (user) => {
    return await commonAPI(
        "POST",
        `${SERVER_URL}/auth/register`,
        user,
        ""
    );
};

export const loginAPI = async (user) => {
    return await commonAPI(
        "POST",
        `${SERVER_URL}/auth/login`,
        user,
        ""
    );
};


export const getDashboardAPI = async (reqHeader) => {
    return await commonAPI(
        "GET",
        `${SERVER_URL}/dashboard`,
        "",
        reqHeader
    );

}

// ================= USERS SECTION =================
export const getUsersAPI = (reqHeader) => {
    return commonAPI("GET", `${SERVER_URL}/users`, "", reqHeader);
};



// ================= PROJECTS SECTION =================
const buildQuery = (params = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, value);
        }
    });

    const queryString = query.toString();
    return queryString ? `?${queryString}` : "";
};

export const getProjectsAPI = (params, reqHeader) => {
    return commonAPI("GET", `${SERVER_URL}/projects${buildQuery(params)}`, "", reqHeader);
};

export const getProjectAPI = (id, reqHeader) => {
    return commonAPI("GET", `${SERVER_URL}/projects/${id}`, "", reqHeader);
};

export const createProjectAPI = (reqBody, reqHeader) => {
    return commonAPI("POST", `${SERVER_URL}/projects`, reqBody, reqHeader);
};

export const updateProjectAPI = (id, reqBody, reqHeader) => {
    return commonAPI("PUT", `${SERVER_URL}/projects/${id}`, reqBody, reqHeader);
};

export const deleteProjectAPI = (id, reqHeader) => {
    return commonAPI("DELETE", `${SERVER_URL}/projects/${id}`, "", reqHeader);
};



// ================= TASKS SECTION =================

export const getTasksAPI = (params, reqHeader) => {
    return commonAPI("GET", `${SERVER_URL}/tasks${buildQuery(params)}`, "", reqHeader);
};

export const createTaskAPI = (reqBody, reqHeader) => {
    return commonAPI("POST", `${SERVER_URL}/tasks`, reqBody, reqHeader);
};

export const updateTaskAPI = (id, reqBody, reqHeader) => {
    return commonAPI("PUT", `${SERVER_URL}/tasks/${id}`, reqBody, reqHeader);
};

export const getTaskAPI = (id, reqHeader) => {
    return commonAPI("GET", `${SERVER_URL}/tasks/${id}`, "", reqHeader);
};

export const updateTaskStatusAPI = (id, status, reqHeader) => {
    return commonAPI("PATCH", `${SERVER_URL}/tasks/${id}/status`, { status }, reqHeader);
};

export const deleteTaskAPI = (id, reqHeader) => {
    return commonAPI("DELETE", `${SERVER_URL}/tasks/${id}`, "", reqHeader);
};


