
const localhost_server_url = 'https://localhost:3003';
const azurevm_server_url = 'https://20.101.110.181:3003';


export const server_url = localhost_server_url;

export const auth_signin_url = `${server_url}/auth/signin`;
export const auth_signout_url = `${server_url}/auth/signout`;

export const create_user_url = `${server_url}/api/users`;
export const get_users_url = `${server_url}/api/users`;

export const get_presets_url = `${server_url}/api/presets`;
export const upload_preset_url = `${server_url}/api/presets`;
export const delete_preset_url = `${server_url}/api/presets`;
export const create_preset_url = `${server_url}/api/new-preset`;