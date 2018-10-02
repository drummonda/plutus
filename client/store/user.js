import axios from 'axios'
import history from '../history'

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
  authToken: {}
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

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

export const fetchUser = publicAddress => async dispatch => {
  try {
    const { data } = await axios.get(`/api/users?publicAddress=${publicAddress}`);
    if(data) {
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
    const user = data[0];
    dispatch(getUser(user));
    return user;
  } catch (err) {
    console.error(err);
  }
}

export const handleAuthenticate = signed => async dispatch => {
  try {
    const { publicAddress, signature } = signed;
    const { data } = await axios.post('/auth/web3', { publicAddress, signature });
    dispatch(authenticateUser(data));
  } catch (err) {
    window.alert('Authentication failed!')
    console.error(err);
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
      return {...state, authToken: action.token};

    default:
      return state
  }
}
