import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Projet from './projet';

type Props = {
    userID: string,
    username: string,
    refresh: boolean,
    setRefresh: any,
    mesœuvres: any
}

const Ajouter: React.FC<Props> = ({ userID, username, refresh, setRefresh, mesœuvres}) => {
    const [œuvre, setœuvre] = useState({
        auteurID: userID,
        note: 0,
        titre: '' as String,
        photo: '',
        description: '',
        keywords: username?.toLowerCase().split(' ')
    });
    const [randomId] = useState<string>(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    const [photoPrincipale, setPhotoPrincipale] = useState<string>('https://firebasestorage.googleapis.com/v0/b/portarch-4f70e.appspot.com/o/icônes%2Fplus2.png?alt=media&token=7cf0f025-0bb6-465b-958e-ea081cb31696');
    const [photosSecondaires, setPhotosSecondaires] = useState<any>([]);
    const [maxFiles, setMaxFiles] = useState<number>(6);
    const [maxChars, setMaxChars] = useState<number>();
    const [agregado, setAgregado] = useState<string>('');
    const [width, setWidth] = useState<number>(0);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [errorMsgSec, setErrorMsgSec] = useState<string>('');

    useEffect(() => {
        document.getElementsByClassName('lateral')[0].classList.add('ouvert');
        setWidth(document.getElementsByClassName('lateral')[0].clientWidth);
    }, []);

    useEffect(() => {
        if(mesœuvres.length === 3) { return; }
        if(mesœuvres.length < 1) {
            setAgregado('AGREGAR'); 
            document.getElementsByClassName('addForm')[0].classList.remove('ferme');
        }
        else {
            setTimeout(function(){ 
                setAgregado('AGREGAR');
                document.getElementsByClassName('addForm')[0].classList.remove('ferme');
            }, 500); 
        }      
    }, [mesœuvres.length]);

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newœuvre = {...œuvre};
        newœuvre.titre = e.target.value.toLowerCase();
        setœuvre(newœuvre);
    }

    const handleEditPhoto = () => {
        document.getElementsByName('photo')[0].click()
    }

    const handleEditPhotos = () => {
        document.getElementsByName('photo2')[0].click();
    }

    const handleChangePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {   
        setErrorMsg('');    
        const loadingIcon = document.getElementsByClassName('loadingIcon')[0] as HTMLElement;
        loadingIcon.classList.add('ouvert');
        const mainPic = document.getElementsByClassName('mainPictureForm')[0] as HTMLElement; 
        if(e.target.files) {
            var file = e.target.files[0];
            if(file.type !== 'image/jpeg' && file.type !== 'image/png') {
                setErrorMsg('Debe ser JPG o PNG !');
                return;
            }
            var ref = firebase.storage().ref('œuvres-photos-principales/' + file.name);
            var task = ref.put(file);
            task.on('state_changed', function(snapshot) {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
                if(percentage === 100) {
                    setTimeout(function() {
                        ref.getDownloadURL().then((url) => {
                            loadingIcon.classList.remove('ouvert');
                            mainPic.classList.add('uploaded');
                            setPhotoPrincipale(url);
                            const newœuvre = {...œuvre};
                            newœuvre.photo = url;
                            setœuvre(newœuvre);
                        });
                    }, 1000);
                }
            });
        } else {
            return;
        }
    }

    const HandleChangePhotosSecondaires = (e: React.ChangeEvent<HTMLInputElement>) => {  
        setErrorMsgSec(''); 
        const loadingIcon = document.getElementsByClassName('loadingIcon')[1] as HTMLElement;
        loadingIcon.classList.add('ouvert');
        if(e.target.files) {
            var temp: any[] = [];
            var files = Array.from(e.target.files);
            var quantity = e.target.files.length;
            const originalQuantity = e.target.files.length;
            if(maxFiles - quantity < 0) { 
                setErrorMsgSec('6 máximo !');
                loadingIcon.classList.remove('ouvert');
                return; 
            }
            files.forEach((file) => {
                if(file.type !== 'image/jpeg' && file.type !== 'image/png') {
                    setErrorMsgSec('Debe ser JPG o PNG !');
                    loadingIcon.classList.remove('ouvert');
                    return;
                }
                var ref = firebase.storage().ref('œuvres-photos-secondaires/' + file.name);
                ref.put(file).then((result) => {
                    ref.getDownloadURL().then((url) => {
                        firebase.firestore().collection('photos').add({
                            url: url,
                            œuvre: randomId
                        });
                        temp.push(url);
                        quantity = quantity - 1;
                        if (quantity === 0) {
                            setMaxFiles(maxFiles - originalQuantity);
                            var temp2 = [...photosSecondaires];
                            loadingIcon.classList.remove('ouvert');
                            setPhotosSecondaires(temp2.concat(temp));
                        }
                    });
                });
            });
        } else {
            return;
        }
    }

    const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMaxChars(280 - e.target.value.length);
        const newœuvre = {...œuvre};
        newœuvre.description = e.target.value;
        setœuvre(newœuvre);
        const ind = document.getElementsByClassName('maxChars')[0] as HTMLElement;
        if(e.target.value.length >= 130) {
            ind.style.color = 'red';
        } else {
            ind.style.color = 'grey';
        }
    }

    const handleFutureDelete = (e: React.MouseEvent<HTMLElement>) => {
        e.currentTarget.querySelector('.delete')?.classList.toggle('ouvert');
    }

    const handlePhotoSecondaireDelete = (e: React.MouseEvent<HTMLElement>, i: number) => {
        const temp = [...photosSecondaires];
        temp.splice(i, 1);
        setPhotosSecondaires(temp);
        setMaxFiles(maxFiles - 1);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const œuvrefinale = {...œuvre}
        œuvrefinale.keywords = œuvrefinale.keywords?.concat(œuvrefinale.titre.toLowerCase().split(' '));
        if(œuvrefinale.photo === '' || œuvrefinale.titre === '') { return; }
        firebase.firestore().collection('œuvres').doc(randomId).set(œuvrefinale);
        const form = document.getElementsByClassName('addForm')[0] as HTMLFormElement;
        const mainPic = document.getElementsByClassName("mainPictureForm")[0] as HTMLElement;
        if(mesœuvres.length === 2) { return; }
        setTimeout(function () {
            form.reset();
            form.classList.add('ferme');
            mainPic.style.backgroundImage = 'none';
            mainPic.classList.remove('uploaded');
            setAgregado('AGREGADO !');
        }, 500);
        setTimeout(function () {
            setAgregado('AGREGAR');
            form?.classList.remove('ferme');
            mainPic.style.backgroundImage = 'url("https://firebasestorage.googleapis.com/v0/b/portarch-4f70e.appspot.com/o/icônes%2Fplus2.png?alt=media&token=7cf0f025-0bb6-465b-958e-ea081cb31696")';
        }, 3000);
    }

    return (
        <div className="lateral ajouterContainer">
            <h2>MIS PROYECTOS</h2>
            <div className="œuvresContainer">
                {mesœuvres.map((œuvre: any) => <Projet 
                                                    refresh={refresh}
                                                    setRefresh={setRefresh}
                                                    key={œuvre.id} 
                                                    id={œuvre.id} 
                                                    titre={œuvre.titre} 
                                                    photo={œuvre.photo}
                                                    description={œuvre.description}
                                                    username={username}
                                                />)}
                <br />
                {mesœuvres.length < 3 &&
                    <div>
                        <h3>{agregado}</h3>
                        <strong className="remain">Te queda{mesœuvres < 2 && 'n'} {3 - mesœuvres.length} más</strong>
                        <form className="signupForm addForm ferme" onSubmit={(e) => handleSubmit(e)} >
                            <label>Título</label>
                            <input type="text" onChange={(e) => handleChangeTitle(e)} />
                            <label>Imágen principal<i className="loadingIcon"></i> <strong className="error">{errorMsg}</strong></label>
                            <input style={{display: 'none'}} name="photo" type="file" onChange={(e) => {handleChangePhoto(e)}} multiple={false} />
                            <div className="mainPictureForm" style={{backgroundImage: `url(${photoPrincipale})`, height: width + 'px'}}><div className="edit" onClick={handleEditPhoto}>EDITAR</div></div>
                            <input style={{display: 'none'}} name="photo2" type="file" onChange={(e) => {HandleChangePhotosSecondaires(e)}} multiple />
                            <label>Imágenes suplementarias<i className="loadingIcon"></i>  <strong className="error">{errorMsgSec}</strong></label>
                            <div className="secondaryPicturesContainer">
                                {photosSecondaires.map((photoSecondaire: any, index: any) => 
                                    <div 
                                        key={photoSecondaire} 
                                        onClick={(e) => handleFutureDelete(e)}
                                        className="secondaryPictures" 
                                        style={{backgroundImage: `url(${photoSecondaire})`,height: width/3.3 + 'px', width: width/3.3 + 'px'}}
                                    >
                                        <div className="delete" onClick={(e) => handlePhotoSecondaireDelete(e, index as number)}></div>
                                    </div>
                                )}
                                {photosSecondaires.length < 6 &&
                                    <div className="secondaryPicturesForm" style={{height: width/3.3 + 'px', width: width/3.3 + 'px'}} onClick={handleEditPhotos}></div>
                                }
                            </div>
                            <label>Memoria <strong className="error maxChars">{maxChars}</strong></label>
                            <textarea rows={4} maxLength={280} onChange={(e) => handleTextArea(e)}></textarea>
                            <input type="submit" />
                        </form>
                    </div>
                }    
            </div>
        </div>
    );
}

export default Ajouter;