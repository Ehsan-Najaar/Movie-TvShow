import { useEffect, useState } from 'react'

export const useFetchMovies = (url) => {
  const [data, setData] = useState(null)
  const [uniqu, setUniqu] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const result = await response.json()
        setUniqu(result)
        setData(result.results)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, uniqu, loading, error }
}
