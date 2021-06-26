import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { firebase, auth } from "../../services/firebase";
import { IUsuario } from "../../types/IUsuario";

export interface IAuthContext {
  SignInWithGoogle(): Promise<void>;
  LogoutGoogle():Promise<void>;
  usuarioLogado: IUsuario | undefined;
  setUsuarioLogado: Dispatch<SetStateAction<IUsuario | undefined>>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);
const AuthProvider = ({ children }: any) => {
  const [usuarioLogado, setUsuarioLogado] = useState<IUsuario>();

  async function LogoutGoogle(){
    auth.signOut();
    setUsuarioLogado(undefined);
  }
  async function SignInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL)
        throw new Error("Missing information from Google Account");

      setUsuarioLogado({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((usuario) => {
      if (usuario) {
        const { displayName, photoURL, uid } = usuario;

        if (!displayName || !photoURL)
          throw new Error("Missing information from Google Account");

        setUsuarioLogado({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });
    return (() =>{
      unsubscribe();
    })
  }, []);
  return (
    <AuthContext.Provider
      value={{ usuarioLogado, SignInWithGoogle, setUsuarioLogado,LogoutGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export { AuthProvider, AuthContext };
