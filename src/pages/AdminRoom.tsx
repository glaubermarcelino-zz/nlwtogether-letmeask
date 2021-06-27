import { useHistory, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";

import "../styles/room.scss";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";

import logoImg from "../assets/images/logo.svg";
import deleteQuestion from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

import { database } from "../services/firebase";
import Swal from "sweetalert2";

type RoomParams = {
  id: string;
};
export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);
  const history = useHistory();
  
  async function handleDeleteQuestion(questionId: string) {
    Swal.fire({
      title: "Deseja realmente deletar?",
      text: "Esta ação não poderá ser desfeita",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
      }
    });
  }
  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`)
    .update({endedAt: new Date()},async( err)=>{
      if(!err){
        await Swal.fire({
          title: 'Parabéns',
          text: 'Sala encerrada com sucesso',
          icon: 'success',
          timer: 3000,
          confirmButtonText: 'Ok'
        });
        history.push('/')
      }
    });
  }
async function handleCheckQuestionAsAnswered(questionId: string)
{
  await database.ref(`rooms/${roomId}/questions/${questionId}`)
  .update({isAnswer:true},async( err)=>{
    if(!err){
      await Swal.fire({
        title: 'Parabéns',
        text: 'Pergunta marcada com sucesso!',
        icon: 'success',
        timer: 3000,
        confirmButtonText: 'Ok'
      });
    }
  });
}
async function handleHightLightQuestion(questionId: string)
{
  await database.ref(`rooms/${roomId}/questions/${questionId}`)
  .update({isHighlighted: true},async( err)=>{
    if(!err){
      await Swal.fire({
        title: 'Parabéns',
        text: 'Sala encerrada com sucesso',
        icon: 'success',
        timer: 3000,
        confirmButtonText: 'Ok'
      });
    }
  });
}
  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={() => handleEndRoom()}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id.toString()}
                content={question.content}
                author={question.author}
                isAnswer={question.isAnswer}
                isHighlighted={question.isHighlighted}
              >
               {!question.isAnswer && (
                 <>
                  <button
                  type="button"
                  onClick={() => handleCheckQuestionAsAnswered(question.id)}
                >
                  <img src={checkImg} alt="Marcar pergunta respondida" />
                </button>
                <button
                  type="button"
                  onClick={() => handleHightLightQuestion(question.id)}
                >
                  <img src={answerImg} alt="Dar destaque as perguntas" />
                </button>
                </>
               )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteQuestion} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
