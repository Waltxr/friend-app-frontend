import { normalize } from 'normalizr'
import {userSchema} from './schema'
import {grievanceSchema} from './grievanceSchema'
import {commentSchema} from './commentSchema'
import { API_URL } from './apiUrl'
import * as types from './actionTypes'

const group = (groupObject) => {
  return {
    type: types.SET_GROUP,
    group: groupObject
  }
}

const setGroups = groupsObject => {
  return {
    type: types.GET_GROUPS,
    groups: groupsObject
  }
}

const authRequest = () => {
  return {
    type: types.AUTHENTICATION_REQUEST
  }
}

const authSuccess = (userObject, token) => {
  return {
    type: types.AUTHENTICATION_SUCCESS,
    user: userObject,
    token: token
  }
}

const authFailure = (errors) => {
  return {
    type: types.AUTHENTICATION_FAILURE,
    errors: errors
  }
}

const addGrievance = (grievance) => {
  return {
    type: types.FILE_GRIEVANCE,
    grievance: grievance
  }
}

const resetForm = () => {
  return {
    type: types.RESET_FORM
  }
}

const addComment = (comment) => {
  return {
    type: types.ADD_COMMENT,
    comment: comment
  }
}

const joinGroup = (group) => {
  return {
    type: types.JOIN_GROUP,
    group: group
  }
}

const leaveGroup = (group) => {
  return {
    type: types.LEAVE_GROUP,
    group: group
  }
}

export const joinGroupButton = group => {
  return dispatch => {
    return fetch(`${API_URL}/groups/join/${group.id}`, {
      method: 'POST',
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.token}`
      }),
      body: JSON.stringify(group)
    })
    .then(response => response.json())
    .then(res => {
      console.log(res);
      dispatch(joinGroup(res))
    })
  }
}

export const leaveGroupButton = group => {
  return dispatch => {
    return fetch(`${API_URL}/groups/leave/${group.id}`, {
      method: 'POST',
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.token}`
      }),
      body: JSON.stringify(group)
    })
    .then(response => response.json())
    .then(res => {
      dispatch(leaveGroup(res))
    })
  }
}

export const logout = () => {
  return dispatch => {
    localStorage.clear();
    return dispatch({
      type: types.LOGOUT
    });
  }
}

export const setGroup = groupObject => {
  return dispatch => {
    dispatch(group(groupObject))
  }
}

export const getGroups = () => {
  return dispatch => {
    return fetch(`${API_URL}/groups`, {
      method: 'GET',
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.token}`,
      })
    })
    .then(response => response.json())
    .then(groups => {
      dispatch(setGroups(groups))
    })
  }
}

export const signup = (new_user) => {
  return dispatch => {
    return fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Accept":"application/json",
        "Content-Type":"application/json"
      },
      body: JSON.stringify(new_user)
    })
      .then(response => response.json())
      .then(response => {
        const token = response.auth_token;
        localStorage.setItem('token', token);
        const user = response.user
        localStorage.setItem('user', user)
        dispatch(authSuccess(user, token))
      })
      .catch((errors) => {
        dispatch(authFailure(errors))
      })
  }
}

export const authenticate = (credentials) => {
  return dispatch => {
    dispatch(authRequest())
    return fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
      })
      .then(res => {
        if (!res.ok) {throw res}
        return res.json()
      })
      .then((response) => {
        const token = response.auth_token
        localStorage.setItem('token', token)
        return getUser(credentials)
      })
      .then((userObject) => {
        dispatch(authSuccess(userObject, localStorage.token))
      })
      .catch((errors) => {
        return errors.json()
        .then((res) => {
          dispatch(authFailure(res))
          localStorage.clear()
        })
      })
  }
}

export const getUser = (credentials) => {
  const request = new Request(`${API_URL}/users/user`, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.token}`,
    })
  })
  return fetch(request)
    .then(response => {
      return response.json()
    })
    .then(userJson => {
      return normalize(userJson, userSchema)
    })
    .catch(error => {
      return error
    })
}


export const fileGrievance = (grievance) => {
  return (dispatch) => {
    return fetch(`${API_URL}/grievances`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({grievance: grievance})
    })
    .then(response => response.json())
    .then(grievance => {
      // dispatch(addGrievance(normalize(grievance, grievanceSchema)))
      dispatch(addGrievance(grievance))
      dispatch(resetForm())
    })
    .catch(error => console.log(error))
  }
}

// export const postGrievanceComment = (comment, grievance) => {
//   return (dispatch) => {
//     return fetch(`${API_URL}/grievances/${grievance.id}/comments`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${localStorage.token}`,
//       },
//       body: JSON.stringify({comment: comment})
//     })
//     .then(response => response.json())
//     .then(comment => {
//       dispatch(addComment(normalize(comment, commentSchema)))
//       dispatch(resetForm())
//     })
//   }
// }

// export const postReplyComment = (comment, replyingTo) => {
//   return (dispatch) => {
//     return fetch(`${API_URL}/comments/${replyingTo.id}/comments`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${localStorage.token}`,
//       },
//       body: JSON.stringify({comment: comment})
//     })
//     .then(response => response.json())
//     .then(comment => {
//       dispatch(addComment(normalize(comment, commentSchema)))
//       dispatch(resetForm())
//     })
//   }
// }

export const postReplyComment = (comment, replyingTo) => {
  return (dispatch) => {
    return fetch(`${API_URL}/comments/${replyingTo.id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({comment: comment})
    })
    .then(response => response.json())
    .then(comment => {
      dispatch(addComment(normalize(comment, commentSchema)))
      dispatch(resetForm())
    })
  }
}

export const createGroup = (group) => {
  return (dispatch) => {
    return fetch(`${API_URL}/groups/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.token}`
      },
      body: JSON.stringify({group: group})
    })
    .then(response => response.json())
    .then(res => (console.log(res)))
  }
}
