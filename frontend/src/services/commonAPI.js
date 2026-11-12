import axios from "axios";

export const commonAPI = async (httpRequest, url, reqBody, reqHeader) => {
    const reqConfig = {
        method: httpRequest,
        url,
        data: reqBody,
        headers: reqHeader
            ? reqHeader
            : { "Content-Type": "application/json" },
    };

    return await axios(reqConfig);
};


axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token/Data clear cheyyunnu
      localStorage.clear();
      sessionStorage.clear();
      
      // Ippo user login page-il allengil mathram redirect cheyyuka (Loop avoid cheyyan)
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);