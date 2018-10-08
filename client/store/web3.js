import axios from 'axios'
import history from '../history'
import { handleSignMessage } from './utils';
import Web3 from 'web3';

/**
 * ACTION TYPES
 */
const SET_PROVIDER = 'SET_PROVIDER'
const SET_PUBLIC_ADDRESS = 'SET_PUBLIC_ADDRESS'

/**
 * INITIAL STATE
 */
const defaultWeb3 = {
  provider: {},
  publicAddress: {},
}

/**
 * ACTION CREATORS
 */
export const setProvider = provider => ({
  type: SET_PROVIDER,
  provider
})

export const setPublicAddress = publicAddress => ({
  type: SET_PUBLIC_ADDRESS,
  publicAddress
})

/**
 * THUNK CREATORS
 */
export const getProvider = () => async dispatch => {
  try {
    let web3 = null;
    if (!window.web3) {
      window.alert('Please install MetaMask first.');
      return;
    }
    if (!web3) {
      web3 = new Web3(window.web3.currentProvider);
    }
    const coinbase = await web3.eth.getCoinbase((err, coinbase) => {
      return coinbase || err;
    })
    if (!coinbase) {
      window.alert('Please activate MetaMask first.');
      return;
    }
    const publicAddress = coinbase;
    dispatch(setProvider(web3));
    dispatch(setPublicAddress(publicAddress));
    return { web3, publicAddress };
  } catch (err) {
    console.error(err)
  }
}


/**
 * REDUCER
 */
export default function(state = defaultWeb3, action) {
  switch (action.type) {

    case SET_PUBLIC_ADDRESS:
      return {...state, publicAddress: action.publicAddress };

    case SET_PROVIDER:
      return {...state, provider: action.provider };

    default:
      return state

  }
}
