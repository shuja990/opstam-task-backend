import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const reviewSchema = mongoose.Schema(
  {
    Review_title: { type: String },
    Review_link: { type: String },
    Unhappy_action: { type: String },
    Icon: { type:String },
    review: {type:String},
    name: {type:String},
    phone: {type:Number},
    email: {type:String},
    comment: {type:String},
  },
  {
    timestamps: true,
  }
)

const locationSchema = mongoose.Schema(
  {
    Store_name: { type: String },
    rating: { type: Number },
    Store_address: { type: String },
    email: { type: String },
    website: { type: String },
    page_content: { type: String },
    Default_message: { type: String },
    Customer_service_email: { type:String },
    Review_links : [String],
    Reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
) 

const businessSchema = mongoose.Schema(
  {
    name: { type: String },
    logo: { type: String },
    locations: [locationSchema],
  },
  {
    timestamps: true,
  }
) 

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    accountType:{
      type:String,
      required: true,
      default:"member"
    },
    business: {type:businessSchema}
  },
  {
    timestamps: true,
  }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User
