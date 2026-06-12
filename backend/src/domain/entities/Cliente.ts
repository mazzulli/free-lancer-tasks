export interface ClienteProps {
  id: string
  nome: string
  razaoSocial: string
  email: string
  cnpj: string
  cep?: string | null
  endereco?: string | null
  numero?: string | null
  complemento?: string | null
  bairro?: string | null
  cidade?: string | null
  estado?: string | null
  createdAt: Date
  updatedAt: Date
}

export class Cliente {
  private constructor(private readonly props: ClienteProps) {}

  static create(props: Omit<ClienteProps, 'createdAt' | 'updatedAt'>): Cliente {
    return new Cliente({ ...props, createdAt: new Date(), updatedAt: new Date() })
  }

  static reconstitute(props: ClienteProps): Cliente {
    return new Cliente(props)
  }

  get id() { return this.props.id }
  get nome() { return this.props.nome }
  get razaoSocial() { return this.props.razaoSocial }
  get email() { return this.props.email }
  get cnpj() { return this.props.cnpj }
  get cep() { return this.props.cep }
  get endereco() { return this.props.endereco }
  get numero() { return this.props.numero }
  get complemento() { return this.props.complemento }
  get bairro() { return this.props.bairro }
  get cidade() { return this.props.cidade }
  get estado() { return this.props.estado }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }

  toJSON(): ClienteProps { return { ...this.props } }
}
