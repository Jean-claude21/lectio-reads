import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState } from 'react'

// Server functions run on the server, where DATABASE_URL exists. This is exactly
// what an artifact cannot do: there is no server and no place to keep a secret.
const listBooks = createServerFn({ method: 'GET' }).handler(async () => {
  const { db, schema } = await import('../db')
  return db.select().from(schema.books).orderBy(schema.books.id)
})

const addBook = createServerFn({ method: 'POST' })
  .validator((data: { title: string; author: string }) => data)
  .handler(async ({ data }) => {
    const { db, schema } = await import('../db')
    await db.insert(schema.books).values({ title: data.title, author: data.author })
  })

export const Route = createFileRoute('/')({
  component: App,
  loader: () => listBooks(),
})

function App() {
  const books = Route.useLoaderData()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !author.trim()) return
    setSaving(true)
    await addBook({ data: { title: title.trim(), author: author.trim() } })
    setTitle('')
    setAuthor('')
    setSaving(false)
    router.invalidate()
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Lectio</h1>
      <p className="mb-10 text-slate-500">A small reading list, stored in Postgres.</p>

      <form onSubmit={submit} className="mb-10 flex flex-col gap-3 sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          aria-label="Title"
          className="min-h-[44px] flex-1 rounded-lg border border-slate-300 px-4 py-2"
        />
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          aria-label="Author"
          className="min-h-[44px] flex-1 rounded-lg border border-slate-300 px-4 py-2"
        />
        <button
          type="submit"
          disabled={saving}
          className="min-h-[44px] rounded-lg bg-slate-900 px-6 font-medium text-white disabled:opacity-50"
        >
          {saving ? 'Adding...' : 'Add'}
        </button>
      </form>

      {books.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No books yet. Add the first one above.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200">
          {books.map((b) => (
            <li key={b.id} className="flex items-baseline justify-between py-3">
              <span className="font-medium">{b.title}</span>
              <span className="text-sm text-slate-500">{b.author}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-12 text-xs text-slate-400">
        {books.length} book{books.length === 1 ? '' : 's'} in the database
      </p>
    </main>
  )
}
