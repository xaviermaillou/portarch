import React, { useState } from 'react';
import './css/menu.css';
import Recherche from './recherche';
import Ajouter from './ajouter';
import Profil from './profil';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

type Props = {
    refresh: boolean,
    setRefresh: any,
    mesœuvres: any,
    auth: boolean,
    userID: string,
    username: string,
    profilePicture: string|null|undefined,
    setUsername: any,
    setProfilePicture: any,
    uni: string|null|undefined,
    setUni: any,
    pays: string|null|undefined,
    setPays: any
}

const Menu: React.FC<Props> = ({ refresh, setRefresh, mesœuvres, auth, userID, username, setUsername, profilePicture, setProfilePicture, uni, setUni, pays, setPays }) => {

    const [menu, setMenu] = useState<number>(0);

    /* document.body.addEventListener("click", (e: MouseEvent) => {
        console.log((e.target as Element).contains((div as Element)));
    }); */

    const clickMenu = (menu: number) => {
        document.getElementsByClassName('menuContainer')[0].classList.add('ouvert');
        document.getElementsByClassName('fermerMenu')[0].classList.remove('ferme');
        setMenu(menu);
    }

    const fermerMenu = () => {
        document.getElementsByClassName('menuContainer')[0].classList.remove('ouvert');
        document.getElementsByClassName('fermerMenu')[0].classList.add('ferme');
        // setMenu(0);
    }

    const handleClickAway = () => {fermerMenu()}

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div className="menuContainer">
                <div className="fermerMenu" onClick={fermerMenu}>
                    <div className="fermerIcone"></div>
                </div>
                {menu === 0 && <div className="lateralVide">
                                    <div className="mobileTutorial">
                                        <span onClick={() => {clickMenu(1)}}>BUSCAR</span>
                                        <span onClick={() => {clickMenu(2)}}>MIS PROYECTOS</span>
                                        <span onClick={() => {clickMenu(3)}}>PERFIL</span>
                                    </div>
                                </div>}

                {menu === 1 && <Recherche />}

                {menu === 2 && <Ajouter 
                                    userID={userID} 
                                    username={username} 
                                    refresh={refresh}
                                    setRefresh={setRefresh} 
                                    mesœuvres={mesœuvres} 
                                />}

                {menu === 3 && <Profil 
                                    auth={auth} 
                                    userID={userID}
                                    username={username} 
                                    setUsername={setUsername} 
                                    profilePicture={profilePicture} 
                                    setProfilePicture={setProfilePicture} 
                                    uni={uni}
                                    setUni={setUni}
                                    pays={pays}
                                    setPays={setPays}
                                />}
                <div className="iconesContainer">
                    <div className="icone chercher" onClick={() => {clickMenu(1)}}></div>
                    <div className="icone ajouter" onClick={() => {clickMenu(2)}}></div>
                    <div className="icone profil" onClick={() => {clickMenu(3)}}></div>
                </div>
            </div>
        </ClickAwayListener>
    );
}

export default Menu;