"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const STORAGE_FINAL = "scavenger_final";

function Stopwatch() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const[elapsedTime, setElapsedTime] = useState(0);
  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {

    if(isRunning){
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current)
      }, 10);
    }

    return() => {
      clearInterval(intervalIdRef.current);

    }

  }, [isRunning]);

  function start(){
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime

  }
  function stop(){
    setIsRunning(false)
    router.push("/title");

    
  }
  function formatTime(){

    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
    let seconds = Math.floor(elapsedTime / (1000) % 60);

    hours = String(hours).padStart(2, "0")
    minutes = String(minutes).padStart(2, "0")
    seconds = String(seconds).padStart(2, "0")

    return `${hours}:${minutes}:${seconds}`;
  }

  return(
    <div className='stopwatch'>
      <div className='border rounded-lg p-3 bg-white shadow-sm space-y-3 text-3xl font-semibold'>{formatTime()}</div>
      <div className='controls'>
        <button onClick={start} className='start-button border rounded-lg p-3 bg-white shadow-sm space-y-3'>Start</button>
        <button onClick={stop} className='stop-button border rounded-lg p-3 bg-white shadow-sm space-y-3'>Stop</button>
      </div>
    </div>
  );

}

export default function PlayPage() {
  const [items, setItems] = useState([])
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_FINAL);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      setItems(parsed.items || []);
    } catch (err) {
      console.error("Failed to parse stored data:", err);
    }
  }, []);

  function handleRevealAnswer() {
    setIsRevealed(!isRevealed);

    return(
      <div className='answer'>
        <strong>Answer:</strong> {item.answer}
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-6 space-y-6">
      
      <section className='stopwatch max-w-3xl mx-auto p-6 space-y-6'>
        <Stopwatch />
      </section>

      <br></br>

      <section className='list-of-riddles'>
        <ul>
          {items.map((item, index) => (
            <li key={index} className="border rounded-lg p-3 bg-white shadow-sm space-y-3 flex flex-col text-lg text-neutral-600">
              {item.clue}<br />
              {isRevealed && (<div><strong>Answer:</strong>{item.answer}</div>)}

            </li>
          ))}
        </ul>
        <div>
          {(!isRevealed) ? <button onClick={handleRevealAnswer} className='mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50'>Reveal Answers</button> : <button onClick={handleRevealAnswer} className='mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50'>Hide Answers</button>}
        </div>
  
      </section>
    </main>
  );
}