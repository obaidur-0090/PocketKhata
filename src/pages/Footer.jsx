import { Link } from 'react-router'
import PocketKhata from '../assets/PocketKhata.png'

const Footer = () => {
    return (
        <div>
            <footer className="landing-footer"><Link to="/" className="brand-lockup"><img className='md:w-[70px] w-[50px]'  src={PocketKhata} alt="" /><span>Pocket<span className="brand-accent">Khata</span></span></Link><span>Thoughtfully made for small businesses.</span><span>© 2026 PocketKhata</span></footer>
        </div>
    );
};

export default Footer;