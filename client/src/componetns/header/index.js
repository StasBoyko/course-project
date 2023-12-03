import { Link } from "react-router-dom";

import './header.css'
import { useUserStore } from "../../store";

export const Header=()=>{
    const {isAuth,user}=useUserStore()

    return(
        <div className='header'>
            <div className="header-conteiner">
                <div className='header_row'>
                    <div className='logo'>
                        {isAuth?<Link to={'/'}><p className="stylish-link">main</p></Link>:<></>}          
                    </div>
                    <div className='links'>
                        <Link to={'/login'}>
                            <p className="stylish-link">{isAuth?user.username:'login'}</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}