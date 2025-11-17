import { Injectable, NotFoundException } from '@nestjs/common';
import { Notification } from './notification.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string): Promise<Notification[]> {
    const res = await this.prisma.notification.findMany({ where: { userId: userId }, orderBy: { fechaCreacion: 'desc' } });
    return res.map(r => ({
      ...r,
      id: String(r.id),
    }));
  }

  async countUnread(userId: string): Promise<number> {
    return this.prisma.notification.count({ where: { userId, visto: false } });
  }

  async deleteById(id: string): Promise<void> {
    const res = await this.prisma.notification.delete({ where: { id: Number(id) } });
    if (!res)
      throw new NotFoundException('Notification not found');
  }

  async markAllRead(userId: string): Promise<void> {
    const res = await this.prisma.notification.updateMany({ where: { userId, visto: false }, data: { visto: true } });
    if (!res)
      throw new NotFoundException('Notificación no encontrada');
  }

  async markRead(id: string): Promise<void> {
    const res = await this.prisma.notification.update({ where: { id: Number(id) }, data: { visto: true } });
    if (!res)
      throw new NotFoundException('Notificación no encontrada');
  }
  
}
