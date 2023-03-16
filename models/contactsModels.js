const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

exports.listContacts = async () => {
  try {
    const contacts = await Contact.find().select('-__v');

    return contacts;
  } catch (error) {
    console.log(error);
  }
};

exports.getById = async (connectId) => {
  try {
    const contact = await Contact.findById(connectId).select('-__v');

    return contact;
  } catch (error) {
    console.log(error);
  }
};

exports.removeContact = async (contactID) => {
  try {
    await Contact.findByIdAndDelete(contactID);
  } catch (error) {
    console.log(error);
  }
};

exports.updateContact = async (contactId, body) => {
  try {
    const { name, email, phone, favorite } = body;
    if (name)
      await Contact.findByIdAndUpdate(contactId, { name }, { new: true });
    if (email)
      await Contact.findByIdAndUpdate(contactId, { email }, { new: true });
    if (phone)
      await Contact.findByIdAndUpdate(contactId, { phone }, { new: true });
    if (favorite)
      await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });

    const updatedContact = await Contact.findById(contactId).select('-__v');

    return updatedContact;
  } catch (error) {
    console.log(error);
  }
};

exports.addContact = async (body) => {
  try {
    const contact = await Contact.create(body).select('-__v');

    return contact;
  } catch (error) {
    console.log(error);
  }
};

exports.updateStatusContact = async (contactId, body) => {
  try {
    const { favorite } = body;

    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      {
        new: true,
      }
    ).select('-__v');

    return contact;
  } catch (error) {
    console.log(error);
  }
};
