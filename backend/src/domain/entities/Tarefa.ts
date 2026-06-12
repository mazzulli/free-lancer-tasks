export type TarefaStatus = 'NOVA' | 'EM_ANDAMENTO' | 'PRONTA' | 'FECHADA'

export interface TarefaProps {
  id: string
  projetoId: string
  titulo: string
  descricao?: string | null
  status: TarefaStatus
  createdAt: Date
  updatedAt: Date
}

export class Tarefa {
  private constructor(private readonly props: TarefaProps) {}

  static create(props: Omit<TarefaProps, 'createdAt' | 'updatedAt' | 'status'> & { status?: TarefaStatus }): Tarefa {
    return new Tarefa({ ...props, status: props.status ?? 'NOVA', createdAt: new Date(), updatedAt: new Date() })
  }

  static reconstitute(props: TarefaProps): Tarefa {
    return new Tarefa(props)
  }

  get id() { return this.props.id }
  get projetoId() { return this.props.projetoId }
  get titulo() { return this.props.titulo }
  get descricao() { return this.props.descricao }
  get status() { return this.props.status }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }

  toJSON(): TarefaProps { return { ...this.props } }
}
