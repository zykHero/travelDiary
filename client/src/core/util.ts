import JSEncrypt from 'jsencrypt';
import { HttpAPI } from '../component/api/http-api'

export class RSA {
    constructor() {

    }

    async encryption(pwd: string) {
        const encryptor = new JSEncrypt();
        const pubKey = await this.getPubKey();
        encryptor.setPublicKey(pubKey);
        return encryptor.encrypt(pwd)
    }

    private getPubKey(): Promise<string> {
        return new Promise((resolve, reject) => {
            new HttpAPI().getPublicKey().then(res=> {
                resolve(res);
            }).catch(error => {
                resolve('');
            });
        });
    }
}