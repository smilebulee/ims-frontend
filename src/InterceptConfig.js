import axios from 'axios';

const {fetch : orgFetch} = window;

const hasToken = () => {
  if(!isValidToken()){
    window.location.href = '/login'; 
  }
};


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
const fetch = async (url, options) => {
  try {
    if (isValidToken()) {
      const accessToken = localStorage.getItem('accessToken');
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      };
      const response = await orgFetch(url, { ...options, headers });
      console.log(">>>"+response.status)
      if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiresIn');
          window.location.href = '/login'; 
        } else if (response.status === 403) {
          alert("권한이 없습니다.");
          window.location.href = '/login'; 
        } else {
          throw new Error('Request failed with status: ' + response.status);
        }
      }
      return response;
    } else 


    throw new Error ('Token is not valid');
    
  } catch (error) {
    console.error("fetchWithAuth Error:", error);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiresIn');
    window.location.href = '/login'; 
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
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiresIn');
      if(error.response.status === 401) window.location.href = '/login'; 
      if(error.response.status === 403) {
        alert("권한이 없습니다.");
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);


export { fetch, hasToken, axios as default };