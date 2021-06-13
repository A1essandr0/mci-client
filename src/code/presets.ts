import { get_presets_url, upload_preset_url, delete_preset_url, create_preset_url } from './urls';


const getPresets = function(userId) {
    return fetch(get_presets_url, {
        method: 'GET',
        headers: {
            'userid': userId
        }
    }).then(response => { return response.json() }
    ).catch((err) => console.log(err));
}

const createPreset = function(newPreset, credentials) {
    return fetch(create_preset_url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(newPreset)
    }).then(response => { return response.json() }
    ).catch((err) => console.log(err))
}

const uploadPreset = function(uploadedPreset, uploadedPresetFiles, uploadedBackFiles, credentials) {
    // data has to be sent as FormData object
    let uploadedPresetFinal = uploadedPresetFiles;
    for (let [key, value] of Object.entries(uploadedPreset))
        uploadedPresetFinal.set(key, value)
    
    for (let [key, value] of uploadedBackFiles.entries()) 
        uploadedPresetFinal.set(key, value)


    return fetch(upload_preset_url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + credentials.t,
        },
        body: uploadedPresetFinal
    }).then(response => { return response.json() }
    ).catch((err) => console.log(err))
}





const deletePreset = function(presetId: number, credentials) {


}


export { getPresets, createPreset, uploadPreset, deletePreset }