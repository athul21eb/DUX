import { IBaseRepository } from "../core/interfaces/baseRepostitory";

export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected model: any) {}

  async create(data: Partial<T>): Promise<T> {
    return this.model.create({ data });
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findAll(options?: object): Promise<T[]> {
    return this.model.findMany({ ...options });
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.model.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  async count(): Promise<number> {
    return this.model.count();
  }
}
