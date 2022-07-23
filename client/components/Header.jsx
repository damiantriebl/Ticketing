import Link from 'next/link';
import Logo from './logo.jsx';
import Styles from './Header.module.css'

const Header = ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && {label : 'Sign In', href: '/auth/signin'},
        currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
        currentUser && { label: 'My Orders', href: '/orders' },

        currentUser && { label: 'Sign Out', href: '/auth/signout' },
    ].filter(obj => obj)
     .map (({label, href}) => {
         return (
                <li key={href} className="nav-item">
                    <Link href={href}>
                        <a className="nav-link">{label}</a>
                       </Link>    
                </li>
         )
     })
    return(
        <nav className="navegacion navbar navbar-light bg-light">
             <Link href='/'>
                <a className='nav-link'>
                    <Logo className={Styles.logo}/>
                </a>
            </Link>
            <h1>header</h1>
            <ul className="nav nav-pills">
               {links}
            </ul>    
        </nav>
    )

}
export default Header;