import { Controller, Get, Param, Delete, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Notificaciones')
@Controller('notificacion')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Obtener notificaciones de un usuario' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de notificaciones' })
  async getByUser(@Param('userId') userId: string) {
    const notifications = await this.notificationService.findByUser(userId);
    return notifications;
  }

  @Get('unread-count/:userId')
  @ApiOperation({ summary: 'Contador de notificaciones no leídas' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Número de notificaciones no leídas',
  })
  async unreadCount(@Param('userId') userId: string) {
    const unreadCount = await this.notificationService.countUnread(userId);
    return { unreadCount };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una notificación' })
  @ApiParam({ name: 'id', description: 'ID de la notificación' })
  @ApiResponse({ status: 200, description: 'Notificación eliminada' })
  async delete(@Param('id') id: string) {
    await this.notificationService.deleteById(id);
    return { deleted: true };
  }

  @Patch('read-all/:userId')
  @ApiOperation({ summary: 'Marcar todas las notificaciones como leídas' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Cantidad de notificaciones marcadas como leídas',
  })
  async markAllRead(@Param('userId') userId: string) {
    const updated = await this.notificationService.markAllRead(userId);
    return { updated };
  }

  @Patch('read/:id')
  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  @ApiParam({ name: 'id', description: 'ID de la notificación' })
  @ApiResponse({ status: 200, description: 'Notificación marcada como leída' })
  async markRead(@Param('id') id: string) {
    await this.notificationService.markRead(id);
    return { markedRead: true };
  }
}
