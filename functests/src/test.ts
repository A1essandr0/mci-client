const assert = require('assert');
const fs = require('fs');
const https = require('https');
import { describe, it } from 'mocha';
import tConfig from './testConfig';


describe('General CRUD test suite', function() {
    let requestOptions = {
        host: tConfig.server_host,
        port: Number(tConfig.server_port),
        path: '/',
        method: 'GET',
        headers: {},
        body: {},
        rejectUnauthorized: false,
    }

    before(function() {
        // console.log(requestOptions);
    })

    after(function() {
        // console.log(requestOptions);
    })


    it('#getting admin info', function() {
        requestOptions.path = '/api/users/1';
        let correct_req = https.request(requestOptions, (resp: any) => {
            let data = '';
            resp.on('data', (chunk: any) => data += chunk );

            resp.on('end', () => {
                assert.strictEqual(resp.statusCode, 200);
                assert.strictEqual(JSON.parse(data)['name'], 'admin');
            })
        });
        correct_req.end();

        requestOptions.path = '/api/users/0';
        let incorrect_req = https.request(requestOptions, (resp: any) => {
            let data = '';
            resp.on('data', (chunk: any) => data += chunk );

            resp.on('end', () => {
                assert.strictEqual(resp.statusCode, 404);
                assert.strictEqual(JSON.parse(data)['error'], 
                    'User with id=0 not found or database settings are invalid');
            })
        });
        incorrect_req.end();
    });


    let testUserId = 15;
    // it('#signing up', function() {
    //     const dataToSend = new TextEncoder().encode(
    //         JSON.stringify({
    //             name: tConfig.testUserName,
    //             email: tConfig.testUserEmail,
    //             password: tConfig.testUserPassword,
    //             passwordRepeat: tConfig.testUserPassword    
    //         })
    //     );
    //     requestOptions.headers = {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json',
    //         'Content-Length': dataToSend.length
    //     }
    //     requestOptions.path = '/api/users';
    //     requestOptions.method = 'POST';

    //     let signup_req = https.request(requestOptions, (resp: any) => {
    //         let data = '';
    //         resp.on('data', (chunk: any) => data += chunk );

    //         resp.on('end', () => {
    //             const parsedData = JSON.parse(data);
    //             assert.strictEqual(resp.statusCode, 200);
    //             assert.strictEqual(parsedData['message'], "User created");
    //             assert.strictEqual(parsedData['name'], tConfig.testUserName);
    //             testUserId = parsedData['id'];
    //             // console.log(parsedData);
    //         })
    //     })
    //     signup_req.write(dataToSend);
    //     signup_req.end();
    // })


    let testUserToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImlzX2FkbWluIjowLCJpYXQiOjE2MzMzNzQ1NzV9._IWlP84U32QF5wiEwUeSQkVqj9g5ykL7Q66YO6G4hBA';
    it('#signing in correctly', function() {
        const dataToSend = new TextEncoder().encode(
            JSON.stringify({
                email: tConfig.testUserEmail,
                password: tConfig.testUserPassword,
            })
        );
        requestOptions.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': dataToSend.length
        }        
        requestOptions.path = '/auth/signin';
        requestOptions.method = 'POST';
        const signin_req = https.request(requestOptions, (resp: any) => {
            let data = '';
            resp.on('data', (chunk: any) => data += chunk );

            resp.on('end', () => {
                const parsedData = JSON.parse(data);
                assert.strictEqual(resp.statusCode, 200);
                assert.strictEqual(parsedData['user']['id'], testUserId)
                testUserToken = parsedData['token']
                console.log('token 2: ', testUserToken);
            })
        })
        signin_req.write(dataToSend);
        signin_req.end();
    })


    it('#signing in incorrectly', function() {
        const incorrectPwd = new TextEncoder().encode(
            JSON.stringify({
                email: tConfig.testUserEmail,
                password: 'incorrectPwd',
            })
        );
        requestOptions.path = '/auth/signin';
        requestOptions.method = 'POST';
        requestOptions.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': incorrectPwd.length
        };
        const incorrect_pwd_req = https.request(requestOptions, (resp: any) => {
            let data = '';
            resp.on('data', (chunk: any) => data += chunk );

            resp.on('end', () => {
                const parsedData = JSON.parse(data);
                assert.strictEqual(resp.statusCode, 401);
                assert.strictEqual(parsedData['error'], "Email and password don't match.")
            })
        })
        incorrect_pwd_req.write(incorrectPwd);
        incorrect_pwd_req.end();


        const incorrectEmail = new TextEncoder().encode(
            JSON.stringify({
                email: 'tester@tester.tr',
                password: tConfig.testUserPassword,
            })
        );
        requestOptions.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': incorrectEmail.length
        };
        const incorrect_email_req = https.request(requestOptions, (resp: any) => {
            let data = '';
            resp.on('data', (chunk: any) => data += chunk );

            resp.on('end', () => {
                const parsedData = JSON.parse(data);
                assert.strictEqual(resp.statusCode, 404);
                assert.strictEqual(parsedData['error'], "User with email tester@tester.tr was not found or database settings are invalid")
            })
        })
        incorrect_email_req.write(incorrectEmail);
        incorrect_email_req.end();
    })


    it('#editing user profile', function() {
        console.log("token 1: ", testUserToken);
        const dataToSend = new TextEncoder().encode(
            JSON.stringify({
                id: testUserId,
                name: 'Toadster',
                email: tConfig.testUserEmail
            })
        );
        requestOptions.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': dataToSend.length,
            'Authorization': 'Bearer ' + testUserToken
        }        
        requestOptions.path = `/api/users/${testUserId}`;
        requestOptions.method = 'PUT';
        const modifying_req = https.request(requestOptions, (resp: any) => {
            let data = '';
            resp.on('data', (chunk: any) => data += chunk );

            resp.on('end', () => {
                const parsedData = JSON.parse(data);
                assert.strictEqual(resp.statusCode, 200);
                assert.strictEqual(parsedData['name'][0]['name'], "Toadster")
            })
        })
        modifying_req.write(dataToSend);
        modifying_req.end();


        const wrongDataToSend = new TextEncoder().encode(
            JSON.stringify({
                id: 1,
                name: 'NotAdmin',
                email: 'notadmin@notadmin.com'
            })
        );
        requestOptions.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': wrongDataToSend.length,
            'Authorization': 'Bearer ' + testUserToken
        };
        requestOptions.path = '/api/users/1';
        requestOptions.method = 'PUT';
        const wrong_modifying_req = https.request(requestOptions, (resp: any) => {
            let data = '';
            resp.on('data', (chunk: any) => data += chunk );

            resp.on('end', () => {
                const parsedData = JSON.parse(data);
                assert.strictEqual(resp.statusCode, 401);
                assert.strictEqual(parsedData['error'], "not authorized")
            })
        })
        wrong_modifying_req.write(wrongDataToSend);
        wrong_modifying_req.end();
    });


    // it('#uploading preset', function() {
    //     assert.strictEqual(1, 0)
    // });


    // it('#creating preset', function() {
    //     assert.strictEqual(1, 0)
    // });


    // it('#managing preset permissions', function() {
    //     assert.strictEqual(1, 0)
    // });

    // it('#deleting preset', function() {
    //     assert.strictEqual(1, 0)
    // });


    // it('#signing out', function() {
    //     assert.strictEqual(1, 0)
    // });


    // it('#deleting user', function() {
    //     assert.strictEqual(1, 0)
    // });

})

