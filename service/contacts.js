const Contact = require('./schemes/models/schemaContacts');

const getAllContacts = async (userId) => {
    return Contact.find({ owner: userId })
}

const getContactById = (contactId) => {
    return Contact.findOne({ _id: contactId })
}

const createContact = (body, userId) => {
    return Contact.create({ body, owner: userId })
}

const updateContact = (contactId, body) => {
    return Contact.findByIdAndUpdate({ _id: contactId }, body, { new: true })
}

const removeContact = (contactId) => {
    return Contact.findByIdAndRemove({ _id: contactId })
}

const updateStatusContact = async (contactId, body) => {
    return Contact.findByIdAndUpdate({ _id: contactId }, body, { new: true })
}

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    removeContact,
    updateStatusContact
}
