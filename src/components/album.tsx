import React, { useState, useEffect } from 'react';
import './css/album.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

type Props = {
    enablePhotos: boolean,
    œuvreID: string,
}

const Album: React.FC<Props> = ({ enablePhotos, œuvreID }) => {

    const photos = usePhotos();

    var manquants = [...Array(6-photos.length)].map((e: any, i: any) => <div className="photoContainer" key={i}></div>);

    function usePhotos() {
        const [photos, setPhotos] = useState<any>([]);
    
        useEffect(() => {
            if(enablePhotos) {
                firebase.firestore().collection('photos').where('œuvre', '==', œuvreID).onSnapshot((snapshot) => {
                    const newPhotos = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setPhotos(newPhotos);
                });
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [enablePhotos]);
    
        return photos;
    }

    return (
        <div className="albumContainer">
            {photos.map((photo: any) => 
                <div key={photo.id} className="photoContainer" style={{backgroundImage: `url(${photo.url})`}}></div>
            )}
            {manquants}
        </div>
    );
}

export default Album;