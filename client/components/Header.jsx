import Link from 'next/link';
const Header = ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && {label : 'Sign In', href: '/auth/signin'},
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
        <nav className="navbar navbar-light bg-light">
            
            <h1>header</h1>
            <ul className="nav nav-pills">
               {links}
            </ul>    
        </nav>
    )

}
export default Header;