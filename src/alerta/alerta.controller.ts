import { Controller, Get, Param, Delete, Patch, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AlertaService } from './alerta.service';
import { NotificacionDto } from './dto/notificacion.dto';

/**
 * Controlador que expone los endpoints relacionados con las notificaciones de usuario.
 */
@ApiTags('Notificaciones')
@Controller('notificacion')
export class AlertaController {

  constructor(private readonly alertaService: AlertaService) {}

  /**
   * Retorna el número de notificaciones no leídas de un usuario.
   */
  @Get('unread-count/:userId')
  @ApiOperation({
    summary: 'Contador de notificaciones no leídas',
    description: `
Retorna el número total de notificaciones que el usuario aún no ha marcado como leídas.

**Uso esperado:**
- Este endpoint permite a cualquier módulo del sistema consultar cuántas notificaciones pendientes tiene un usuario.
- Es especialmente útil para mostrar badgets, contadores o alertas en la interfaz.

**Validaciones:**
- El \`userId\` debe existir en el sistema.
- Si el usuario no tiene notificaciones, retornará **Count = 0**.

**Respuesta esperada:**
\`\`\`json
{ "Count": 3 }
\`\`\`
`
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario del cual se quiere conocer el conteo de notificaciones no leídas',
    example: 'user-123'
  })
  @ApiResponse({
    status: 200,
    description: 'Número de notificaciones no leídas',
    schema: {
      example: { Count: 3 },
    },
  })
  async unreadCount(@Param('userId') userId: string) {
    const unreadCount = await this.alertaService.countUnread(userId);
    return { Count: unreadCount };
  }

  /**
   * Marca como leídas todas las notificaciones de un usuario.
   */
  @Patch('read-all/:userId')
  @ApiOperation({
    summary: 'Marcar todas las notificaciones como leídas',
    description: `
Marca todas las notificaciones del usuario como leídas.

**Comportamiento:**
- Cambia el estado de todas las notificaciones de \`visto = false\` a \`visto = true\`.
- No elimina las notificaciones.
- Funciona incluso si el usuario solo tiene un subconjunto sin leer.

**Validaciones:**
- El \`userId\` debe existir.
- Si el usuario no tiene notificaciones pendientes, retornará \`cantidad = 0\`.

**Respuesta esperada:**
\`\`\`json
{
  "mensaje": "Notificaciones marcadas como leídas",
  "cantidad": 5
}
\`\`\`
`
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario cuyas notificaciones se marcarán como leídas',
    example: 'user-123'
  })
  @ApiResponse({
    status: 200,
    description: 'Cantidad de notificaciones marcadas como leídas',
    schema: {
      example: {
        mensaje: 'Notificaciones marcadas como leídas',
        cantidad: 5,
      },
    },
  })

  /**
   * Marca como leída una notificación específica.
   */
  @Patch('read/:id')
  @ApiOperation({
    summary: 'Marcar una notificación como leída',
    description: `
Actualiza una notificación específica para marcarla como leída.

**Validaciones:**
- El ID debe corresponder a una notificación existente.
- Si la notificación ya estaba leída, no generará error; simplemente la mantiene como leída.
- Si no existe, se retorna error 404.

**Respuesta esperada:**
\`\`\`json
{
  "mensaje": "Notificación marcada como leída",
  "id": "10"
}
\`\`\`
`
  })  
  @ApiParam({
    name: 'id',
    description: 'ID de la notificación que se desea marcar como leída',
    example: 10
  })
  @ApiResponse({
    status: 200,
    description: 'Notificación marcada como leída',
    schema: {
      example: {
        mensaje: 'Notificación marcada como leída',
        id: '10',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Notificación no encontrada',
  })
  async markRead(@Param('id') id: string) {
    await this.alertaService.markRead(id);
    return { mensaje: 'Notificación marcada como leída', id };
  }

  /**
   * Elimina una notificación por su ID.
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una notificación',
    description: `
Elimina una notificación de manera permanente según su ID.

**Comportamiento:**
- Solo elimina una notificación a la vez.
- No afecta el historial de otros usuarios.
- Útil para funcionalidades donde el usuario desea limpiar alertas.

**Validaciones:**
- El ID debe existir.
- Si no existe, se retorna un 404.

**Respuesta esperada:**
\`\`\`json
{
  "mensaje": "Notificación eliminada",
  "id": "10"
}
\`\`\`
`
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la notificación que se desea eliminar',
    example: 10
  })
  @ApiResponse({
    status: 200,
    description: 'Notificación eliminada',
    schema: {
      example: {
        mensaje: 'Notificación eliminada',
        id: '10',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Notificación no encontrada',
  })
  async delete(@Param('id') id: string) {
    await this.alertaService.deleteById(id);
    return { mensaje: 'Notificación eliminada', id };
  }

  /**
   * Obtiene todas las notificaciones asociadas a un usuario.
   */
  @Get(':userId')
  @ApiOperation({
    summary: 'Obtener notificaciones de un usuario',
    description: `
Retorna todas las notificaciones asociadas a un usuario, ordenadas de la más reciente a la más antigua.

**Incluye:**
- ID de notificación
- Asunto
- Resumen
- Estado de lectura
- Fecha de creación

**Validaciones:**
- El usuario debe existir.
- Si no tiene notificaciones, se retorna un arreglo vacío.

**Ejemplo de respuesta:**
\`\`\`json
[
  {
    "id": 1,
    "asunto": "Nuevo material subido",
    "resumen": "Se ha agregado contenido de la unidad 2",
    "visto": false,
    "fechaCreacion": "2024-11-26T14:12:45Z"
  }
]
\`\`\`
`
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario del que se desean obtener las notificaciones',
    example: 'user-123'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones del usuario',
    type: NotificacionDto,
    isArray: true,
  })
  async getByUser(@Param('userId') userId: string): Promise<NotificacionDto[]> {
    const notifications = await this.alertaService.findByUser(userId);
    return notifications;
  }
}
