import { create_user_url, get_users_url } from './urls'
import { CredentialObject as credentialObject } from 'src/code/globalTypes';


type userObject = { 
    id?: number | undefined;
    name: string | undefined;
    email: string | undefined;
    password?: string | undefined;
    passwordRepeat?: string | undefined;
}


const createUser = function(user: userObject) {
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

const listUsers = function(credentials: credentialObject) {
    return fetch(get_users_url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + credentials.t
        }
    }).then((response) => {
        return response.json()
    }).catch((err) => console.log(err))
}

const getUser = function(userId: number, credentials: credentialObject) {
    return fetch(`${get_users_url}/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + credentials.t
        }
    }).then((response) => {
        return response.json()  
    }).catch((err) => console.log(err))

}

const removeUser = function(userId: number, credentials: credentialObject) {
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

const updateUser = function(user: userObject, credentials: credentialObject) {
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