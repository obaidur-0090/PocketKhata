import { useEffect } from 'react'

export default function PageTitle({ title }) {
  useEffect(() => {
    document.title = `${title} · PocketKhata`
  }, [title])
  return null
}
