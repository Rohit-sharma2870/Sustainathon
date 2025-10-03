import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
function generatePatientId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  for (let i = 0; i < 4; i++) {
    id += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  id += '-';
  for (let i = 0; i < 6; i++) {
    id += Math.floor(Math.random() * 10);
  }
  return `P-${id}`;
}
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  emergencyContact: {
    name: { type: String },
    phone: { type: String }
  },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  dob: { type: Date },
  gender: { type: String },
 insuranceId: { type: String, unique: true, sparse: true }, 
  patientId: { type: String, unique: true, default: generatePatientId },
  avatar: { type: String },
  password: { type: String, required: true }
}, { timestamps: true });

patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

patientSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// CRITICAL: Exporting the Patient model
export default mongoose.model('Patients', patientSchema);