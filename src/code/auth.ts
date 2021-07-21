import { auth_signin_url, auth_signout_url } from './urls';


const auth = {
    authenticate: function(jwt, callback: Function) {
        if (typeof window !== "undefined")
            localStorage.setItem('jwt', JSON.stringify(jwt));

        callback();
    },

    isAuthenticated: function() {
        if (typeof window == "undefined") return false;
        if (localStorage.getItem('jwt'))
            return JSON.parse(localStorage.getItem('jwt'))
        else
            return false;
    },

    signOut: function(callback: Function) {
        if(typeof window !== "undefined")
            localStorage.removeItem('jwt');

        callback();
        signoutRequest().then((data) => {
            document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        })
    }
}


const signinRequest = function(user) {
    return fetch(auth_signin_url, {
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


const signoutRequest = function() {
    return fetch(auth_signout_url, {
        method: 'GET',
    }).then(response => {
        return response.json()
    }).catch((err) => console.log(err));
}


export { signinRequest, signoutRequest, auth}