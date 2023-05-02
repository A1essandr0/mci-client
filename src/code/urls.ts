import { config } from './config';


let default_server_url = config.local_backend_server_url;
if (config.mode === 'production') default_server_url = config.production_backend_server_url;

export const server_url = default_server_url;

export const auth_signin_url = `${server_url}/auth/signin`;
export const auth_signout_url = `${server_url}/auth/signout`;

export const create_user_url = `${server_url}/api/users`;
export const get_users_url = `${server_url}/api/users`;

export const make_preset_url = `${server_url}/api/make-new-preset`;
export const get_presets_url = `${server_url}/api/presets`;
export const edit_preset_url = `${server_url}/api/presets`;
export const delete_preset_url = `${server_url}/api/presets`;

