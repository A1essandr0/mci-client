import { server_url } from  '../../src/code/urls';

let [protocol, host, port] = server_url.split(':');

const tConfig = {
    fixturesDir: "./functests/fixtures",
    server_host: `${protocol}:${host}`,
    server_port: port,

    testUserName: 'Tester',
    testUserEmail: 'tester@tester.com',
    testUserPassword: '2wsxzse4',

}


export default tConfig;
