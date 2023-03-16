const mangoose = require('mongoose');

const contactSchema = mangoose.Schema({
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

const Contact = mangoose.model('Contact', contactSchema);

exports.listContacts = async () => {
  try {
    const contacts = await Contact.find();

    return contacts;
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

    if (name) Contact.findByIdAndUpdate(contactId, { name }, { new: true });
    if (email) Contact.findByIdAndUpdate(contactId, { email }, { new: true });
    if (phone) Contact.findByIdAndUpdate(contactId, { phone }, { new: true });
    if (favorite)
      Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });

    const updatedContact = Contact.findById(contactId);

    return updatedContact;
  } catch (error) {
    console.log(error);
  }
};

exports.addContact = async (body) => {
  try {
    const contact = Contact.create(body);

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
    );

    return contact;
  } catch (error) {
    console.log(error);
  }
};
