const crypto = require('crypto');
const GoogleAuthenticator = require('passport-2fa-totp').GoogeAuthenticator;
const totp = require("totp-generator");
const qr = require('qr-image');

function makeSalt() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
}
exports.makeSalt = makeSalt;

function hashPassword(rawPassword, salt){
    if (!rawPassword) return '';
    try{
        return crypto              //????
                .createHmac('sha1', salt)
                .update(rawPassword)
                .digest('hex'); 
    } catch (err) {
        console.error("Unable to hash data", err);
        return '';
    }
}
exports.hashPassword = hashPassword;

function generate2FaSecret(email) {
    return GoogleAuthenticator.register(email).secret;
}
exports.generate2FaSecret = generate2FaSecret;

function is2FAValidCode(secret, code) {
    try {
        let genCode = totp(secret); //????
        return (genCode==code);
    } catch (ex) {
        console.error("is2FAValidCode() return exception", ex);
    }
    return false;
}
exports.is2FAValidCode = is2FAValidCode;

function getF2AQrCode(email, secret) {
    var authUrl = `otpauth://totp/${email}?secret=${secret}`;
    var qrCode = qr.imageSync(authUrl, { type: 'svg' }); //?????
    return qrCode;
}
exports.getF2AQrCode = getF2AQrCode;