import 'server-only'
import mongoose from 'mongoose'

const globalWithMongoose = globalThis

export async function initDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL environment variable')
  }

  if (globalWithMongoose.__mongoose?.conn) {
    return globalWithMongoose.__mongoose.conn
  }

  if (!globalWithMongoose.__mongoose) {
    globalWithMongoose.__mongoose = { conn: null, promise: null }
  }

  if (!globalWithMongoose.__mongoose.promise) {
    mongoose.set('strictQuery', false)
    globalWithMongoose.__mongoose.promise = mongoose.connect(process.env.DATABASE_URL, {
      dbName: 'blog',
      autoIndex: true,
    }).then((mongooseInstance) => {
      return mongooseInstance
    })
  }

  globalWithMongoose.__mongoose.conn = await globalWithMongoose.__mongoose.promise
  return globalWithMongoose.__mongoose.conn
}

export { initDatabase as connectDB }
