import { Link } from 'react-router'
import PageTitle from '../components/PageTitle'
import Navber from '../components/Navber'
import PocketKhata from '../assets/PocketKhata.png'
export default function Home() {
  return (
    <div className="landing-page">
      <PageTitle title="Digital khata for your business" />
      <Navber />
      <footer className="landing-footer"><Link to="/" className="brand-lockup"><img className='md:w-[70px] w-[50px]'  src={PocketKhata} alt="" /><span>Pocket<span className="brand-accent">Khata</span></span></Link><span>Thoughtfully made for small businesses.</span><span>© 2026 PocketKhata</span></footer>
    </div>
  )
}


