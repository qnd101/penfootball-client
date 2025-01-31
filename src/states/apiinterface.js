import config from "config.js";

let token = ""

export function setToken (newtoken) {
    token = newtoken
}

export function getToken (){
    return token
}

export async function postLogin (username, password) {
    const payload = {
        username,
        password
      };
  
    return fetch(config.LOGIN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
}

export async function postSignup (username, password) {
  const payload = {
      username,
      password
    };

  return fetch(config.SIGNUP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
}

export async function getMyData () {
  return fetch(config.MYDATA_ENDPOINT, {
    method: 'GET', 
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export async function viewData(id) {
  return fetch(config.VIEWDATA_ENDPOINT+`?id=${id}`, {
    method: 'GET'
  })
}

export async function emailAuth(email) {
  return fetch(config.EMAILAUTH_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(email)
  })
}