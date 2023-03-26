const { Schema, model, Types } = require('mongoose');

const contactSchema = new Schema({
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
  owner: {
    type: Types.ObjectId,
    ref: 'user',
  },
});

const Contact = model('contact', contactSchema);

exports.listContacts = async (owner, options) => {
  try {
    const { limit, page = 1, favorite } = options;

    let findOptions = { owner };

    if (favorite) {
      findOptions = { $and: [{ owner }, { favorite }] };
    }

    const contactsQuery = Contact.find(findOptions).select('-__v');

    if (limit) {
      const skip = (page - 1) * limit;
      contactsQuery.skip(skip).limit(limit);
    }

    const contacts = await contactsQuery;

    return contacts;
  } catch (error) {
    console.log(error);
  }
};

exports.getById = async (contactId) => {
  try {
    const [contact] = await Contact.find({ _id: contactId }).select('-__v');
    return contact;
  } catch (error) {
    console.log(error);
  }
};

exports.isExist = async (contactId) => {
  try {
    return await Contact.exists({ _id: contactId });
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

exports.addContact = async (body, user) => {
  try {
    body.owner = user;

    const contact = await Contact.create(body);

    const contactWithoutV = await Contact.findById(contact._id).select('-__v');

    return contactWithoutV;
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
