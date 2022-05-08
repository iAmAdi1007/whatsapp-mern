import express from 'express';
import mongoose from 'mongoose';
import Messages from "./dbMessages.js";
import bodyParser from 'body-parser';
import Pusher from 'pusher';
import cors from "cors";

const app = express();
//Port creation
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "1406079",
    key: "c5316c367e89b6b8d5b7",
    secret: "20838fe6856071cea3b4",
    cluster: "ap2",
    useTLS: true
  });

//Middlewares
app.use(bodyParser.json(), cors());

//DB Connection
const connection_url = 'mongodb+srv://admin:admin@cluster0.pyz9z.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(connection_url);

const db= mongoose.connection
db.once("open", ()=>{
    console.log("DB Connected");
    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
        //console.log(change);

        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument
            pusher.trigger("messages", "inserted",{
                name :messageDetails.name,
                message : messageDetails.message,
                timestamp : messageDetails.timestamp,
                received: messageDetails.received
            })
        }else{
            console.log("Error triggering Pusher");
        }
    })
})

//API routes
app.get('/', (req, res) => res.status(200).send("Hello Developers"))

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(data)        
        }
    })
})

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body;
    Messages.create(dbMessage, (err, data) => {
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    })

})

//Start Listening on Server 
app.listen(port, ()=> console.log(`Server is running on port ${port}`));
