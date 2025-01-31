import config from "config";

export const server_list = config.SRV_LIST;

function Serverinfo(idx){
    this.idx=idx;
    this.name=server_list[idx];
    this.signalR_endpoint=config[this.name].SIGNALR_ENDPOINT;
    this.summary_endpoint=config[this.name].SUMMARY_ENDPOINT;
}

let server = new Serverinfo(0);

export function set_server(index){
    server = new Serverinfo(index)
}

export function get_server(){
    return server;
}