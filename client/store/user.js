import axios from 'axios'
import history from '../history'
import { handleSignMessage } from './utils';

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const AUTHENTICATE_USER = 'AUTHENTICATE_USER'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})

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

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
