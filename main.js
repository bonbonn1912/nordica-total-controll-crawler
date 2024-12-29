import "dotenv/config"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getAccessToken = async () =>{
    const body = { username: process.env.NORDICA_EMAIL, password: process.env.NORDICA_PASSWORT}
    const res = await fetch("https://appapi.extraflame.it/auth", {
       method: "POST",
       headers: {
        "Content-Type": "application/json"
       },
       body: JSON.stringify(body)
    })
    if(res.ok){
        const data = await res.json()
        return data.token
    }
    return null;
}

const fetchData = async (token) => {
    const res = await fetch("https://appapi.extraflame.it/stoves/2c94809186ffb14e018b9516ed242a16/lasts/parameters/roomTemp,waterTemp,smokeTemp,power,machineState,targetRoomTemp,targetWaterTemp,targetPower,weekChronoEnabled,mainFanMode,can1FanMode,can2FanMode,mainFanSpeed,timeSettings,cronoSettings,alarmCode", {
        headers: {
            "X-AUTH-TOKEN": token
        }
    })
    if(res.ok){
        const data = await res.json();
        const json = JSON.stringify(data)
        return data;
    }
    return null;
}

const insertData = async (data) =>{

    const waterTemp = data.data[1].doubleVal
    const smokeTemp = data.data[2].doubleVal
    const power = data.data[3].doubleVal
    const machineState = data.data[4].doubleVal
    const targetRoomTemp = data.data[5].doubleVal
    const targetWaterTemp = data.data[6].doubleVal
    const targetPower = data.data[7].doubleVal
    const newSensorData = await prisma.Nordica.create({
        data: {
          waterTemp: waterTemp,
          smokeTemp: smokeTemp,
          power: power,
          machineState: machineState,
          targetRoomTemp: targetRoomTemp,
          targetWaterTemp: targetWaterTemp,
          targetPower: targetPower,
        },
      });

      console.log(newSensorData)
    
}

const getData = async () =>{
    try{
        const token = await getAccessToken();
        const data = await fetchData(token)
        if(data != null){
            insertData(data)
        }
    }
    catch(e){
        console.log("Something went wrong")
    }
   
}

setInterval(getData, 60000); 