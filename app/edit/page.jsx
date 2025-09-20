"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_DRAFT = "scavenger_draft";
const STORAGE_FINAL = "scavenger_final";

export default function EditPage() {
  const router = useRouter();
  const [draft, setDraft] = useState(null); // { place, groupSize, difficulty, items: [...] }
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_DRAFT);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      // Ensure each item has all fields we want to edit (answer added)
      const items = (parsed.items || []).map(it => ({
        title: it.title || "",
        clue: it.clue || "",
        answer: it.answer || "",                // <-- NEW
        whyItFitsPlace: it.whyItFitsPlace || "",
        verificationHint: it.verificationHint || "",
      }));
      setDraft({ ...parsed, items });
    } catch {
      // bad JSON -> ignore
    }
  }, []);

  function updateItem(index, field, value) {
    setDraft(prev => {
      if (!prev) return prev;
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  }

  function handleSaveAndStart() {
    if (!draft) return;
    setSaving(true);
    localStorage.setItem(STORAGE_FINAL, JSON.stringify(draft));
    router.push("/play");
  }

  if (!draft) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Edit Clues</h1>
        <p className="mt-2 text-sm opacity-80">
          No draft found. Go back to the{" "}
          <a className="underline" href="/generate">generator</a>.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Edit Clues</h1>
      <p className="text-sm opacity-80">
        Place: <strong>{draft.place}</strong> · Group size: <strong>{draft.groupSize}</strong> · Difficulty: <strong>{draft.difficulty}</strong>
      </p>

      <ol className="space-y-4 list-decimal pl-6">
        {draft.items.map((it, i) => (
          <li key={i} className="border rounded-lg p-3 bg-white shadow-sm space-y-3">
            <div className="font-medium">{it.title || `Item ${i + 1}`}</div>

            <label className="block">
              <span className="text-xs uppercase tracking-wide">Clue (riddle)</span>
              <textarea
                className="border rounded p-2 w-full"
                value={it.clue}
                onChange={(e) => updateItem(i, "clue", e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wide">Answer</span>
              <input
                type="text"
                className="border rounded p-2 w-full"
                value={it.answer}
                onChange={(e) => updateItem(i, "answer", e.target.value)}
                placeholder="e.g., 'the bronze statue by the fountain'"
              />
            </label>
          </li>
        ))}
      </ol>

      <div className="flex gap-3">
        <button
          onClick={() => router.push("/generate")}
          className="border rounded px-4 py-2"
        >
          Back
        </button>
        <button
          onClick={handleSaveAndStart}
          disabled={saving}
          className="bg-black text-white rounded px-4 py-2 disabled:opacity-60"
        >
          {saving ? "Starting…" : "Save & Start"}
        </button>
      </div>
    </main>
  );
}
