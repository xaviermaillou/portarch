import React, { useState, useEffect } from 'react';
import Panneau from './components/panneau'
import Menu from './components/menu';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Hamburger from './components/hamburger';
import Auteur from './components/auteur';

function Useœuvres() {
    const [œuvres, setœuvres] = useState<any>([]);

    useEffect(() => {
        firebase.firestore().collection('œuvres').onSnapshot((snapshot) => {
            const newœuvres = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                photos: [] as any
            }));
    
            setœuvres(newœuvres);
        });
    }, []);

    return œuvres;
}

function UseMesœuvres() {
    const [mesœuvres, setMesœuvres] = useState<any>([]);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                firebase.firestore().collection('œuvres').where('auteurID', '==', user.uid).onSnapshot((snapshot) => {
                    const newMesœuvres = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    setMesœuvres(newMesœuvres);
                });
            } else {
            return;
            }
        });
    }, []);

    return mesœuvres;
}

function UseMesFavoris() {
    const [mesFavoris, setMesfavoris] = useState<any>([]);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            if(user) {
                firebase.firestore().collection('favoris').where('utilisateur', '==', user.uid).onSnapshot((snapshot) => {
                    const newMesFavoris = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    setMesfavoris(newMesFavoris);
                });
            } else {
                return;
            }
        });
    }, []);

    return mesFavoris;
}
  
const App: React.FC = () => {

    const [refresh, setRefresh] = useState<boolean>(false);
    const [auth, setAuth] = useState<boolean>(false);
    const [userID, setUserID] = useState<string>('');
    const [username, setUsername] = useState<string|null|undefined>();
    const [profilePicture, setProfilePicture] = useState<string|null|undefined>();
    const [uni, setUni] = useState<string|null|undefined>();
    const [pays, setPays] = useState<string|null|undefined>();
    const œuvres = Useœuvres();
    const mesœuvres = UseMesœuvres();
    const mesFavoris = UseMesFavoris();
    const [margin, setMargin] = useState<string>('0px');
    const [currentAuteur, setCurrentAuteur] = useState<string>(œuvres[0]?.auteurID);
    const [currentŒuvre, setCurrentŒuvre] = useState<string>(œuvres[0]?.id);

    useEffect(() => {
        if(window.screen.width <= 600) {
            setMargin((window.screen.height - window.screen.width) / 2 + 'px');     
        }
    }, []);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              setAuth(true);
              setUserID(user.uid);
              firebase.firestore().collection('config').doc(user.uid).onSnapshot((snapshot) => {
                    setUsername(snapshot.data()?.username);
                    snapshot.data()?.photoProfil ? setProfilePicture(user.photoURL) : setProfilePicture('https://firebasestorage.googleapis.com/v0/b/portarch-4f70e.appspot.com/o/icônes%2Fprofil2.png?alt=media&token=0f86a5d5-f039-42af-89fc-4f915f10a3d5');
                    setUni(snapshot.data()?.uni);
                    setPays(snapshot.data()?.pays)
              });
            } else {
              setAuth(false)
            }
        });
    }, []);

    const reload = () => {
        window.location.reload(true);
    }
    
 return (
    <div>
        <h1 onClick={reload}>PORTARCH</h1>
        <Hamburger />
        <Menu 
            refresh={refresh}
            setRefresh={setRefresh}
            mesœuvres={mesœuvres} 
            auth={auth} 
            userID={userID}
            username={username as string} 
            setUsername={setUsername} 
            profilePicture={profilePicture} 
            setProfilePicture={setProfilePicture} 
            uni={uni}
            setUni={setUni}
            pays={pays}
            setPays={setPays}
        />
        <div className="masterDIV">
            <div className="panneauContainer" style={{paddingTop: `${margin}`, paddingBottom: `${margin}`}}>
                {œuvres.map((œuvre: any) => <Panneau 
                                                key={œuvre.id} 
                                                refresh={refresh}
                                                setRefresh={setRefresh}
                                                auth={auth} 
                                                id={œuvre.id} 
                                                titre={œuvre.titre} 
                                                auteurID={œuvre.auteurID} 
                                                photo={œuvre.photo} 
                                                description={œuvre.description}
                                                mesFavoris={mesFavoris}
                                                setCurrentAuteur={setCurrentAuteur}
                                                setCurrentŒuvre= {setCurrentŒuvre}
                                            />)}
            </div>
            <div className="slideAuteur">
                <Auteur 
                    enableAuteur={true}
                    auteurID={currentAuteur}
                    id={currentŒuvre}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    auth={auth} 
                    mesFavoris={mesFavoris}
                />
            </div>
        </div>
    </div>
 )
}
  
export default App;