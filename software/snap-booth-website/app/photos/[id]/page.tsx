'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from "@/lib/supabase/client";
import StripeGradient from "@/components/StripeGradient";

type Photo = {
  id: string,
  shareable_id: string,
  image_url: string,
  is_public: boolean,
  created_at: string
}

export default function Photo() {
  const { id: shareableId } = useParams<{ id: string }>()

  const [photo, setPhoto] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (!shareableId) {
      return
    }

    const fetchPhoto = async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('shareable_id', shareableId)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setPhoto(data)
      }

      setLoading(false)
    }

    fetchPhoto()
  }, [shareableId])

  if (loading)
    return (
      <main className="min-h-svh w-full bg-[url('/textured-bg.jpg')] bg-cover bg-center flex items-center justify-center">
        <div className="-translate-y-8">
          <div className="px-10 py-3 bg-[#f2f0ef] animate-spin">
            <h1 className="font-ink text-black text-4xl">Loading ...</h1>
          </div>
        </div>
      </main>
    )

  return (
    <div className="relative w-full min-h-svh overflow-hidden">
      <StripeGradient />
      <div className="absolute inset-0 flex items-center justify-center">
        {
          notFound || !photo ?
          <div className="flex flex-col items-center space-y-5 -translate-y-10">
            <h1 className="font-sans text-[#f2f0ef] text-6xl">Oopsies!</h1>
            <h1 className="font-sans text-[#f2f0ef] text-6xl">Photo Not Found.</h1>
          </div>
          :
          <div className="flex flex-col items-center bg-[#f2f0ef] p-4 pb-6 gap-6 -translate-y-10">
            {/* Image */}
            <div className="bg-white shadow-md overflow-hidden max-w-[80vw]">
              <Image
                src={photo.image_url}
                alt="image"
                width={640}
                height={480}
                className="w-full h-auto max-h-[70vh] object-contain shadow-xl"
              />
            </div>
            {/* Share Button */}
            <button 
              className="flex flex-col items-center justify-center cursor-pointer gap-1"
              onClick={async () => {
                setIsCopied(true)
                const url = window.location.href
                await navigator.clipboard.writeText(url)
              }}
            >
              <Image
                src="/icons/link.svg"
                alt="Copy"
                width={24}
                height={24}
              />
              <h1 className="font-sans text-xs">{isCopied ? "Copied!" : "Copy Link"}</h1>
            </button>
          </div>
        }
      </div>
    </div>
  )
}