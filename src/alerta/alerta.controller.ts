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
  @Get('unread-count/:userId')
  @ApiOperation({
    summary: 'Contador de notificaciones no leídas',
    description: 'Retorna el número total de notificaciones que el usuario aún no ha marcado como leídas.'
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
    description: 'Marca como leídas todas las notificaciones no leídas asociadas al usuario indicado.'
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
    description: 'Actualiza el estado de una notificación específica para que aparezca como leída.'
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
    description: 'Elimina definitivamente una notificación existente según su identificador.'
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
    description: 'Retorna la lista de notificaciones asociadas al usuario indicado, ordenadas de la más reciente a la más antigua.'
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
