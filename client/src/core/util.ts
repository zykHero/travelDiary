import JSEncrypt from 'jsencrypt';


export class RSA {
    constructor() {

    }

    encryption(pwd: string, pubKey: string):string|boolean{
        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(pubKey);
        return encryptor.encrypt(pwd)
    }
}