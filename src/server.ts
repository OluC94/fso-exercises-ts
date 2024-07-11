import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { addDummyDbItems } from "./db";
import filePath from "./filePath";
import phonebookData from "./data/phonebook.json";
import {
    addPerson,
    getPersonById,
    isNotUniqueName,
    PhonebookItem,
} from "./utils/utils";
import morgan from "morgan";

// loading in some dummy items into the database
// (comment out if desired, or change the number)
addDummyDbItems(20);

const app = express();

/** Parses JSON data in a request automatically */
app.use(express.json());
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
app.use(cors());
app.use(
    morgan(function (tokens, req, res) {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, "content-length"),
            "-",
            tokens["response-time"](req, res),
            "ms",
            JSON.stringify(req.body),
        ].join(" ");
    })
);

// read in contents of any environment variables in the .env file
// Must be done BEFORE trying to access process.env...
dotenv.config();

// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;

// API info page
app.get("/", (req, res) => {
    console.log();
    const pathToFile = filePath("../public/index.html");
    res.sendFile(pathToFile);
});

app.get("/api/persons", (req, res) => {
    const allPeople = phonebookData;
    res.status(200).json(allPeople);
});

app.get("/info", (req, res) => {
    const numberOfPeople = phonebookData.length;
    const date = new Date();
    res.send(
        `<p>Phonebook has info for ${numberOfPeople} people</p><br/><p>${date}</p>`
    );
});

app.get<{ id: string }>("/api/persons/:id", (req, res) => {
    const personData = getPersonById(req.params.id);
    const statusCode = personData === "not found" ? 404 : 200;
    res.status(statusCode).json(personData);
});

app.delete<{ id: string }>("/api/persons/:id", (req, res) => {
    const personData = getPersonById(req.params.id);
    const statusCode = personData === "not found" ? 404 : 204;
    res.status(statusCode).json(personData);
});

app.post<{}, {}, PhonebookItem>("/api/persons/", (req, res) => {
    const postData = req.body;
    if (isNotUniqueName(postData)) {
        res.status(400).json({ eroor: "name must be unique" });
        return;
    }

    if (postData.name && postData.number) {
        const newEntry = addPerson(postData);
        res.status(201).json(newEntry);
        return;
    }

    res.status(400).json({ message: "error: incomplete data" });
});

app.listen(PORT_NUMBER, () => {
    console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
