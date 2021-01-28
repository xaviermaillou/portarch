import React from 'react';
import './css/resume.css';

type Props = {
    description?: string
}

const Resume: React.FC<Props> = ({ description = '' }) => {
    return (
        <div className="resumeContainer">
            {description}
        </div>
    );
}

export default Resume;