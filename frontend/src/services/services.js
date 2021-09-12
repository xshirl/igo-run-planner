import axios from 'axios';
import { BACKEND } from '../configs/config';

// // Check for authorization error
// axios.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     if (error.response) {
//       error.payload = error.response.data;
//       if (error.response.status === 401) {
//         // Automatically redirect client to the login page
//         window.location.href = `${AUTH_URL}/${HOME_PAGE_PATH}`;
//       }
//     }
//     // Do something with response error
//     return Promise.reject(error);
//   }
// );

const parseResp = (resp) => {
  const data = resp.data || {};
  const contents = data.data || {};
  return contents;
};

export function getRuns() {
  return axios
    .get(`${BACKEND}/api/runs/runs`)
    .then(parseResp)
    .catch((error) => {
      console.error('Unable to get Get Runs: ' + error.message);
    });
}

export function getPooledRuns() {
  return axios
    .get(`${BACKEND}/api/pools/pools`)
    .then(parseResp)
    .catch((error) => {
      console.log('Unable to get pooled runs' + error.message);
    });
}

export function getRemaining() {
  return axios
    .get(`${BACKEND}/api/rem/rem`)
    .then(parseResp)
    .catch((error) => {
      console.log('Unable to get remaining samples' + error.message);
    });
}


export function getLanes() {
  return axios
    .get(`${BACKEND}/api/lanes/lanes`)
    .then(parseResp)
    .catch((error) => {
      console.log('Unable to get lanes' + error.message);
    });
}