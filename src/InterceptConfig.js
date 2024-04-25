import axios from 'axios';

const isValidToken = () => {
  const accessToken = localStorage.getItem('accessToken');
  const tokenExpiresIn = localStorage.getItem('tokenExpiresIn');
  if (!accessToken || !tokenExpiresIn) {
    return false;
  }
  const currentTime = new Date().getTime();
  return currentTime < Number(tokenExpiresIn);
};


/* fetch Interceptos */
const fetchWithAuth = async (url, options) => {
  try {
    if (isValidToken()) {
      const accessToken = localStorage.getItem('accessToken');
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      };
      const response = await fetch(url, { ...options, headers });
      console.log(">>>"+response.status)
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/Login'; 
        } else if (response.status === 403) {
          alert("권한이 없습니다.");
        } else {
          throw new Error('Request failed with status: ' + response.status);
        }
      }
      return response;
    } else {
       throw new Error ('Token is not valid');
    }
  } catch (error) {
    console.error("fetchWithAuth Error:", error);
    window.location.href = '/Login'; 
    throw error;
  }

};


/* axios Interceptors */
axios.interceptors.request.use(
  (config) => {
    if (isValidToken()) {
      const token = localStorage.getItem('accessToken');
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if(error.response.status === 401) window.location.href = '/Login'; 
      if(error.response.status === 403) alert("권한이 없습니다.")
    }
    return Promise.reject(error);
  }
);

export { fetchWithAuth, axios as default };