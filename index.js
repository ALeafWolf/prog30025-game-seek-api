//mongo
const mongoose = require("mongoose");
const mongoURL = "mongodb+srv://qinadb:fruehJqBVABaBYO0@cluster0.vf3iw.mongodb.net/prog34104?retryWrites=true&w=majority"
const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const HTTP_PORT = process.env.PORT || 8080;
mongoose.connect(mongoURL, connectionOptions).then(
    () => {
        console.log("Connection success")
        app.listen(HTTP_PORT, onHttpStart);
    }
).catch(
    (err) => {
        console.log("Error connecting to database")
        console.log(err)
    }
)
const onHttpStart = () => {
    console.log(`Server has started and is listening on port ${HTTP_PORT}`)
}


const Schema = mongoose.Schema
const ItemSchema = new Schema({
    name: String,
    rarity: String,
    description: String,
    goldPerTurn: Number
})
const Item = mongoose.model("items_table", ItemSchema)


const express = require("express");
const app = express();
app.use(express.json());


// GET all
app.get("/api/items", (req, res) => {
    Item.find().exec().then(
        (results) => {
            res.status(200).send(results);
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).send("Error when getting items from database.")
        }
    )
});

// GET one
app.get("/api/items/:item_name", (req, res) => {
    let input = req.params.item_name;
    Item.find({name: input}).exec().then(
        (results) => {
            if(results.length === 0){
                res.status(404).send(`Item with name ${input} not found`)
            }else{
                res.status(200).send(results);
            }
        }
    ).catch(
        (err) => {
            console.log(err)
        } 
    )
});

// ADD one
app.post("/api/items", (req, res) => {
    let dataToInsert = req.body;
    if (dataToInsert.name && dataToInsert.rarity) {
        const newItem = Item(dataToInsert)
        newItem.save().then(
            () => {
                res.status(404).send({ "message": `Item with name ${dataToInsert.name} is successfully inserted` });
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    } else {
        res.status(406).send({ "message": `Not able to insert data` });
    }
});

//ADD many
app.post("/api/items", (req, res) => {
    res.status(404).send();
});

//DELETE one
app.delete("/api/items/:item_name", (req, res) => {
    let deleteName = req.params.item_name
    Item.findOneAndDelete({name: deleteName}).exec().then(
        (results) => {
            if(!results){
                res.status(406).send(`Item with name ${deleteName} not found`)

            }else{
                res.status(200).send(`Item with name ${deleteName} is deleted successfully`)
            }
        }
    ).catch(
        err => {
            console.log(err)
        }
    )
});

//DELETE all
app.delete("/api/items", (req, res) => {
    res.status(404).send();
});

//UPDATE one
app.put("/api/items/:item_id", (req, res) => {
    res.status(501).send("Not implemented");
});

//UPDATE many
app.put("/api/items", (req, res) => {
    res.status(404).send();
});



