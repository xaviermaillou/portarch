import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const SignInForm: React.FC = () => {
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
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            alert(error.message);
        });
        /* setTimeout(function() {
            window.location.reload(false);
          }, 1000); */
    }
    return (
        <form className="signupForm" onSubmit={(e) => {handleSubmit(e)}}>
            <h4>CONECTARSE</h4>
            <label>E-mail</label>
            <input type="text" value={email} onChange={(e) => {handleChangeEmail(e)}} />
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e) => {handleChangePassword(e)}} />
            <input type="submit" />
        </form>
    );
}

export default SignInForm;