import { useEffect, useState, type FormEvent } from 'react'
import { deleteProduct, searchProducts } from '../api/products'
import ErrorAlert from '../components/ErrorAlert'
import ProductForm from '../components/ProductForm'
import type { PagedResult, Product } from '../types'

const PAGE_SIZE = 10

interface Search {
  name: string
  minPrice: string
  maxPrice: string
  page: number
}

const initialSearch: Search = { name: '', minPrice: '', maxPrice: '', page: 1 }

export default function ProductsPage() {
  const [form, setForm] = useState(initialSearch)
  const [search, setSearch] = useState(initialSearch)
  const [result, setResult] = useState<PagedResult<Product>>()
  const [error, setError] = useState<unknown>()
  const [editing, setEditing] = useState<Product>()
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    let ignore = false
    searchProducts({
      name: search.name.trim() || undefined,
      minPrice: search.minPrice === '' ? undefined : Number(search.minPrice),
      maxPrice: search.maxPrice === '' ? undefined : Number(search.maxPrice),
      page: search.page,
      pageSize: PAGE_SIZE,
    })
      .then((data) => { if (!ignore) { setResult(data); setError(undefined) } })
      .catch((err: unknown) => { if (!ignore) setError(err) })
    return () => { ignore = true }
  }, [search])

  const reload = () => setSearch((current) => ({ ...current }))
  const totalPages = result ? Math.max(1, Math.ceil(result.totalCount / PAGE_SIZE)) : 1

  function handleSearch(event: FormEvent) {
    event.preventDefault()
    setSearch({ ...form, page: 1 })
  }

  function handleSaved() {
    setEditing(undefined)
    setFormKey((key) => key + 1) // remount the form so it clears
    reload()
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"?`)) return
    try {
      await deleteProduct(product.id)
      if (editing?.id === product.id) setEditing(undefined)
      // Go back a page when the last item on the page was deleted.
      if (result?.items.length === 1 && search.page > 1) setSearch({ ...search, page: search.page - 1 })
      else reload()
    } catch (err) {
      setError(err)
    }
  }

  return (
    <>
      <ProductForm
        key={editing ? `edit-${editing.id}` : `new-${formKey}`}
        product={editing}
        onSaved={handleSaved}
        onCancel={() => setEditing(undefined)}
      />

      <form className="row g-2 mb-3" onSubmit={handleSearch}>
        <div className="col-md-5">
          <input className="form-control" placeholder="Search by name" maxLength={100}
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="col-md-2">
          <input className="form-control" type="number" min="0" step="0.01" placeholder="Min price"
            value={form.minPrice} onChange={(e) => setForm({ ...form, minPrice: e.target.value })} />
        </div>
        <div className="col-md-2">
          <input className="form-control" type="number" min="0" step="0.01" placeholder="Max price"
            value={form.maxPrice} onChange={(e) => setForm({ ...form, maxPrice: e.target.value })} />
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-outline-primary w-100">Search</button>
        </div>
      </form>

      <ErrorAlert error={error} />

      <table className="table align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th className="text-end">Price</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {!result ? (
            <tr><td colSpan={4} className="text-center text-muted">Loading...</td></tr>
          ) : result.items.length === 0 ? (
            <tr><td colSpan={4} className="text-center text-muted">No products found.</td></tr>
          ) : result.items.map((product) => (
            <tr key={product.id} className={editing?.id === product.id ? 'table-active' : undefined}>
              <td>{product.name}</td>
              <td className="text-muted">{product.description}</td>
              <td className="text-end">{product.price.toFixed(2)}</td>
              <td className="text-end text-nowrap">
                <button className="btn btn-sm btn-link" onClick={() => setEditing(product)}>Edit</button>
                <button className="btn btn-sm btn-link text-danger" onClick={() => handleDelete(product)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {result && totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3">
          <button className="btn btn-sm btn-outline-secondary" disabled={search.page <= 1}
            onClick={() => setSearch({ ...search, page: search.page - 1 })}>Previous</button>
          <span>Page {search.page} of {totalPages}</span>
          <button className="btn btn-sm btn-outline-secondary" disabled={search.page >= totalPages}
            onClick={() => setSearch({ ...search, page: search.page + 1 })}>Next</button>
        </div>
      )}
    </>
  )
}
