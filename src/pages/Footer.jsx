import { Link } from 'react-router'
import PocketKhata from '../assets/PocketKhata.png'

const Footer = () => {
    return (
        <footer className="landing-footer">
            <Link to="/" className="brand-lockup">
                <img className="md:w-[70px] w-[50px]" src={PocketKhata} alt="PocketKhata.png" />
                <span className="text-2xl text-white font-bold">Pocket<span className="text-yellow-400">KhaTa</span></span>
            </Link>
            <span>Thoughtfully made for small businesses.</span>
            <span>© 2026 PocketKhata</span>
        </footer>
    );
};

export default Footer;