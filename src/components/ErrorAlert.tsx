export default function ErrorAlert({ error }: { error: unknown }) {
  if (!error) return null
  const message = error instanceof Error ? error.message : 'Something went wrong.'
  return <div className="alert alert-danger" role="alert">{message}</div>
}
