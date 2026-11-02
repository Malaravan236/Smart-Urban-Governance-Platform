import { useCallback, useEffect, useState } from 'react'
import { listIssues } from '../services/issueService'

export default function useIssues(filters, page) {
  const [data, setData] = useState({ results: [], count: 0, next: null, previous: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setData(await listIssues({ ...filters, page }))
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters), page])

  useEffect(() => { load() }, [load])
  return { ...data, loading, error, reload: load }
}