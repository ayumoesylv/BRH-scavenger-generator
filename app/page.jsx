"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PLACES = [
  "Olin Library",
  "Uris Library",
  "Duffield Hall",
  "Goldwin Smith Hall",
  "Willard Straight Hall",
  "Morrison Dining Hall",
  "Arts Quad",
];

const STORAGE_DRAFT = "scavenger_draft"; // place + group + difficulty + items

export default function Home() {
  const router = useRouter();
  const [place, setPlace] = useState(PLACES[0]);
  const [groupSize, setGroupSize] = useState(3);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place, groupSize, difficulty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      // Save draft to localStorage and go to /edit
      const payload = { place, groupSize, difficulty, items: data.items || [] };
      localStorage.setItem(STORAGE_DRAFT, JSON.stringify(payload));
      router.push("/edit");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-5">
      <h1 className="text-3xl font-semibold">Campus Scavenger Generator</h1>
      <p className="text-sm text-neutral-600">
        Pick a place and group size, then generate a list to edit and play.
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
            onChange={(e) => setGroupSize(parseInt(e.target.value || "1", 10))}
            className="border rounded-lg p-2 w-full bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm mb-1 block">Difficulty</span>
          <select
            className="border rounded-lg p-2 w-full bg-white"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
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
        {loading ? "Generating…" : "Generate"}
      </button>

      {error && <p className="text-red-600">{error}</p>}
    </main>
  );
}
