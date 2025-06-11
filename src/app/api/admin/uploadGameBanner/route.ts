import { NextRequest } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

// Helper to convert file to a readable stream
async function bufferToStream(buffer: Buffer) {
  const readable = new Readable()
  readable._read = () => {}
  readable.push(buffer)
  readable.push(null)
  return readable
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const stream = await bufferToStream(buffer)

    const uploadPromise = new Promise((resolve, reject) => {
      const cloudinaryStream = cloudinary.uploader.upload_stream(
        { folder: 'gambling-app' },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        }
      )
      stream.pipe(cloudinaryStream)
    })

    const uploadResult: any = await uploadPromise

    return new Response(JSON.stringify({ url: uploadResult.secure_url }), {
      status: 200,
    })
  } catch (error: any) {
    console.error('[UPLOAD ERROR]', error)
    return new Response(JSON.stringify({ error: 'Upload failed', detail: error.message }), {
      status: 500,
    })
  }
}
