import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

function App() {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      delay: 0,
      once: true,
      offset: 100,
      easing: 'ease-in-out',
    })
  }, [])

  return (
    <>
     <div>
        
     </div>
    </>
  )
}

export default App