import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

type Props = {
    setUsername: any
}

const SignUpForm: React.FC<Props> = ({ setUsername }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            alert(error.message);
        });
        firebase.auth().onAuthStateChanged(function(user) {
            if(user) {
                firebase.firestore().collection('config').doc(user.uid).set({
                    langue: null,
                    pays: null,
                    uni: null
                })
            }
        });
        setUsername(null);
    }

    return (
        <form className="signupForm" onSubmit={(e) => {handleSubmit(e)}}>
            <h4>CREAR CUENTA</h4>
            <label>E-mail</label>
            <input type="text" value={email} onChange={(e) => {handleChangeEmail(e)}} />
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e) => {handleChangePassword(e)}} />
            <input type="submit" />
        </form>
    );
}

export default SignUpForm;