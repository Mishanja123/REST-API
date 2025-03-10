const { model, Schema, Types } = require('mongoose');


const contactSchema = new Schema ({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
      },
      email: {
        type: String,
        required: [true, 'Set email for contact'],

      },
      phone: {
        type: String,
        required: [true, 'Set phone number for contact'],
      },
      favorite: {
        type: Boolean,
        default: false,
        select: false,
      },
      owner: {
        type: Types.ObjectId,
        ref: 'User',
      }
}, {
    versionKey: false,
});

const Contact = model('Contact', contactSchema);

module.exports = Contact;

  