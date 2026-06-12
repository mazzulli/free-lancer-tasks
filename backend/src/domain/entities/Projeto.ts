export interface ProjetoProps {
  id: string
  clienteId: string
  titulo: string
  descricao?: string | null
  valorHora: number
  createdAt: Date
  updatedAt: Date
}

export class Projeto {
  private constructor(private readonly props: ProjetoProps) {}

  static create(props: Omit<ProjetoProps, 'createdAt' | 'updatedAt'>): Projeto {
    return new Projeto({ ...props, createdAt: new Date(), updatedAt: new Date() })
  }

  static reconstitute(props: ProjetoProps): Projeto {
    return new Projeto(props)
  }

  get id() { return this.props.id }
  get clienteId() { return this.props.clienteId }
  get titulo() { return this.props.titulo }
  get descricao() { return this.props.descricao }
  get valorHora() { return this.props.valorHora }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }

  toJSON(): ProjetoProps { return { ...this.props } }
}
