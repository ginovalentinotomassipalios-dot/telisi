import { LocalNotifications } from "@capacitor/local-notifications";


console.log(
  "NOTIFICATION SERVICE CARGADO"
);



function createNotificationId(value) {

  const text = String(value || Date.now());

  let hash = 0;


  for (let i = 0; i < text.length; i++) {

    hash =
      ((hash << 5) - hash) +
      text.charCodeAt(i);

    hash |= 0;

  }


  return Math.abs(hash) || 1;

}





export async function requestNotificationPermission() {


  const permission =
    await LocalNotifications.requestPermissions();



  console.log(
    "PERMISO NOTIFICACIONES:",
    permission
  );


  return permission.display === "granted";

}





export async function scheduleEventNotification(event) {


  console.log(
    "PROGRAMANDO NOTIFICACION:",
    event
  );



  // Si eligió "Sin aviso"

  if (
    event.reminder === -1
  ) {

    console.log(
      "Evento sin recordatorio"
    );

    return false;

  }





  const hasPermission =
    await requestNotificationPermission();



  if (!hasPermission) {


    console.log(
      "Sin permiso de notificaciones"
    );


    return false;

  }







  const eventDate =
    new Date(
      `${event.date}T${event.time}`
    );




  const reminderMinutes =
    event.reminder ?? 10;





  const notificationTime =
    new Date(
      eventDate.getTime() -
      reminderMinutes * 60 * 1000
    );





  console.log(
    "FECHA EVENTO:",
    eventDate
  );


  console.log(
    "MINUTOS RECORDATORIO:",
    reminderMinutes
  );


  console.log(
    "FECHA NOTIFICACION:",
    notificationTime
  );


  console.log(
    "HORA ACTUAL:",
    new Date()
  );






  if (
    Number.isNaN(
      eventDate.getTime()
    )
  ) {


    console.error(
      "Fecha inválida",
      event
    );


    return false;

  }






  if (
    notificationTime <= new Date()
  ) {


    console.log(
      "El recordatorio ya pasó"
    );


    return false;

  }







  const notificationId =
    createNotificationId(
      event.id ||
      event.cloudId
    );






  const eventName =
    event.text ||
    "Evento";







  await LocalNotifications.schedule({


    notifications: [

      {


        id:
          notificationId,



        title:
          "📅 Telisi",



        body:
          `"${eventName}" comienza en ${
            reminderMinutes === 0
              ? "este momento"
              : reminderMinutes + " minutos"
          }`,




        schedule: {

          at:
            notificationTime,

          allowWhileIdle:
            true

        },



        sound:
          "default",



        extra: {

          eventId:
            event.id ||
            event.cloudId ||
            ""

        }


      }


    ]

  });







  console.log(
    "NOTIFICACION PROGRAMADA:",
    notificationId
  );



  return true;


}