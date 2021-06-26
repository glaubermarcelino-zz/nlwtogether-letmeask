import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswer: boolean;
  isHighlighted: boolean;
  likeCount:number;
  likeId:string | undefined;
};

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswer: boolean;
    isHighlighted: boolean;
    likes:Record<string,{
      authorId:string
    }>;
  }
>;

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState<string>("");
  const {usuarioLogado} = useAuth();

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    roomRef.on("value", (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions || {};
      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isAnswer: value.isAnswer,
            isHighlighted: value.isHighlighted,
            likeCount:Object.entries(value.likes ?? {}).length,
            likeId:Object.entries(value.likes ?? {}).find(([key,like]) => like.authorId === usuarioLogado?.id)?.[0]
          };
        }
      );
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });

    return ()=>{
        roomRef.off('value');
    };
  }, [roomId,usuarioLogado?.id]);

  return { questions, title };
}