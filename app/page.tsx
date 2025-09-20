"use client";
import { useState } from "react";

const PLACES = [
  "Main Library",
  "Student Union",
  "Athletics Center",
  "Engineering Quad",
  "Arts Building",
  "Dining Hall",
  "Campus Green"
];

type Difficulty = "easy" | "medium" | "hard";

export default function Home() {
  const [place, setPlace] = useState(PLACES[0]);
  const [groupSize, setGroupSize] = useState(3);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]|null>(null);
  const [error, setError] = useState<string|null>(null);

  async function handleGenerate() {
    setLoading(true); setError(null); setItems(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place, groupSize, difficulty })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setItems(data.items);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-5">
      <h1 className="text-3xl font-semibold">Campus Scavenger Generator</h1>
      <p className="text-sm text-neutral-600">
        Pick a place and group size, then generate a list of safe, in-person items to find.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm mb-1 block">Place</span>
          <select
            className="border rounded-lg p-2 w-full bg-white"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          >
            {PLACES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm mb-1 block">Group size</span>
          <input
            type="number"
            min={1}
            max={50}
            value={groupSize}
            onChange={(e) => setGroupSize(parseInt(e.target.value || "1"))}
            className="border rounded-lg p-2 w-full bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm mb-1 block">Difficulty</span>
          <select
            className="border rounded-lg p-2 w-full bg-white"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-black text-white rounded-xl px-4 py-2 disabled:opacity-60"
      >
        {loading ? "Generating…" : "Generate list"}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {items && (
        <ol className="space-y-3 list-decimal pl-6">
          {items.map((it, i) => (
            <li key={i} className="border rounded-xl p-3 bg-white shadow-sm">
              <div className="font-medium">{it.title}</div>
              <div className="text-sm opacity-80">{it.clue}</div>
              <div className="text-xs mt-1">Why here: {it.whyItFitsPlace}</div>
              <div className="text-xs">Est. time: {it.estimatedTimeMin} min</div>
              <div className="text-xs">Verify: {it.verificationHint}</div>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
