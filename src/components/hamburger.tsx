import React from 'react';
import './css/menu.css';

const Hamburger: React.FC = () => {
    const clickHamburger = () => {
        document.getElementsByClassName('menuContainer')[0].classList.toggle('ouvertMobile');
        document.getElementsByClassName('hamburger')[0].classList.toggle('ouvert');
        document.getElementsByTagName('h1')[0].classList.toggle('ouvert');
    }

    return(
        <div className="hamburger" onClick={clickHamburger}></div>
    );
}

export default Hamburger;