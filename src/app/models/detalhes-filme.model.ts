import { MembroCreditos } from "./membro-creditos.model";
import { VideoFilme } from "./video-filme.model";

export interface DetalhesFilme {
  id: number;
  titulo: string;
  sinopse: string;
  lancamento: string;
  porcentagemNota: string;
  urlPoster: string;
  urlFundo: string;

  generos: string;

  videos: VideoFilme[];

  elencoPrincipal: MembroCreditos[];

  favorito: boolean;
}


