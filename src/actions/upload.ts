'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { v4 as uuidv4 } from 'uuid'

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file uploaded')
  }

  // Ensure bucket exists using admin client (wrapped in try-catch to avoid crashes if listBuckets fails on Vercel)
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === 'uploads')

    if (!bucketExists) {
      const { error: createError } = await supabaseAdmin.storage.createBucket('uploads', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880 // 5MB
      })
      if (createError) {
        console.error('Failed to create bucket:', createError)
      }
    }
  } catch (bucketError: any) {
    console.warn('Bucket list/creation bypassed:', bucketError.message || bucketError)
  }

  const fileExt = file.name.split('.').pop()
  const filename = `${uuidv4()}.${fileExt}`
  
  // Convert File to Node.js Buffer for 100% stable upload in Vercel Serverless environment
  const arrayBuffer = await file.arrayBuffer()
  const fileBuffer = Buffer.from(arrayBuffer)
  
  // Use admin client to upload to bypass RLS for now (safer for setup)
  const { data, error } = await supabaseAdmin.storage
    .from('uploads')
    .upload(filename, fileBuffer, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('SUPABASE STORAGE ERROR:', error.message, error)
    throw new Error(`Gagal upload: ${error.message}`)
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('uploads')
    .getPublicUrl(filename)
  
  return {
    url: publicUrl,
    filename: filename
  }
}
