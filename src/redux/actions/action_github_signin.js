import axios from 'axios';

const CLIENT_ID = '32b70bf671e04762b26c';
const CLIENT_SECRET = '5851623d94887db7612d4c9bc689310b9d53284b';
const ROOT_URL = window.location.origin;
const REDIRECT_URL = `${ROOT_URL}/auth/callback`;
const AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_ACCESS_TOKEN_URL = window.location.origin + '/access_token';
console.log('GITHUB_ACCESS_TOKEN_URL', GITHUB_ACCESS_TOKEN_URL);

export const actionTypes = {
  SIGNIN: 'SIGNIN',
  SIGNIN_SUCCESS: 'SIGNIN_SUCCESS',
  SIGNIN_ERROR: 'SIGNIN_ERROR',
  SIGNIN_URL: 'SIGNIN_URL',
  SEND_CODE: 'SEND_CODE'
};

function signinRequest() {
  return {
    type: actionTypes.SIGNIN,
    payload: 'Github request sent'
  }
}

function signinUrl(payload) {
  return {
    type: actionTypes.SIGNIN_URL,
    payload
  }
}

function signinSuccess(payload) {
  window.localStorage.setItem('token', payload.access_token);
  return {
    type: actionTypes.SIGNIN_SUCCESS,
    payload
  }
}

function signinError(payload) {
  return {
    type: actionTypes.SIGNIN_ERROR,
    payload
  }
}

export function githubGeturi() {
  const GITHUB_URL = `${AUTHORIZE_URL}?client_id=${CLIENT_ID}`;

  return (dispatch) => dispatch(signinUrl(GITHUB_URL));
}

export function githubSendCode(code) {
  const GITHUB_URL = `${ACCESS_TOKEN_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`;

  const axiosPost = axios({
    url: GITHUB_ACCESS_TOKEN_URL,
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    responseType: 'json',
    data: {
      client_id: CLIENT_ID,
      code
    }
  });

  return (dispatch) => {
    dispatch(signinRequest());
    return axiosPost
      .then(
        success => dispatch(signinSuccess(success)),
        error => dispatch(signinError(error))
      );
  };
}
