"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [code, setCode] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    router.push(`/photos/${code}`)
  }

  return (
    <main className="min-h-svh w-full bg-[url('/textured-bg.jpg')] bg-cover bg-center flex items-center justify-center">
      <div className="-translate-y-10">
        <div className="px-6 py-3 bg-[#f2f0ef]">
          <h1 className="font-ink text-black text-4xl">Find Your Photo .</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="pt-6 flex items-center gap-3"
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-sans border-2 border-black text-lg py-2 px-6 rounded-full outline-none"
            placeholder="enter photo id"
          />

          <button
            type="submit"
            disabled={!code.trim()}
            className="flex items-center justify-center rounded-full cursor-pointer"
          >
            <Image
              src="/icons/arrow.svg"
              alt="submit"
              width={30}
              height={30}
            />
          </button>
        </form>
      </div>
    </main>
  )
}