import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

type Props = {
    refresh: boolean,
    setRefresh: any,
    id: string,
    titre?: string,
    photo?: string,
    description?: string
    username: string,
}

const Projet: React.FC<Props> = ({ refresh, setRefresh, id, titre, photo, description, username }) => {
    const [enableEdit, setEnableEdit] = useState<boolean>(false);
    const [editTitre, setEditTitre] = useState<boolean>(false);
    const [editedTitre, setEditedTitre] = useState<string>();
    const [editDescription, setEditDescription] = useState<boolean>(false);
    const [editedDescription, setEditedDescription] = useState<string>();
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [width, setWidth] = useState<number>(0);
    const [photos, setPhotos] = useState<any>([]);
    const [maxFiles, setMaxFiles] = useState<number>(6);
    const [error, setError] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [projet, setProjet] = useState<any>();

    useEffect(() => {
        setProjet(document.getElementById('mon' + id) as HTMLElement);
        setEditedTitre(titre);
        setEditedDescription(description);
        setWidth(document.getElementsByClassName('lateral')[0].clientWidth);
        if (projet) {
            setTimeout(function() {
                projet.style.height = width + 'px';
                projet.style.width = width + 'px';
            }, 500);
        }

        firebase.firestore().collection('photos').where('œuvre', '==', id).onSnapshot((snapshot) => {
            const newPhotos = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            setPhotos(newPhotos);
        });
    }, [id, titre, description, width, projet]);

    const handleEdit = (e: React.MouseEvent<HTMLElement>) => {
        if(!enableEdit)
        {
            projet.style.height = width * 1.3 + 'px';
            e.currentTarget.querySelector('.edit')?.classList.add('ouvert');
            setEnableEdit(true);
        }
    }

    const handleChangeTitre = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTitre(e.target.value);
    }

    const handleSubmitTitre = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        firebase.firestore().collection('œuvres').doc(id).update({
            titre: editedTitre
        });
        const usernameKeywords = username.toLowerCase().split(' ');
        const titleKeywords = editedTitre?.toLowerCase().split(' ');
        firebase.firestore().collection('œuvres').doc(id).update({
            keywords: titleKeywords?.concat(usernameKeywords)
        });
        setEditTitre(false);
        setRefresh(!refresh);
    }

    const handleChangePhotoPrincipale = (e: React.ChangeEvent<HTMLInputElement>) => {
        const loadingIcon = document.getElementById('premierLoadingIcon' + id) as HTMLElement;
        loadingIcon.classList.add('ouvert');
        if(e.target.files) {
            const file = e.target.files[0];
            if(file.type !== 'image/jpeg' && file.type !== 'image/png') {
                setError(true);
                setErrorMsg('Debe ser JPG o PNG !');
                loadingIcon.classList.remove('ouvert');
                return;
            }
            var ref = firebase.storage().ref('œuvres-photos-principales/' + file.name);
            ref.put(file).then((result) => {
                ref.getDownloadURL().then((url) => {
                    firebase.firestore().collection('œuvres').doc(id).update({
                        photo: url
                    });
                    loadingIcon.classList.remove('ouvert');
                });
            });
            setRefresh(!refresh);
        }
    }

    const handleAddPhotos = (e: React.MouseEvent<HTMLElement>) => {
        e.currentTarget.querySelector('input')?.click();
    }

    const handleChangePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const loadingIcon = document.getElementById('secondLoadingIcon' + id) as HTMLElement;
        loadingIcon.classList.add('ouvert');
        if(e.target.files) {
            var temp: any[] = [];
            var files = Array.from(e.target.files);
            var quantity = e.target.files.length;
            const originalQuantity = e.target.files.length;
            if(maxFiles < quantity) {
                setError(true);
                setErrorMsg('6 máximo !');
                loadingIcon.classList.remove('ouvert');
                return;
            }
            files.forEach((file) => {
                if(file.type !== 'image/jpeg' && file.type !== 'image/png') {
                    setError(true);
                    setErrorMsg('Debe ser JPG o PNG !');
                    loadingIcon.classList.remove('ouvert');
                    return;
                }
                var ref = firebase.storage().ref('œuvres-photos-secondaires/' + file.name);
                ref.put(file).then((result) => {
                    ref.getDownloadURL().then((url) => {
                        firebase.firestore().collection('photos').add({
                            url: url,
                            œuvre: id
                        });
                        temp.push(url);
                        quantity = quantity - 1;
                        if(quantity === 0) {
                            setMaxFiles(maxFiles - originalQuantity);
                            var temp2 = [...photos];
                            setPhotos(temp2.concat(temp));
                            loadingIcon.classList.remove('ouvert');
                        }
                    })
                })
            })
        }
    }

    const handleFutureDelete = (e: React.MouseEvent<HTMLElement>) => {
        e.currentTarget.querySelector('.delete')?.classList.toggle('ouvert');
    }

    const handlePhotoDelete = (i: string) => {
        firebase.firestore().collection('photos').doc(i).delete();
        setMaxFiles(maxFiles - 1);
    }

    const handleChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedDescription(e.target.value);
    }

    const handleSubmitDescription = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        firebase.firestore().collection('œuvres').doc(id).update({
            description: editedDescription
        });
        setEditDescription(false);
        setRefresh(!refresh)
    }

    const handleDelete = () => {
        firebase.firestore().collection('œuvres').doc(id).delete();
    }

    const handleFinishEdit = (e: React.MouseEvent<HTMLElement>) => {
        e.currentTarget.parentElement?.classList.remove('ouvert');
        setEnableEdit(false);
        projet.style.height = width + 'px';
    }


    return(
        <div className="projet" id={'mon' + id} style={{backgroundImage: `url(${photo})`}} onClick={(e) => handleEdit(e)}>
            <div className="edit">
                {editTitre === false && <h4 onClick={() => setEditTitre(true)}>{titre}</h4>}
                {editTitre === true && 
                    <form className="signupForm" onSubmit={(e) => handleSubmitTitre(e)}>
                        <input autoFocus type="text" value={editedTitre} onChange={(e) => handleChangeTitre(e)} />
                        <input type='submit' className="formSubmit" value='OK' />
                    </form>
                }
                <form className="signupForm">
                    <label htmlFor={"photoPrincipale" + id}>Cambiar imágen principal <i id={'premierLoadingIcon' + id} className="loadingIconEdit"></i></label>
                    <input id={"photoPrincipale" + id} type="file" style={{display: 'none'}} onChange={(e) => handleChangePhotoPrincipale(e)} multiple={false} />
                </form>
                <label>Imágenes suplementarias <i id={'secondLoadingIcon' + id} className="loadingIconEdit"></i></label>
                <div className="photosContainer">
                    {photos.map((photo: any, index: any) => 
                        <div 
                            key={index}
                            className="photosSecondairesEdit" 
                            style={{backgroundImage: `url(${photo.url})` ,height: width/3.6, width: width/3.6}}
                            onClick={(e) => handleFutureDelete(e)}
                        >
                            <div className="delete" onClick={() => handlePhotoDelete(photo.id)}></div>
                        </div>
                    )}
                    {photos.length < 6 && 
                        <div className="addPhotos"  onClick={(e) => handleAddPhotos(e)} style={{height: width/3.6, width: width/3.6}}>
                            <form>
                                <input onChange={(e) => handleChangePhotos(e)} style={{display: 'none'}} type="file" multiple />
                            </form>
                        </div>
                    }
                </div>
                {editDescription === false && <div className="description" onClick={() => setEditDescription(true)}>{description || "Agregar descripción"}</div>}
                {editDescription === true && 
                    <form className="signupForm" onSubmit={(e) => handleSubmitDescription(e)}>
                        <textarea autoFocus rows={4} maxLength={280} value={editedDescription} onChange={(e) => handleChangeDescription(e)}></textarea>
                        <input type='submit' className="formSubmit textareaSubmit" value='OK' />
                    </form>
                }
                <div className="ok" onClick={(e) => handleFinishEdit(e)}>Terminar</div>
                {confirmDelete === false && <div className="deleteForm" onClick={() => setConfirmDelete(true)}>Eliminar</div>}
                {confirmDelete === true && <div className="confirm">Queres eliminar este proyecto?<br /><span onClick={handleDelete}>SI</span><span onClick={() => setConfirmDelete(false)}>NO</span></div>}
                {error === true && <div className="confirm">{errorMsg}<br /><span onClick={() => setError(false)}>OK</span></div>}
            </div>
        </div>
    );
}

export default Projet;