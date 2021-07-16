import { CLEAR_SESSION, SET_SESSION } from '../constants/actionTypes'
import cognitoUtils from '../lib/cognitoUtils'

export const clearSession = () => ({
  type: CLEAR_SESSION
})

export function initSessionFromCallbackURI (callbackHref) {
  return function (dispatch) {
    return cognitoUtils.parseCognitoWebResponse(callbackHref)
      .then(() => cognitoUtils.getCognitoSession())
      .then((session) => {
        dispatch({ type: SET_SESSION, session })
      })
  }
}

export const setSession = session => ({
  type: SET_SESSION,
  session
})