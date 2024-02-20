import http from '@/lib/http';
export const mqttApi ={
  mqttPour (id, machineId, transId, content) {
    const currentTimestamp = new Date().getTime();
    const obj = { 1: 1, 2: 3, 3: 1, 4:3 };
    const jsonString = JSON.stringify(content);
   // console.log(jsonString);
    const jsonStringContent = new URLSearchParams(jsonString).toString();
    const finalContent = jsonStringContent.slice(0, -1);
    //console.log(jsonStringContent);
    return http
      .get(`mqtt/pour?id=${id}&machineId=${machineId}&transId=${transId}&time=${currentTimestamp}&content=${finalContent}`)
  }
}


