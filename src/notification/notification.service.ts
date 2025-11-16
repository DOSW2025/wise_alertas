import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
  ) {}

  async createFromEvent(event: any, receptor: any): Promise<Notification> {
    const userId = (receptor && (receptor.userId || receptor.email || receptor.id)) || 'unknown';
    const title = event.titulo || event.title || null;
    const body = JSON.stringify(event.context || event);
    const template = event.template || null;

    const entity = this.repo.create({
      userId,
      title,
      body,
      template,
      read: false,
      metadata: { receptor },
    });
    return this.repo.save(entity);
  }

  async findByUser(userId: string): Promise<Notification[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async countUnread(userId: string): Promise<number> {
    return this.repo.count({ where: { userId, read: false } });
  }

  async deleteById(id: string): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Notification not found');
  }

  async markAllRead(userId: string): Promise<number> {
    const res = await this.repo.update({ userId, read: false }, { read: true });
    return res.affected || 0;
  }
}
