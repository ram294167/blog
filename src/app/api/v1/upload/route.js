import { v4 as uuidv4 } from 'uuid'
import { supabase, STORAGE_BUCKET } from '@/lib/supabaseClient'

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

    // Check file size (limit to 150MB for now)
    const maxSize = 150 * 1024 * 1024
    if (file.size > maxSize) {
      return Response.json({ error: 'File too large. Use a smaller video under 150MB.' }, { status: 413 })
    }

    const ext = file.name.split('.').pop() || 'bin'
    const filename = `${uuidv4()}.${ext}`
    const storagePath = `${type}/${filename}`
    const binary = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, binary, {
        contentType: file.type,
        cacheControl: '3600',
      })

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError)
      return Response.json(
        { error: 'Upload failed', details: uploadError.message },
        { status: 500 }
      )
    }

    const { data: publicUrlData, error: publicUrlError } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath)

    if (publicUrlError) {
      console.error('Supabase public URL error:', publicUrlError)
      return Response.json(
        { error: 'Upload succeeded but public URL could not be generated' },
        { status: 500 }
      )
    }

    return Response.json({
      success: true,
      filename,
      url: publicUrlData.publicUrl,
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

export const maxDuration = 60
