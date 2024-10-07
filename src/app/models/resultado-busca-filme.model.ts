import { ListagemFilme } from "./listagem-filme.model";

export interface ResultadoBuscaFilme {
  pagina: number;
  quantidadePaginas: number;
  quantidadeResultados: number;
  filmes: ListagemFilme[];
}
