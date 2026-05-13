import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/db/init'
import { User } from '@/db/models'

export async function POST(req) {
  try {
    await connectDB()

    const body = await req.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: { _id: user._id, username: user.username, email: user.email },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { message: 'Error during login' },
      { status: 500 }
    )
  }
}
