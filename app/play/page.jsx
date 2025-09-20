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
      <div className='display'>{formatTime()}</div>
      <div className='controls'>
        <button onClick={start} className='start-button'>Start</button>
        <button onClick={stop} className='stop-button'>Stop</button>
      </div>
    </div>
  );

}

export default function PlayPage() {
  const [items, setItems] = useState([])

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

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className='list-of-riddles'>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <strong>Clue:</strong> {item.clue}
              <br />
              <strong>Answer:</strong> {item.answer}
            </li>
          ))}
        </ul>
  
      </section>
      <section className='stopwatch'>
        <Stopwatch />
      </section>
    </main>
  );
}