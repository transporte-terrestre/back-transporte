import { Injectable } from '@nestjs/common';
import { eq, and, asc, isNull } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { checklistItems, ChecklistItemDTO } from '@db/tables/checklist-item.table';

@Injectable()
export class ChecklistItemRepository {
  async findAll() {
    return await database.select().from(checklistItems).where(isNull(checklistItems.eliminadoEn)).orderBy(asc(checklistItems.nombre));
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(checklistItems)
      .where(and(eq(checklistItems.id, id), isNull(checklistItems.eliminadoEn)));
    return result[0];
  }

  async findByNombre(nombre: string) {
    const result = await database
      .select()
      .from(checklistItems)
      .where(and(eq(checklistItems.nombre, nombre), isNull(checklistItems.eliminadoEn)));
    return result[0];
  }

  async create(data: ChecklistItemDTO) {
    const result = await database.insert(checklistItems).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ChecklistItemDTO>) {
    const result = await database
      .update(checklistItems)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(checklistItems.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.update(checklistItems).set({ eliminadoEn: new Date() }).where(eq(checklistItems.id, id)).returning();
    return result[0];
  }
}
