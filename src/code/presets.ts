import { get_presets_url, upload_preset_url, delete_preset_url } from './urls';


const getPresets = function() {
    // TODO приватные пресеты
    return fetch(get_presets_url, {
        method: 'GET'
    }).then(response => { return response.json() }
    ).catch((err) => console.log(err));
}



const uploadPreset = () => {}


const deletePreset = () => {}


export { getPresets, uploadPreset, deletePreset }