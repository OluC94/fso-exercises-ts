import phonebookData from "../data/phonebook.json"

interface PhonebookItem {
    id: string,
    name: string;
    number: string;
}

interface Phonebook {

}

export const getPersonById = (id: string):PhonebookItem | "not found" => {
    const entry = phonebookData.find(person => person.id === id);
    return entry ? entry : "not found"
}