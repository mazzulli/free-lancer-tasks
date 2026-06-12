export interface ApontamentoProps {
  id: string
  tarefaId: string
  data: Date
  horaIni: string
  horaFim: string
  totalHoras: number
  createdAt: Date
  updatedAt: Date
}

export class Apontamento {
  private constructor(private readonly props: ApontamentoProps) {}

  static create(props: Omit<ApontamentoProps, 'createdAt' | 'updatedAt'>): Apontamento {
    return new Apontamento({ ...props, createdAt: new Date(), updatedAt: new Date() })
  }

  static reconstitute(props: ApontamentoProps): Apontamento {
    return new Apontamento(props)
  }

  get id() { return this.props.id }
  get tarefaId() { return this.props.tarefaId }
  get data() { return this.props.data }
  get horaIni() { return this.props.horaIni }
  get horaFim() { return this.props.horaFim }
  get totalHoras() { return this.props.totalHoras }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }

  toJSON(): ApontamentoProps { return { ...this.props } }
}
