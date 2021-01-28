import React, { useState, useEffect } from 'react';
import './css/menu.css';

type Props = {
    id?: string,
    position?: number,
    titre?: string,
    photo?: string
}

const Tendance: React.FC<Props> = ({ id, position, titre, photo }) => {

    const [width, setWidth] = useState<string>('');
    const [agrandi, setAgrandi] = useState<boolean>(false);
    const [originalWidth, setOriginalWidth] = useState<string>('');

    useEffect(() => {
        if(position === 1) {
            setWidth(document.getElementsByClassName('lateral')[0].clientWidth*(2/3) + 'px');
            setOriginalWidth(document.getElementsByClassName('lateral')[0].clientWidth*(2/3) + 'px');
        } else {
            setWidth(document.getElementsByClassName('lateral')[0].clientWidth/3.09 + 'px');
            setOriginalWidth(document.getElementsByClassName('lateral')[0].clientWidth/3.09 + 'px');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClick = () => {
        const cover = document.getElementById(id + 'tendanceContainer') as HTMLElement;
        if(!agrandi) {
            setWidth(document.getElementsByClassName('lateral')[0].clientWidth + 'px');
            cover.style.opacity = '0';
            setAgrandi(true);
        } else if(agrandi) {
            setWidth(originalWidth);
            cover.style.opacity = '1';
            setAgrandi(false);
        }
    }

    return(
        <div className='tendanceContainer' style={{backgroundImage: `url(${photo})`, height: width, width: width}}>
            <div id={id + 'tendanceContainer'} onClick={handleClick} className="tendanceCover">
                <h4>{titre}</h4>
            </div>
        </div>
    );
}

export default Tendance;