import { requestNotificationPermission } from "../services/remindersService";
import { requestFCMToken } from "../services/fcmService";
import { saveDeviceToken } from "../services/deviceService";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";


const appThemes = [
  {
    id:"amethyst",
    name:"Amatista",
    color:"#7C4D8B"
  },
  {
    id:"ocean",
    name:"Océano",
    color:"#3F5F93"
  },
  {
    id:"forest",
    name:"Bosque",
    color:"#34805A"
  },
  {
    id:"crimson",
    name:"Carmesí",
    color:"#B35068"
  },
  {
    id:"obsidian",
    name:"Obsidiana",
    color:"#241029"
  },
  {
    id:"pearl",
    name:"Perla",
    color:"#C9B7D0"
  }
];



export function Settings({
  appTheme,
  setAppTheme,
  exportData
}) {
async function logout(){

  try{

    await signOut(auth);

    window.location.reload();

  }

  catch(error){

    console.error(
      "Error cerrando sesión:",
      error
    );

  }

}


  async function activateNotifications(){


    const permission =
      await requestNotificationPermission();



    if(permission !== "granted"){

      alert(
        "❌ Permiso de notificaciones rechazado"
      );

      return;

    }



    const token =
      await requestFCMToken();



    if(token){


      await saveDeviceToken(token);



      alert(
        "✅ Notificaciones activadas"
      );


    }

    else{


      alert(
        "❌ No se pudo activar las notificaciones"
      );


    }


  }




  return (

    <section className="panel settings-panel">


      <h2>
        Ajustes
      </h2>


      <p className="muted">
        Telisi v0.8.0
      </p>





      <div className="setting-block">


        <h3>
          Apariencia
        </h3>


        <p className="muted compact">
          Elegí un color principal para toda la aplicación.
        </p>



        <div className="theme-picker">


          {appThemes.map(item => (

            <button

              key={item.id}

              className={
                appTheme === item.id
                ? "theme-option active"
                : "theme-option"
              }


              onClick={() =>
                setAppTheme(item.id)
              }

            >

              <span
                style={{
                  background:item.color
                }}
              />


              {item.name}


            </button>

          ))}


        </div>


      </div>






      <div className="setting-row">


        <span>
          Copia de seguridad
        </span>


        <button

          className="pill-button"

          onClick={exportData}

        >
          Exportar
        </button>


      </div>







      <div className="setting-row">


        <span>
          Sincronización
        </span>


        <strong>
          Conectado ✅
        </strong>


      </div>









      <div className="notification-card">


        <div>


          <h3>
            🔔 Notificaciones
          </h3>


          <p className="muted compact">

            Recibí recordatorios de tus eventos
            incluso cuando Telisi esté cerrada.

          </p>



          <strong>

            🟢 Dispositivo listo

          </strong>


        </div>




        <button

          className="pill-button"

          onClick={activateNotifications}

        >

          Activar

        </button>


      </div>




<div className="setting-row">


  <span>
    Sesión
  </span>


  <button

    className="pill-button"

    onClick={logout}

  >

    Cerrar sesión

  </button>


</div>
    </section>

  );

}