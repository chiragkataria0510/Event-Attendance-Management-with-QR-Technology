import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    mobileCode: { type: String, required: true},
    mobile: { type: String, required: true, unique: true , index: true},
    prefix: { type: String, required: true},
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    company: { type: String, required: true},
    organisation: { type: String, required: false},
    registerationType: { type: String, required: true},
    attendance1: { type: Boolean, required: false, default: false },
    attendance2: { type: Boolean, required: false, default: false },
    address: { type: String, required: true},
    country: { type: String, required: true},
    state: { type: String, required: true},
    city: { type: String, required: true},
    pinCode: { type: String, required: true},
  }
);

registrationSchema.index({ email: 1 }, { unique: true });
registrationSchema.index({ mobile: 1 }, { unique: true });

const Registrations = mongoose.models.Registrations || mongoose.model('Registrations', registrationSchema,'registrations');
export default Registrations;
