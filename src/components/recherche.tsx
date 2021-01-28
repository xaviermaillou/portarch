import React, { useState, useEffect } from 'react';
import Tendance from './tendance';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

function UseTendances() {
    const [œuvres, setœuvres] = useState<any>([]);

    useEffect(() => {
        firebase.firestore().collection('œuvres').orderBy('note', 'desc').limit(6).onSnapshot((snapshot) => {
            let position = 1;
            const newœuvres = snapshot.docs.map((doc) => ({
                id: doc.id,
                position: position++,
                ...doc.data(),
                photos: [] as any
            }));
    
            setœuvres(newœuvres);
        });
    }, []);

    return œuvres;
}

const Recherche: React.FC = () => {
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [resultats, setResultats] = useState<any>([]);
    const tendances = UseTendances();

    useEffect(() => {
        document.getElementsByClassName('lateral')[0].classList.add('ouvert');
    }, []);

    const handleFocus = () => {
        document.getElementsByClassName('iconeOK')[0].classList.add('ouvert');
    }

    const handleBlur = () => {
        document.getElementsByClassName('iconeOK')[0].classList.remove('ouvert');
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSearching(true);

        firebase.firestore().collection('œuvres').where('keywords', 'array-contains-any', search.toLowerCase().split(" ")).orderBy('note', 'desc').onSnapshot((snapshot) => {
            let position = 1;
            const newResultats = snapshot.docs.map((doc) => ({
                id: doc.id,
                position: position++,
                ...doc.data()
            }));
            setResultats(newResultats);
        });
    }

    const handleCancel = () => {
        setSearch('');
        setIsSearching(false);
    }

    return (
        <div className="lateral rechercheContainer">
            <h2>
                <form onSubmit={(e) => handleSearch(e)}><input onFocus={handleFocus} onBlur={handleBlur} type="text" value={search} placeholder="Palabras claves..." onChange={(e) => handleChange(e)} /><input className="iconeOK" type="submit" value="OK" /></form>
                <div>BUSCAR</div>
            </h2>
            {isSearching &&
                <div>
                    <h3>RESULTADOS<div onClick={handleCancel}></div></h3>
                    <div className="tendencesContainer">
                        {resultats.map((resultat: any) => <Tendance 
                                                            key={resultat.id}
                                                            id={resultat.id}
                                                            position={resultat.position}
                                                            titre={resultat.titre}
                                                            photo={resultat.photo}
                                                        />)}
                    </div>
                </div>
            }
            {!isSearching &&
                <div>
                    <h3>TENDENCIAS</h3>
                    <div className="tendancesContainer">
                        {Object.keys(tendances).length === 0 && <div><Tendance /><Tendance /><Tendance /><Tendance /><Tendance /></div>}
                        {tendances.map((tendance: any) => <Tendance 
                                                            key={tendance.id} 
                                                            id={tendance.id}
                                                            position={tendance.position} 
                                                            titre={tendance.titre} 
                                                            photo={tendance.photo} 
                                                        />)}
                    </div>
                </div>
            }
        </div>
    );
}

export default Recherche;