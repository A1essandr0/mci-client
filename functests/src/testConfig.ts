import { server_url } from  '../../src/code/urls';

let [_, host, port] = server_url.split(':');

const tConfig = {
    fixturesDir: "./functests/fixtures",
    server_host: host.slice(2),
    server_port: port,

    testUserName: 'Tester',
    testUserEmail: 'tester@tester.com',
    testUserPassword: '2wsxzse4',

}


export default tConfig;
