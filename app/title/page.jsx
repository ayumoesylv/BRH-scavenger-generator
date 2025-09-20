"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Confetti from 'react-confetti'

const gifs = [
    "https://media1.tenor.com/m/hzFHhdvD3lAAAAAd/gato-joia.gif",
    "https://media1.tenor.com/m/krIk0mNys54AAAAC/oke-sip.gif",
    "https://media1.tenor.com/m/BXiLV2dmEgIAAAAC/cat-cat-meme.gif",
    "https://media1.tenor.com/m/UTIxDC2n13AAAAAd/ferret-dancing-ferret.gif",
    "https://media1.tenor.com/m/G_cJy4aSLfsAAAAd/shook-otter.gif"
]

// Choose a random index from the gif array
const randomIndex = Math.floor(Math.random() * gifs.length);

export default function TitlePage() {
    const router = useRouter();
    
    const [showConfetti, setShowConfetti] = useState(false); // control confetti display

    return (
        <main className="max-w-2xl mx-auto p-6 space-y-5 text-center" >
            {showConfetti && <Confetti className = "w-full h-full"/>}
            {!showConfetti && <Confetti className = "invisible"/>}
            <h1 className="text-3xl font-semibold">CONGRATS!!!</h1>
            <br></br>
            <span className="text-sm text-neutral-600">
                <img src = {gifs[randomIndex]} width = "400px" className = "mx-auto" alt="loading.."/>
            </span>
             <p className="text-lg text-neutral-600">
                You have successfully completed your scavenger hunt! <br></br>Click below to play again!
            </p>
            <button className = "mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                onClick = {() => setShowConfetti(prev => !prev)}>
                {showConfetti && <span>Stop</span>} Confetti 🎉
            </button>
            <br></br>
            <button
                className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                onClick={() => router.push("/")}
            >
                Play Again
            </button>
        </main>
    )
}

