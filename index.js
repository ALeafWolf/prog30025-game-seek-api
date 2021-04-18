//mongo
const mongoose = require("mongoose");
const mongoURL = "mongodb+srv://dbUser:0000@cluster0.x7xyu.mongodb.net/GameDB?retryWrites=true&w=majority"
const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}

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
const GameSchema = new Schema({
    title: String,
    publisher: String,
    developer: String,
    platform: String,
    release: String,
    genre: String,
    description: String
})
const Game = mongoose.model("GameCollection", GameSchema)

const express = require("express");
const app = express();
app.use(express.json());


// GET all
app.get("/api/games", (req, res) => {
    Game.find().exec().then(
        (results) => {
            res.status(200).send(results);
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).send("Error when getting games from database.")
        }
    )
});

// GET one
app.get("/api/games/:title", (req, res) => {
    let input = req.params.title;
    Game.find({title: input}).exec().then(
        (results) => {
            if (results.length === 0) {
                res.status(404).send(`Game with title ${input} not found`)
            } else {
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
app.post("/api/games", (req, res) => {
    let dataToInsert = req.body;
    if (dataToInsert.title) {
        const newGame = Game(dataToInsert)
        newGame.save().then(
            () => {
                res.status(404).send({ "message": `Game with title ${dataToInsert.title} is successfully inserted` });
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

//DELETE one
app.delete("/api/games/:title", (req, res) => {
    let deleteName = req.params.title;
    Game.findOneAndDelete({title: deleteName}).exec().then(
        (results) => {
            if (!results) {
                res.status(406).send(`Game with title ${deleteName} not found`)

            } else {
                res.status(200).send(`Game with title ${deleteName} is deleted successfully`)
            }
        }
    ).catch(
        err => {
            console.log(err)
        }
    )
});

//DELETE all
app.delete("/api/games", (req, res) => {
    res.status(501).send("Not implemented");
});

//UPDATE one
app.put("/api/games/:title", (req, res) => {
    let updateTitle = req.params.title;
    let dataToUpdate = req.body;
    Game.findOneAndUpdate({title: updateTitle}, dataToUpdate, {new: false}).exec().then(
        (results) => {
            if (!results) {
                res.status(406).send(`Game with title ${updateTitle} not found`)

            } else {
                res.status(200).send(`Game with title ${updateTitle} is updated`)
            }
        }
    ).catch(
        err => {
            console.log(err)
        }
    )
});




