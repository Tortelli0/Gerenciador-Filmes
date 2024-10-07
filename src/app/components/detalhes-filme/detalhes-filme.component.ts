import { Component, OnInit } from '@angular/core';
import { DetalhesFilme } from '../../models/detalhes-filme.model';
import { ActivatedRoute } from '@angular/router';
import { FilmeService } from '../../services/filme.service';
import { formatDate, NgClass, NgForOf, NgIf } from '@angular/common';
import { GeneroFilme } from '../../models/genero-filme.model';
import { VideoFilme } from '../../models/video-filme.model';
import { DomSanitizer } from '@angular/platform-browser';
import { MembroCreditos } from '../../models/membro-creditos.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { FilmeFavorito } from '../../models/filme-favorito.moldel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalhes-filme',
  standalone: true,
  imports: [NgIf, NgClass, NgForOf],
  templateUrl: './detalhes-filme.component.html',
  styleUrl: './detalhes-filme.component.scss'
})

export class DetalhesFilmeComponent implements OnInit{
  public detalhes?: DetalhesFilme;

  constructor (
    private route: ActivatedRoute,
    private filmeService: FilmeService,
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
      const id = this.route.snapshot.params['id'];

      if (!id){
        throw new Error('Não foi possível obter informações sobre o filme requisitado');
      }

      this.filmeService.selecionarDetalhesFilmePorId(id).subscribe((f) => {
        this.detalhes = this.mapearDetalhesFilme(f);
      });
  }

  public alterarStatusFavorito(id: number) {
    if (!this.detalhes) return;

    if (this.localStorageService.favoritoJaExiste(id)) {
      this.detalhes.favorito = false;

      this.localStorageService.removerFavorito(id);

      this.toastrService.success('O Favorito foi removido com sucesso!', 'Favorito removido');
    } else{
      this.detalhes.favorito = true;

      const novoFavorito: FilmeFavorito = {
        id: id,
        titulo: this.detalhes.titulo,
        urlImagem: this.detalhes.urlPoster
      };

      this.localStorageService.salvarFavorito(novoFavorito);

      this.toastrService.success('O Favorito foi adicionado com sucesso!', 'Favorito adicionado');
    }
  }

  public mapearCorDaNota(porcentagemNota: string): string {
    const numeroNota = Number(porcentagemNota);

    if (numeroNota > 0 && numeroNota <= 30) return 'app-borda-nota-mais-baixa';

    else if (numeroNota > 30 && numeroNota <= 50) return 'app-borda-nota-baixa';

    else if (numeroNota > 50 && numeroNota <= 75) return 'app-borda-nota-media';

    else return 'app-borda-nota-alta';
  }

  private mapearDetalhesFilme(obj: any): DetalhesFilme {
    return {
      id: obj.id,
      titulo: obj.title,
      sinopse: obj.overview,
      lancamento: formatDate(obj.release_date, 'mediumDate', 'pt-BR'),
      porcentagemNota: (obj.vote_average * 10).toFixed(0),
      urlPoster: 'https://image.tmdb.org/t/p/w300' + obj.poster_path,
      urlFundo: 'https://image.tmdb.org/t/p/original' + obj.backdrop_path,

      generos: obj.genres.map(this.mapearGeneroFilme)
      .map((g: GeneroFilme) => g.nome)
      .join(', '),

      videos: obj.videos.results.map((v: any) => this.mapearVideoFilme(v)),

      elencoPrincipal: obj.credits.cast.map(this.mapearElencoFilme),

      favorito: this.localStorageService.favoritoJaExiste(obj.id)
    }
  }

  private mapearGeneroFilme(obj: any): GeneroFilme {
    return {
      id: obj.id,
      nome: obj.name,
    }
  }

  private mapearVideoFilme(obj: any): VideoFilme {
    return{
      id: obj.id,
      sourceUrl: this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + obj.key),
    }
  }

  private mapearElencoFilme(obj: any): MembroCreditos {
    return{
      id: obj.id,
      nome: obj.name,
      papel: obj.character,
      urlImagem: 'https://image.tmdb.org/t/p/w300' + obj.profile_path,
    }
  }
}
