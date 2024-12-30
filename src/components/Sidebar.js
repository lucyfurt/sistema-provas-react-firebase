import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import "../css/Sidebar.css";

const Sidebar = ({ onMenuSelect }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logout realizado com sucesso!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    }
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Sistema de Provas</h2>
      <ul className="sidebar-menu">
        <li
          onClick={() => onMenuSelect("cadastrarCurso")}
          className="sidebar-item"
        >
          Cadastrar Cursos
        </li>

        <li onClick={() => onMenuSelect("addProva")} className="sidebar-item">
          Adicionar Prova
        </li>
        <li
          onClick={() => onMenuSelect("listarNotas")}
          className="sidebar-item"
        >
          Listar Notas
        </li>
        <li
          onClick={() => onMenuSelect("listarProvas")}
          className="sidebar-item"
        >
          Listar Provas
        </li>
        <li onClick={() => onMenuSelect("overview")} className="sidebar-item">
          Visão Geral
        </li>
        <li onClick={handleLogout} className="sidebar-item logout">
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
