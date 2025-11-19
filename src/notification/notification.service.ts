import { Injectable, NotFoundException } from '@nestjs/common';
import { Notification } from './notification.entity';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './user.entity';

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

  async crearUsuario(id: string, mail: string, name: string): Promise<void> {
    if (await this.prisma.user.findUnique({ where: { id: id } })) {
      throw new Error('Usuario ya existe');
    }
    if (await this.prisma.user.findUnique({ where: { mail: mail } })) {
      throw new Error('Email ya registrado');
    }
    await this.prisma.user.create({
      data: {
        id: id,
        mail: mail,
        name: name
      }
    });
  }

  async crearNotidicacionVariosUsuarios(mensaje: any){
    for (const receptor of mensaje.receptores) {
      await this.crearNotificacion(receptor.email, mensaje.template, mensaje.resumen);
    };
  }
  
  async crearNotificacion(email: string, titulo: string, mensaje: string): Promise<void> {
    if (!email) {
      throw new NotFoundException('Email no proporcionado');
    }
    const user = await this.encontrarUsuarioPorEmail(email);
    await this.prisma.notification.create({
      data: {
        userId: user.id,
        asunto: titulo,
        resumen: mensaje,
      }
    });
  }

  async encontrarUsuarioPorEmail(mail: string): Promise<User> {
    const user: User | null = await this.prisma.user.findUnique({ where: { mail: mail } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }
}