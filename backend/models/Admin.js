import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  refreshTokenHash: { type: String, default: null },
  name: {
    type: String,
    default: 'Owner'
  },
  role: {
    type: String,
    default: 'owner'
  },
  lastLogin: {
    type: Date
  }
}, { timestamps: true });

adminSchema.pre('save', async function() {
  if (!this.isModified('passwordHash')) {
    return;
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  } catch (error) {
    throw error;
  }
});

adminSchema.methods.comparePassword = async function(plainPassword) {
  return await bcrypt.compare(plainPassword, this.passwordHash);
};

adminSchema.methods.setPassword = async function(plainPassword) {
  this.passwordHash = plainPassword;
};

adminSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

export default mongoose.model('Admin', adminSchema);
