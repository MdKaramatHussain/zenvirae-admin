import mongoose, { Schema, Document } from 'mongoose'
import bcryptjs from 'bcryptjs'

export interface IAdmin extends Document {
  name: string
  email: string
  password: string
  role: 'admin' | 'superadmin'
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const adminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt)
})

// Method to compare passwords
adminSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcryptjs.compare(candidatePassword, this.password)
}

export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema)
