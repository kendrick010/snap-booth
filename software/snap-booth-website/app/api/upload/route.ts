import { NextResponse } from 'next/server'
import generateUuidDateId from '@/utils/generateUuid'
import { supabase } from "@/lib/supabase";

/*
 ** Only camera endpoint has permission to upload **
*/

export async function POST(request: Request) {
  try {
    const secret = request.headers.get("x-device-secret")
    if (secret !== process.env.DEVICE_UPLOAD_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
        { error: 'Invalid file type. Only JPEG are allowed.' },
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