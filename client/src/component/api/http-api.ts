import axios from 'axios';

export type LoginReqParams ={
    name: string,
    pwd: string
    code?: string
}

export type AddFootMarkReqParams ={
    address: string[],
    notes: string,
    time: string
}

export class HttpAPI {
    constructor() { }

    getPublicKey() {
        return axios.get('');
    }
    
    login(value: LoginReqParams) {
        return axios.post('', value);
    }
    
    addFootMarkHttp(value: AddFootMarkReqParams) {
        return axios.post('', value);
    }
}