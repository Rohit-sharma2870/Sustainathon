import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Generate doctorId: 4 letters + 6 digits
function generateDoctorId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  for (let i = 0; i < 4; i++) {
    id += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  id += '-';
  for (let i = 0; i < 6; i++) {
    id += Math.floor(Math.random() * 10);
  }
  return id;
}

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  hospital: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  dob: { type: Date },
  gender: { type: String },
  license: { type: String, required: true, unique: true },
  doctorId: { type: String, unique: true, default: generateDoctorId },
  avatar: { type: String },
  password: { type: String, required: true }
}, { timestamps: true });

// Hash password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
doctorSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Doctor', doctorSchema);