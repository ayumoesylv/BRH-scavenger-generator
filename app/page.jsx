import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-3xl font-bold">Campus Scavenger Hunt</h1>

        <section className="bg-white border rounded-2xl shadow-sm text-left p-5 space-y-2">
          <h2 className="font-semibold">How to Play!</h2>
          <ol className="list-decimal pl-6 space-y-1 text-sm">
            <li>Choose the location you want to scavenge at</li>
            <li>Enter in the number of people playing</li>
            <li>Assign one person to look over the clues to make sure everything is ready</li>
            <li>Hit next and start your scavenge!</li>
            <h2 className="font-semibold">Happy Scavenging!</h2>
          </ol>
        </section>

        <Link
          href="/generate"
          className="inline-block bg-black text-white px-8 py-4 rounded-2xl text-lg"
        >
          Play
        </Link>
      </div>
    </main>
  );
}
