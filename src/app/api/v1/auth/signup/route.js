import { NextResponse } from 'next/server'
import { connectDB } from '@/db/init'
import { User } from '@/db/models'

export async function POST(req) {
  try {
    await connectDB()

    const body = await req.json()
    const { username, email, password, confirmPassword } = body

    // Validate input
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    })
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      )
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
    })

    await user.save()

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: { _id: user._id, username: user.username, email: user.email },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error during signup:', error)
    return NextResponse.json(
      { message: 'Error during signup' },
      { status: 500 }
    )
  }
}
