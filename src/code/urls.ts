import { config } from './config';


export const server_url = config.local_server_url;

export const auth_signin_url = `${server_url}/auth/signin`;
export const auth_signout_url = `${server_url}/auth/signout`;

export const create_user_url = `${server_url}/api/users`;
export const get_users_url = `${server_url}/api/users`;

export const get_presets_url = `${server_url}/api/presets`;
export const upload_preset_url = `${server_url}/api/presets`;
export const edit_preset_url = `${server_url}/api/presets`;
export const delete_preset_url = `${server_url}/api/presets`;
export const create_preset_url = `${server_url}/api/new-preset`;
