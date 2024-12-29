import React from 'react';
import '../css/login.css';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../firebase';
import logo from '../images/logo_google.png'; 


const LoginScreen = () => {

  // Provedor de autenticação do Google
  const googleProvider = new GoogleAuthProvider();

  
  // Função para login com Google
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Login com Google realizado com sucesso!");
    } catch (error) {
      alert("Erro ao fazer login com Google: " + error.message);
    }
  };

  return (
    <div className='login-container'>
      <h2>Conecte-se para realizar a prova</h2>
      <img src={logo} alt="Logo" className="logo" />
      <button className="button-login"onClick={handleGoogleLogin}>Entrar com Google</button>
    </div>
  );
};

export default LoginScreen;
