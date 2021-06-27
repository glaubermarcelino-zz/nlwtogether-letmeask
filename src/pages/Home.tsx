import { useHistory } from "react-router-dom";

import IlustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";

import "../styles/auth.scss";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import Swal from "sweetalert2";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";

export function Home() {
  const history = useHistory();
  const { SignInWithGoogle, usuarioLogado, LogoutGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function HandleCreateRoom() {
    if (!usuarioLogado) {
      await SignInWithGoogle();
    }
    history.push("/rooms/new");
  }

  async function HandleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") return;

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      await Swal.fire({
        title: "Erro",
        text: "Room does not exists!",
        icon: "error",
        timer: 3000,
        confirmButtonText: "Ok",
      });
      return;
    }
    if (roomRef.val().endedAt) {
      await Swal.fire({
        title: "Warning",
        text: "Room already closed!",
        icon: "warning",
        timer: 3000,
        confirmButtonText: "Ok",
      });
      return;
    }
    history.push(`/rooms/${roomCode}`);
  }

  function HandleLogout() {
    Swal.fire({
      title: "Deseja realmente Sair?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        LogoutGoogle();
      }
    });
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={IlustrationImg}
          alt="Ilustração simbolizando pergunta e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas de sua audiência em tempo real</p>
      </aside>
      <main>
        {usuarioLogado && (
          <header>
            <div className="header-content">
              <Button onClick={() => HandleLogout()}>Sair</Button>
            </div>
          </header>
        )}
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />

          <button className="create-room" onClick={() => HandleCreateRoom()}>
            <img src={googleIconImg} alt="Logo da Google" />
            Crie sua sala com o Google
          </button>

          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={(event) => HandleJoinRoom(event)}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
