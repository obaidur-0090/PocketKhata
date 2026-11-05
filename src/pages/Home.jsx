import PageTitle from '../components/PageTitle'
import Navber from '../components/Navber'
import Footer from './Footer';
import HomeHerosection from './HomeHerosection';
export default function Home() {
  return (
    <div className="landing-page">
      <PageTitle title="Digital khata for your business" />
      <Navber />
      <HomeHerosection></HomeHerosection>
      <Footer></Footer>
    </div>
  )
}


