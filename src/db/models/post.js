import 'server-only'
import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    contents: String,
    isPublic: { type: Boolean, default: false },
    image: {
      filename: String,
      url: String,
      size: Number,
    },
    video: {
      filename: String,
      url: String,
      size: Number,
      duration: Number,
    },
    voice: {
      filename: String,
      url: String,
      size: Number,
      duration: Number,
    },
  },
  { timestamps: true },
)

export const Post = mongoose.models.post ?? mongoose.model('post', postSchema)
