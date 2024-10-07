import { Component, OnInit } from '@angular/core';
import { FilmeService } from '../../services/filme.service';
import { ListagemFilme } from '../../models/listagem-filme.model';
import { formatDate, NgClass, NgForOf, NgIf } from '@angular/common';
import { ResultadoBuscaFilme } from '../../models/resultado-busca-filme.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BarraBuscaComponent } from "../barra-busca/barra-busca.component";

@Component({
  selector: 'app-busca',
  standalone: true,
  imports: [RouterLink, NgClass, NgForOf, NgIf, BarraBuscaComponent],
  templateUrl: './busca.component.html',
})

export class BuscaComponent {
  public resultadoBusca?: ResultadoBuscaFilme;

  constructor( private route: ActivatedRoute, private filmeService: FilmeService) {

    route.queryParams.subscribe((params) => {
      this.buscar(params['query']);
    });
  }

  public buscar(query: string, pagina: number = 1): void {
    if (query.length < 1) return;

    this.filmeService.buscarFilmes(query, pagina).subscribe((res) => {
      const novoResultado = this.mapearResultadoBusca(res);

      this.resultadoBusca = novoResultado;
    });
  }

  public mapearCorDaNota(porcentagemNota: string): string {
    const numeroNota = Number(porcentagemNota);

    if (numeroNota > 0 && numeroNota <= 30) return 'app-borda-nota-mais-baixa';
    else if (numeroNota > 30 && numeroNota <= 50) return 'app-borda-nota-baixa';
    else if (numeroNota > 50 && numeroNota <= 75) return 'app-borda-nota-media';
    else return 'app-borda-nota-alta';
  }

  private mapearResultadoBusca(obj: any): ResultadoBuscaFilme {
    return {
      pagina: obj.page,
      quantidadePaginas: obj.total_pages,
      quantidadeResultados: obj.total_results,
      filmes: obj.results.map(this.mapearListagemFilme),
    };
  }

  private mapearListagemFilme(obj: any): ListagemFilme {
    return {
      id: obj.id,
      titulo: obj.title,
      lancamento: obj.release_date ? formatDate(obj.release_date, 'mediumDate', 'pt-BR') : 'Data não disponível',
      urlImagem: 'https://image.tmdb.org/t/p/w300/' + obj.poster_path,
      porcentagemNota: (obj.vote_average * 10).toFixed(0),
    };
  }
}
