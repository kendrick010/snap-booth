import { NextResponse } from 'next/server'
import generateUuidDateId from '@/utils/generateUuid'
import { supabase } from "@/lib/supabase/client";

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
    const shareableId = generateUuidDateId()
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${shareableId}.${fileExtension}`
    const filePath = `photos/${fileName}`

    const { error: storageError } = await supabase.storage
      .from('photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (storageError) {
      console.log(storageError)
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
          shareable_id: shareableId,
          image_url: urlData.publicUrl,
          is_public: false,
        }
      ])
      .select('*')
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
      photo: data,
    })
  }
  catch {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}