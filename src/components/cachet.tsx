import React, { useState, useEffect } from 'react';
import './css/cachet.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

type Props = {
    refresh: boolean,
    setRefresh: any,
    auth: boolean,
    id: string,
    titre: string,
    isFavori: boolean
}

const Cachet: React.FC<Props> = ({ refresh, setRefresh, auth, id, titre, isFavori }) => {

    const userID = firebase.auth().currentUser?.uid;
    const [note, setNote] = useState<number>(0);

    useEffect(() => {
        firebase.firestore().collection('œuvres').doc(id).onSnapshot((snapshot) => {
            setNote(snapshot.data()?.note);
        });
    }, [id, isFavori]);

    const addFavorite = () => {
        if(isFavori) {
            firebase.firestore().collection('favoris').doc(userID+id).delete();
            setRefresh(!refresh);
            console.log('Favori supprimé !');
            firebase.firestore().collection('œuvres').doc(id).update({
                note: note-1
            });
            return;
        } else if(!isFavori) {
            firebase.firestore().collection('favoris').doc(userID+id).set({
                favori: id,
                utilisateur: userID
            });
            setRefresh(!refresh);
            console.log('Favori ajouté !');
            firebase.firestore().collection('œuvres').doc(id).update({
                note: note+1
            });
        }
    }

    return (
        <div className="cachetContainer">
            <div className="info">
                <h3>{titre}</h3>
            </div>
            <div className="star"><div id={id + "Star"} style={{opacity: isFavori ? '1' : '0.25', display: auth ? 'inline-block' : 'none'}} className="starIMG" onClick={addFavorite}></div></div>
        </div>
    );
}

export default Cachet;