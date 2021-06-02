import { create_user_url, get_users_url } from './urls'


const createUser = function(user) {
    return fetch(create_user_url, {
        mode: 'cors', // UNSAFE, development mode only!
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

const listUsers = function() {
    return fetch(get_users_url, {
        method: 'GET',
    }).then((response) => {
        return response.json()
    }).catch((err) => console.log(err))
}

const getUser = function(userId: number) {
    return fetch(`${get_users_url}/${userId}`, {
        method: 'GET',
    }).then((response) => {
        return response.json()  
    }).catch((err) => console.log(err))

}

const removeUser = function(userId: number, credentials) {
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

const updateUser = function(user, credentials) {
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