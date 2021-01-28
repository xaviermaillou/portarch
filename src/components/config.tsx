import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import { auth } from 'firebase';
import kraken from '../kraken';

type Props = {
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

const Config: React.FC<Props> = ({ userID, username, setUsername, profilePicture, setProfilePicture, uni, setUni, pays, setPays }) => {
    const [name, setName] = useState<string>('');
    const [newUni, setNewUni] = useState<string>('');
    const [newPays, setNewPays] = useState<string>('');
    const [editName, setEditName] = useState<boolean>(false);
    const [editUni, setEditUni] = useState<boolean>(false);
    const [editPays, setEditPays] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('Elegí un nombre');
    const [errorMsgImg, setErrorMsgImg] = useState<string|undefined>();
    const [errorMsgUni, setErrorMsgUni] = useState<string|undefined>('Elegí tu universidad');
    const [errorMsgPays, setErrorMsgPays] = useState<string|undefined>('Elegí tu país');

    useEffect(() => {
        if (username) {setName(username)}
        if (uni) {setNewUni(uni)}
        if (pays) {setNewPays(pays)}
    }, [username, uni, pays]);

    useEffect(() => {
        const profilePictureDiv = document.getElementsByClassName('profilePictureGrand')[0] as HTMLElement;
        setTimeout(function(){ 
            let width = document.getElementsByClassName('lateral')[0].clientWidth;
            profilePictureDiv.style.height = width + "px";
            profilePictureDiv.style.width = width + "px";  
        }, 500);       
    }, []);

    const signOut = () => {
        firebase.auth().signOut();
        window.location.reload(true);
    }

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const handleChangeUni = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUni(e.target.value);
    }

    const handleSubmitUni = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(newUni.length < 2) {
            setNewUni('');
            setErrorMsgUni('No existe !');
            setTimeout(function(){ setErrorMsgUni('Elegí tu universidad'); }, 3000);
            return;
        }
        var user = firebase.auth().currentUser;
        if (user) {
            firebase.firestore().collection('config').doc(user.uid).update({
                uni: newUni
            });
            setEditUni(false);
            setUni(newUni);
        } else {
            return;
        }
    }

    const handleChangePays = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPays(e.target.value);
    }

    const handleSubmitPays = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(newPays.length < 2) {
            setNewPays('');
            setErrorMsgPays('No existe ese país !');
            setTimeout(function(){ setErrorMsgPays('Elegí tu país'); }, 3000);
            return;
        }
        var user = firebase.auth().currentUser;
        if (user) {
            firebase.firestore().collection('config').doc(user.uid).update({
                pays: newPays
            });
            setEditPays(false);
            setPays(newPays);
        } else {
            return;
        }
    }

    const handleSubmitName = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(name.length < 2) {
            setName('');
            setErrorMsg('Debe tener al menos 2 carácteres !');
            setTimeout(function(){ setErrorMsg('Elegí un nombre'); }, 3000);
            return;
        }
        firebase.firestore().collection('config').doc(userID).update({
            username: name
        });
        setEditName(false);
        setUsername(name);
    }

    const handleEditPhoto = () => {
        document.getElementsByName('photo')[0].click()
    }

    const handleChangePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMsgImg(undefined);
        
        if(e.target.files && auth) {
            var file = e.target.files[0];
            if(file.type !== 'image/jpeg' && file.type !== 'image/png') {
                setErrorMsgImg('Debe ser JPG o PNG !'); 
                return;
            }
            var ref = firebase.storage().ref().child('profilePicture/' + userID);
            console.log(ref);
            ref.put(file).then(function(result) {
                ref.getDownloadURL().then((url) => {
                    firebase.firestore().collection('config').doc(userID).update({
                        photoProfil: url
                    });
                    setProfilePicture(url);
                });
            });
        } else {
            return;
        }
    }

    return (
        <div className="configContainer">
            {
                (username === null || username === undefined || editName === true) &&
                <form className="signupForm" onSubmit={(e) => {handleSubmitName(e)}}>
                    <input name="username" type="text" autoComplete="off" className="editNameInput" placeholder={errorMsg} value={name} onChange={(e) => {handleChangeName(e)}} />
                </form>
            }
            {
                (username!== null && username !== undefined && editName === false) &&
                <h3 className="username">{username}<div className="edit" onClick={() => setEditName(true)}></div></h3>
            }
            <div className="profilePictureGrand" style={{backgroundImage: `url(${profilePicture})`}}>
                <div className="error">{errorMsgImg}</div>
                <div className="edit" onClick={handleEditPhoto}>EDITAR</div>
            </div>
            <form className="signupForm" style={{display: 'none'}}>
                <input name="photo" type="file" onChange={(e) => {handleChangePhoto(e)}}/>
            </form>
            {
                (uni === null || uni === undefined || editUni === true) &&
                <form className="signupForm" onSubmit={(e) => {handleSubmitUni(e)}}>
                    <input name="uni" type="text" autoComplete="off" className="editNameInput" placeholder={errorMsgUni} value={newUni} onChange={(e) => {handleChangeUni(e)}} />
                </form>
            }
            {
                (uni!== null && uni !== undefined && editUni === false) &&
                <h3 className="username">{uni}<div className="edit" onClick={() => setEditUni(true)}></div></h3>
            }

            {
                (pays === null || pays === undefined || editPays === true) &&
                <form className="signupForm" onSubmit={(e) => {handleSubmitPays(e)}}>
                    <input name="pays" type="text" autoComplete="off" className="editNameInput" placeholder={errorMsgPays} value={newPays} onChange={(e) => {handleChangePays(e)}} />
                </form>
            }
            {
                (pays!== null && pays !== undefined && editPays === false) &&
                <h3 className="username">{pays}<div className="edit" onClick={() => setEditPays(true)}></div></h3>
            }
            <button onClick={signOut}>Desconectarse</button>
        </div>
    );
}

export default Config;