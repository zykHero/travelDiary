import axios from './http';


export type LoginReqParams ={
    username: string,
    password: string
    code?: string
}

export type AddFootMarkReqParams ={
    address: string[],
    notes: string,
    time: string
}

export type MapFootPonint = {
    address: string[],
    date: string,
    userID: string
}

export class HttpAPI {
    httpBaseHref = '/api';
    constructor() { }

    getPublicKey(): Promise<string>{
        return axios.get(`${this.httpBaseHref}/publicKey`).then(res=> res.data);
    }
    
    login(value: LoginReqParams) {
        return axios.post(`${this.httpBaseHref}/login`, value);
    }
    
    addFootMarkHttp(value: AddFootMarkReqParams) {
        return axios.post(`${this.httpBaseHref}/mapPointList/create`, value);
    }

    getFootMarkList() {
        return axios.get(`${this.httpBaseHref}/mapPointList/list`);
    }
}