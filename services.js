let ObjectId = require('mongodb').ObjectId;

async function listDatabases(client){
    try{
        const dbList = await client.db().admin().listDatabases();
        dbList.databases.forEach(element => {
            console.log(element);
        });
        return dbList;
    }catch(err){
        console.log(err)
    }
}

async function addEventToDatabase(client , payload){
    try{
        const res1 = await client.db("eventsDb").collection("eventsCollection").insertOne(payload);
        console.log(res1);
        return res1;
    }catch(err){
        console.log(err);
    }
}

async function findDatabase(client , id){
    try{
        console.log(id);
        const res1 = await client.db("eventsDb").collection("eventsCollection").findOne({
            _id : ObjectId(id)
        })
        console.log(res1);
        return res1;
    }catch(err){
        console.log(err);
    }
}

async function deleteEvent(client , id){
    try{
        const res1 = await client.db("eventsDb").collection("eventsCollection").deleteOne({
            _id : ObjectId(id)
        })
        return res1;
    }catch(err){
        console.log(err);
        return err;
    }   
}

async function updateEvent(client , id , payload){
    try{
        const res1 = await client.db("eventsDb").collection("eventsCollection").updateOne({_id : ObjectId(id)} , {$set:{
            type : payload.type,
            tagline : payload.tagline,
            files : payload.files,
            schedule : payload.schedule,
            description : payload.description,
            moderator : payload.moderator,
            category : payload.category,
            sub_category : payload.sub_category,
            rigor_rank : payload.rigor_rank,
            uid : 0,
            attendees : []
        }})
        return res1;
    }catch(err){
        return err;
    }
}

async function getEventsByRecency(client , payload){
    try{
        const res1 = await client.db("eventsDb").collection("eventsCollection").find().toArray();
        res1.sort((a,b)=>{
            let time1 = a.schedule;
            let time2 = b.schedule;
            // console.log(time1 , time2 , time1 < time2);
            if (time1 < time2) return -1;
            else if(time1 > time2) return 1;
            else return 0;
        })
        let limit = Number(payload.limit);
        console.log(typeof limit);
        let page = Number(payload.page);
        let start = limit*(page-1);
        let end = start + limit;
        console.log(start , end);
        if(end >= res1.length) end = res1.length;
        let out = res1.slice(start , end);
        return out;
    }catch(err){
        return err;
    }
}

module.exports = {addEventToDatabase , findDatabase , deleteEvent , updateEvent , getEventsByRecency};