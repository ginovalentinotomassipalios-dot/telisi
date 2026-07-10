import { loginWithGoogle } from "../services/authService";
import { createUserProfile } from "../services/userService";


export function Login(){


  async function handleLogin(){


    const user =
      await loginWithGoogle();



    if(user){


      await createUserProfile(
        user
      );


      console.log(
        "Usuario creado/verificado:",
        user
      );


    }


  }



  return (

    <main className="login-screen">


      <div className="login-card">


        <div className="login-logo">
          ✦
        </div>


        <span className="login-brand">
          TELISI
        </span>


        <h1>
          Organizá tu día.
        </h1>


        <p>
          Tus eventos, recordatorios
          y metas en un solo lugar.
        </p>



        <button

          className="google-login-button"

          onClick={handleLogin}

        >

          <span>
            G
          </span>

          Continuar con Google


        </button>


      </div>


    </main>

  );

}