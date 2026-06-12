import type { IClienteRepository } from '../../../domain/repositories/IClienteRepository.js'

export class ListClientesUseCase {
  constructor(private readonly repo: IClienteRepository) {}
  async execute() { return this.repo.findAll() }
}
