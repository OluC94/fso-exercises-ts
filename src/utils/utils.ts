import phonebookData from "../data/phonebook.json"

interface PhonebookItem {
    name: string;
    number: string;
}

interface PhonebookItemWithId extends PhonebookItem {
    id: string,
}

const getPersonById = (id: string):PhonebookItemWithId | "not found" => {
    const entry = phonebookData.find(person => person.id === id);
    return entry ? entry : "not found"
}

const addPerson = (data: PhonebookItem) : PhonebookItemWithId => {
    const newId: number = Math.floor(Math.random()* (100 - phonebookData.length + 1) + phonebookData.length)
    const newPerson: PhonebookItemWithId = {
        id: newId.toString(),
        ...data
    }
    phonebookData.push(newPerson)
    return newPerson
}

export {PhonebookItemWithId, PhonebookItem, getPersonById, addPerson}