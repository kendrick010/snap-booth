import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

/*
 ** Only camera endpoint has permission to upload **
*/

export async function POST(request: Request) {
  try {
    // POST parameters
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided or invalid file type' },
        { status: 400 }
      )
    }

    const validTypes = ['image/jpeg']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Supabase upload
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}_${Math.random().toString(36).substring(7)}.${fileExtension}`
    const filePath = `photos/${fileName}`

    const { error: storageError } = await supabase.storage
      .from('photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (storageError) {
      return NextResponse.json(
        { error: 'Storage upload failed' },
        { status: 500 }
      )
    }

    // Get public url
    const { data: urlData } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath)

    // Insert into photos
    const { data, error: dbError } = await supabase
      .from('photos')
      .insert([
        {
          image_url: urlData.publicUrl,
          is_public: false,
        }
      ])
      .select('id, image_url, is_public, created_at')
      .single()

    if (dbError) {
      console.log(dbError)
      await supabase.storage
        .from('photos')
        .remove([filePath])
      
      return NextResponse.json(
        { error: 'Failed to create database record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      photo: {
        id: data.id,
        image_url: data.image_url,
        is_public: data.is_public,
        created_at: data.created_at
      }
    })
  }
  catch {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}