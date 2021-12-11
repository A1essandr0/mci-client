import { create_user_url, get_users_url } from './urls'


const createUser = function(user: any) {
    return fetch(create_user_url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then((response) => {
        return response.json()
    }).catch((err) => console.log(err));
}

const listUsers = function(credentials: any) {
    return fetch(get_users_url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + credentials.t
        }
    }).then((response) => {
        return response.json()
    }).catch((err) => console.log(err))
}

const getUser = function(userId: number, credentials: any) {
    return fetch(`${get_users_url}/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + credentials.t
        }
    }).then((response) => {
        return response.json()  
    }).catch((err) => console.log(err))

}

const removeUser = function(userId: number, credentials: any) {
    return fetch(`${get_users_url}/${userId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        }
    }).then((response) => {
        return response.json()  
    }).catch((err) => console.log(err))
}

const updateUser = function(user: any, credentials: any) {
    return fetch(`${get_users_url}/${user.id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(user)
    }).then((response) => {
        return response.json()  
    }).catch((err) => console.log(err))
}

export { createUser, listUsers, getUser, updateUser, removeUser }