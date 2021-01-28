import React, { useState, useEffect } from 'react';
import './css/auteur.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Panneau from './panneau';

type Props = {
    enableAuteur: boolean,
    auteurID?: string,
    id?: string,
    refresh: boolean,
    setRefresh: any,
    auth: boolean,
    mesFavoris?: any
}

const Auteur: React.FC<Props> = ({ enableAuteur, auteurID = '0', id = '0', refresh, setRefresh, auth, mesFavoris }) => {

    useEffect(() => {
        if(enableAuteur) {
            document.getElementById("auteurContainer" + id)?.classList.add('ouvert');
        }
    }, [enableAuteur, id]);

    function UseAuteur() {
        const [auteurObject, setAuteurObject] = useState<any>([]);

        useEffect(() => {
            if(enableAuteur) {
                firebase.firestore().collection('config').doc(auteurID).onSnapshot((snapshot) => {
                    setAuteurObject(snapshot.data());
                });
            }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [enableAuteur, auteurID]);

        return auteurObject;
    }
    
    function UseSesœuvres() {
        const [sesœuvres, setSesœuvres] = useState<any>([]);
    
        useEffect(() => {
            if(enableAuteur) {
                firebase.firestore().collection('œuvres').where('auteurID', '==', auteurID).onSnapshot((snapshot) => {
                    const newSesœuvres = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }));
    
                    setSesœuvres(newSesœuvres);
                });
            }         
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [enableAuteur, auteurID]);
    
        return sesœuvres;
    }

    const sesœuvres = UseSesœuvres();
    const auteurObject = UseAuteur();

    return(
        <div className="auteurContainer" id={"auteurContainer" + id}>
            <div className="infoAuteur" style={{height: window.innerWidth / 3.1}}>
                <div className="auteurPhoto" style={{backgroundImage: `url(${auteurObject?.photoProfil})`}}></div>
                <div className="dataAuteur">
                    <h2>{auteurObject?.username}</h2>
                    <div id="uni" className="icone"></div> {auteurObject?.uni}<br />
                    <div id="pin" className="icone"></div> {auteurObject?.pays}
                </div>
            </div>
            {enableAuteur && sesœuvres.map((œuvre: any) => <Panneau 
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
                                                                portfolio={true}
                                                                originalID={id?.slice(-10)}
                                                            />)}
        </div>
    );
}

export default Auteur;