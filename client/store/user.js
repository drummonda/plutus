import axios from 'axios'
import history from '../history'
const LS_KEY = 'mm-login:auth';

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const LOG_IN = 'LOG_IN'
const LOG_OUT = 'LOG_OUT'
const AUTHENTICATE_USER = 'AUTHENTICATE_USER'

/**
 * INITIAL STATE
 */
const defaultUser = {
  current: {},
  authToken: {},
  loggedIn: false,
}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
const authenticateUser = token => ({
  type: AUTHENTICATE_USER,
  token
})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (email, password, method) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {email, password})
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }

  try {
    dispatch(getUser(res.data))
    history.push('/home')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => dispatch => {
  try {
    localStorage.removeItem(LS_KEY)
    history.push('/')
    dispatch(removeUser())
  } catch (err) {
    console.error(err)
  }
}

export const login = auth => dispatch => {
  localStorage.setItem(LS_KEY, JSON.stringify(auth))
  dispatch(authenticateUser(auth))
  history.push('/home')
}

export const fetchUser = publicAddress => async dispatch => {
  try {
    const { data } = await axios.get(`/api/users?publicAddress=${publicAddress}`);
    if(data.length) {
      const user = data[0];
      dispatch(getUser(user));
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
  }
}

export const postUser = publicAddress => async dispatch => {
  try {
    const { data } = await axios.post('/api/users', { publicAddress: publicAddress });
    console.log("this is data", data);
    dispatch(getUser(data));
    return data;
  } catch (err) {
    console.error(err);
  }
}

export const handleAuthenticate = signed => async dispatch => {
  try {
    const { publicAddress, signature } = signed;
    const { data: { accessToken }} = await axios.post('/auth/web3', { publicAddress, signature });
    dispatch(authenticateUser(accessToken));
    return accessToken
  } catch (err) {
    window.alert('Authentication failed!')
    console.error(err);
  }
}

export const fetchAuthToken = () => dispatch => {
  const authToken = localStorage.getItem(LS_KEY);
  if(!authToken) {
    return
  } else {
    dispatch(authenticateUser(authToken));
  }
}

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {

    case GET_USER:
      return {...state, current: action.user};

    case REMOVE_USER:
      return defaultUser

    case AUTHENTICATE_USER:
      return {...state, authToken: action.token, loggedIn: true};

    default:
      return state
  }
}
