/**
 * Agrupa todas las plantillas de correo usadas por el sistema.
 * Cada valor representa el asunto del correo para un evento específico.
 */
export enum TemplateEnum {

    //Autenticación
    cambioDeRol = 'Su rol ha sido actualizado',
    cuentaEliminada = 'Su cuenta ha sido eliminada',
    nuevoUsuario = 'Nuevo usuario registrado',
    //tutorias
    SolicitudTutoriaEstudiante ='Ha creado una nueva solicitud de tutoría',
    SolicitudTutoriaTutor ='Ha recibido una nueva solicitud de tutoría',
    ConfirmacionTutoriaEstudiante ='Su tutoría ha sido confirmada',
    ConfirmacionTutoriaTutor ='Se ha confirmado una nueva tutoría',
    RechazoTutoriaEstudiante ='Su solicitud de tutoría ha sido rechazada',
    RechazoTutoriaTutor ='Se ha rechazado una solicitud de tutoría',
    CancelacionTutoriaEstudiante ='Su tutoría ha sido cancelada',
    CancelacionTutoriaTutor ='Ha sido cancelada una tutoría',
    CompletacionTutoriaEstudiante ='Su tutoría ha sido completada',
    CompletacionTutoriaTutor ='Se ha completado una tutoría',
    //Materales
    nuevoMaterialSubido = 'Se ha subido un nuevo material',
    //chats
    nuevoMensaje =  "Hay un nuevo mensaje del Grupo: ",
    //foros
    nuevaRespuesta = 'Hay una nueva respuesta en el foro: ',
    mencionThread = 'Has sido mencionado en un hilo del foro: ',
    mencionRespuesta = 'Has sido mencionado en una respuesta del foro: ',
    nuevoThreadEnForo = 'Se ha creado un nuevo hilo en el foro: ',
}
