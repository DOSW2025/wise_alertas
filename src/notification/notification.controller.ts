import { Controller, Get, Param, Delete, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notificacion')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':userId')
  async getByUser(@Param('userId') userId: string) {
    const notifications = await this.notificationService.findByUser(userId);
    return { notifications, total: notifications.length };
  }

  @Get('unread-count/:userId')
  async unreadCount(@Param('userId') userId: string) {
    const unreadCount = await this.notificationService.countUnread(userId);
    return { unreadCount };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.notificationService.deleteById(id);
    return { deleted: true };
  }

  @Patch('read-all/:userId')
  async markAllRead(@Param('userId') userId: string) {
    const updated = await this.notificationService.markAllRead(userId);
    return { updated };
  }
}
