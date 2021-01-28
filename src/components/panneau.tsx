import React, { useState, useEffect } from 'react';
import './css/panneau.css';
import Cachet from './cachet';
import Album from './album';
import Resume from './resume';

type Props = {
    refresh: boolean,
    setRefresh: any,
    auth: boolean,
    id: string,
    titre: string,
    auteurID: string,
    photo: string,
    description: string,
    mesFavoris?: any,
    portfolio?: boolean,
    originalID?: string,
    setCurrentAuteur?: any,
    setCurrentŒuvre?: any
}

const Panneau: React.FC<Props> = ({ refresh, setRefresh, auth, id, titre, auteurID, photo, description, mesFavoris, portfolio = false, originalID, setCurrentAuteur, setCurrentŒuvre }) => {

    const [height] = useState<number>(window.screen.width <= 600 ? window.screen.width : window.screen.height);
    const [enableSwipeListener, setEnableSwipeListener] = useState<boolean>(false);
    const [enablePhotos, setEnablePhotos] = useState<boolean>(false);
    const [isFavori, setIsFavori] = useState<boolean>(false);

    useEffect(() => {
        if(!portfolio) {document.getElementsByClassName('container')[0].classList.remove('cache')}
        if(portfolio) {document.getElementById(id+'portfolio'+originalID)?.classList.remove('cache')}
        if(!document.getElementById(portfolio ? id+'portfolio'+originalID : id)?.classList.contains('cache')) {setEnableSwipeListener(true)}
    }, [id, portfolio, originalID]);

    useEffect(() => {
        setIsFavori(false);
        
        mesFavoris.forEach((favori: any) => {
            if(favori.favori === id) {
                setIsFavori(true);
            }
        });

        if(window.screen.width <= 600) {
            if(portfolio) {setEnablePhotos(true)}

            document.getElementsByClassName('panneauContainer')[0].addEventListener('scroll', function() {
                const scrollPosition = document.getElementById(id)?.getBoundingClientRect().top as Number;
                if(scrollPosition >= 0 && scrollPosition <= 300) {
                    document.getElementById(id)?.classList.remove('cache');
                    setEnableSwipeListener(true);
                } else {
                    document.getElementById(id)?.classList.add('cache');
                    setEnableSwipeListener(false);
                }
            });

            if(enableSwipeListener) {
                document.getElementById(portfolio ? id+'portfolio'+originalID : id)?.addEventListener('scroll', function(e) {
                    const swipePositionPhotos = document.getElementById(portfolio ? id + "portfoliodetails"+originalID : id + "details")?.getBoundingClientRect().left as Number;
                    if(swipePositionPhotos === 0) {
                        setEnablePhotos(true);
                        if(!portfolio) {setCurrentAuteur(auteurID)}
                        if(!portfolio) {setCurrentŒuvre(id)}
                    }
                });
            }
        }
    }, [id, enableSwipeListener, height, mesFavoris, portfolio, originalID, auteurID, setCurrentAuteur, setCurrentŒuvre]);

    return (
        <div className="container cache" id={portfolio ? id+'portfolio'+originalID : id}>
            <div className="panneauFront" style={{backgroundImage: `url(${photo})`, height: `${height + 'px'}`}}>
                <Cachet 
                    refresh={refresh} 
                    setRefresh={setRefresh} 
                    auth={auth} 
                    id={id} 
                    titre={titre} 
                    isFavori={isFavori} 
                />
            </div>
            <div className="panneauBack" id={portfolio ? id + "portfoliodetails"+originalID : id + "details"} style={{height:`${height + 'px'}`}}>
                <Album enablePhotos={enablePhotos} œuvreID = {id} />
                <Resume description={description} />
            </div>
        </div>
    );
}

export default Panneau;