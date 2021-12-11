import { 
    get_presets_url, make_preset_url, delete_preset_url, edit_preset_url 
} from './urls';


const getPresets = function(userId: string) {
    return fetch(get_presets_url, {
        method: 'GET',
        headers: {
            'userid': userId
        }
    }).then(response => { return response.json() }
    ).catch((err) => console.log(err));
}

const makePreset = function(formContent: any, formFiles: any, credentials: any) {
    // data has to be sent as FormData object
    let presetAsForm = new FormData();
    
    for (let key of Object.keys(formFiles)) {
        presetAsForm.set(key, formFiles[key]);
    }

    for (let key of Object.keys(formContent)) {
        if (key === 'types' || key === 'texts') 
            presetAsForm.set(key, JSON.stringify(formContent[key]))
        else
            presetAsForm.set(key, formContent[key])
    }
        
    return fetch(make_preset_url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + credentials.t,
        },
        body: presetAsForm
    }).then(response => { return response.json() }
    ).catch((err) => console.log(err))
}

const editPreset = function(presetId: number, modifiedAttributes: any, credentials: any) {
    return fetch(`${edit_preset_url}/${presetId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(modifiedAttributes)
    }).then((response) => {
        return response.json()  
    }).catch((err) => console.log(err))
}

const deletePreset = function(presetId: number, credentials: any) {
    return fetch(`${delete_preset_url}/${presetId}`, {
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


export { getPresets, makePreset, editPreset, deletePreset }