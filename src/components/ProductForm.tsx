import { useState, type FormEvent } from 'react'
import { ApiError } from '../api/client'
import { createProduct, updateProduct } from '../api/products'
import type { Product } from '../types'
import ErrorAlert from './ErrorAlert'

interface Props {
  product?: Product
  onSaved: () => void
  onCancel: () => void
}

export default function ProductForm({ product, onSaved, onCancel }: Props) {
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product ? String(product.price) : '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<unknown>()

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(undefined)
    try {
      const input = { name, description, price: Number(price) }
      if (product) await updateProduct(product.id, input)
      else await createProduct(input)
      onSaved()
    } catch (err) {
      setError(err)
    } finally {
      setSaving(false)
    }
  }

  // Show the first server validation message (e.g. "The Name field is required.") when there is one.
  const fieldError = error instanceof ApiError && error.problem?.errors
    ? new Error(Object.values(error.problem.errors)[0]?.[0])
    : error

  return (
    <form className="card card-body mb-4" onSubmit={handleSubmit}>
      <h2 className="h5">{product ? `Edit "${product.name}"` : 'Add product'}</h2>
      <ErrorAlert error={fieldError} />
      <div className="row g-2">
        <div className="col-md-4">
          <input className="form-control" placeholder="Name" required maxLength={100}
            value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Price" type="number" required min="0.01" max="1000000" step="0.01"
            value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="col-md-4">
          <input className="form-control" placeholder="Description (optional)" maxLength={1000}
            value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="col-md-2 d-flex gap-2">
          <button type="submit" className="btn btn-primary flex-fill" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          {product && <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>}
        </div>
      </div>
    </form>
  )
}
