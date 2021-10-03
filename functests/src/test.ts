const assert = require('assert');
const fs = require('fs');
import { describe, it } from 'mocha';
import tConfig from './testConfig';


describe('Stub test', function() {

    it('#stub one', function() {
        assert.strictEqual(2*2, 4);
    })
})



//// user and auth suite
// register user
// sign in
// sign out
// edit profile
// delete user



//// preset suite
// upload preset
// create preset
// edit/manage permissions
// delete preset