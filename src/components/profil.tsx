import React, { useEffect } from 'react';
import SignUpForm from './signupForm';
import Config from './config';
import SignInForm from './signinForm';

type Props = {
    auth: boolean,
    userID: string,
    username: string|null|undefined,
    profilePicture: string|null|undefined,
    setUsername: any,
    setProfilePicture: any,
    uni: string|null|undefined,
    setUni: any,
    pays: string|null|undefined,
    setPays: any
}

const Profil: React.FC<Props> = ({ auth, userID, username, setUsername, profilePicture, setProfilePicture, uni, setUni, pays, setPays }) => {

    useEffect(() => {
        document.getElementsByClassName('lateral')[0].classList.add('ouvert');
    }, []);

    return (
        <div className="lateral profilContainer">
            <h2>PERFIL</h2>
            {auth ? <Config 
                        userID={userID}
                        username={username} 
                        setUsername={setUsername} 
                        profilePicture={profilePicture} 
                        setProfilePicture={setProfilePicture}
                        uni={uni}
                        setUni={setUni}
                        pays={pays}
                        setPays={setPays} 
                    /> : <div><SignInForm /><SignUpForm setUsername={setUsername} /></div>}
        </div>
    );
}

export default Profil;