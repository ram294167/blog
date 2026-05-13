import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const type = formData.get('type') // 'image', 'video', or 'voice'

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const validTypes = ['image', 'video', 'voice']
    if (!validTypes.includes(type)) {
      return Response.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Check file size (limit to 50MB for now)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return Response.json({ error: 'File too large' }, { status: 413 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const ext = file.name.split('.').pop()
    const filename = `${uuidv4()}.${ext}`
    const dir = join(process.cwd(), 'public', 'uploads', type)

    // Create directory if it doesn't exist
    await mkdir(dir, { recursive: true })

    // Write file
    const filepath = join(dir, filename)
    await writeFile(filepath, buffer)

    return Response.json({
      success: true,
      filename,
      url: `/uploads/${type}/${filename}`,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    )
  }
}

// Route segment configuration for Next.js 13+
export const maxDuration = 60
export const config = {
  maxDuration: 60,
}
