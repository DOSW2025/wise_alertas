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
  @ApiOperation({ summary: 'Contador de notificaciones no leídas' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Número de notificaciones no leídas' })
  async unreadCount(@Param('userId') userId: string) {
    const unreadCount = await this.alertaService.countUnread(userId);
    return { Count: unreadCount };
  }

  /**
   * Marca como leídas todas las notificaciones de un usuario.
   */
  @Patch('read-all/:userId')
  @ApiOperation({ summary: 'Marcar todas las notificaciones como leídas' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Cantidad de notificaciones marcadas como leídas' })
  async markAllRead(@Param('userId') userId: string) {
    const cantidad = await this.alertaService.markAllRead(userId);
    return { mensaje: 'Notificaciones marcadas como leídas', cantidad };
  }

  /**
   * Marca como leída una notificación específica.
   */
  @Patch('read/:id')
  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  @ApiParam({ name: 'id', description: 'ID de la notificación' })
  @ApiResponse({ status: 200, description: 'Notificación marcada como leída' })
  async markRead(@Param('id') id: string) {
    await this.alertaService.markRead(id);
    return { mensaje: 'Notificación marcada como leída', id };
  }

  /**
   * Elimina una notificación por su ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una notificación' })
  @ApiParam({ name: 'id', description: 'ID de la notificación' })
  @ApiResponse({ status: 200, description: 'Notificación eliminada' })
  async delete(@Param('id') id: string) {
    await this.alertaService.deleteById(id);
    return { mensaje: 'Notificación eliminada', id };
  }

  /**
   * Obtiene todas las notificaciones asociadas a un usuario.
   */
  @Get(':userId')
  @ApiOperation({ summary: 'Obtener notificaciones de un usuario' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de notificaciones' })
  async getByUser(@Param('userId') userId: string): Promise<NotificacionDto[]> {
    const notifications = await this.alertaService.findByUser(userId);
    return notifications;
  }
}
