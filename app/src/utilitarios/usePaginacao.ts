// Guarda toda a lógica de lista paginada com rolagem infinita.
// Usado em ListaPontos e MinhasDoacoes.
import { useCallback, useRef, useState } from 'react';


type Pagina<T> = {
  content: T[];
  page?: { number: number; totalPages: number };
  totalPages?: number;
};

export function usePaginacao<T extends { id: string }>(
  buscar: (pagina: number) => Promise<Pagina<T>>, 
  mensagemErro: string // texto mostrado quando a API falha
) {
  const [itens, setItens] = useState<T[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const ultimaPagina = useRef(-1); 
  const temMais = useRef(false); 

 
  const buscarRef = useRef(buscar);
  buscarRef.current = buscar;

  const carregandoRef = useRef(false); 
  const versaoBusca = useRef(0); 

  const carregarPagina = useCallback(
    async (numero: number) => {
      if (numero === 0) {
        versaoBusca.current += 1;
        ultimaPagina.current = -1;
        temMais.current = false;
        setItens([]);
      }
      const versao = versaoBusca.current;

      carregandoRef.current = true;
      setCarregando(true);
      setErro('');
      try {
        const resposta = await buscarRef.current(numero);
        if (versao !== versaoBusca.current) return;

        ultimaPagina.current = numero;

        const totalPaginas = resposta.page?.totalPages ?? resposta.totalPages;
        temMais.current =
          totalPaginas !== undefined ? numero + 1 < totalPaginas : resposta.content.length > 0;

        setItens((anteriores) => {
          if (numero === 0) return resposta.content;
          const ids = new Set(anteriores.map((i) => i.id));
          return [...anteriores, ...resposta.content.filter((i) => !ids.has(i.id))];
        });
      } catch {
        if (versao !== versaoBusca.current) return;
        setErro(mensagemErro);
      } finally {
        if (versao === versaoBusca.current) {
          carregandoRef.current = false;
          setCarregando(false);
        }
      }
    },
    [mensagemErro]
  );

  const recarregar = useCallback(() => carregarPagina(0), [carregarPagina]);

  function carregarMais() {
    if (carregandoRef.current || erro !== '' || !temMais.current) return;
    carregarPagina(ultimaPagina.current + 1);
  }

  function tentarNovamente() {
    carregarPagina(ultimaPagina.current + 1);
  }

  return { itens, carregando, erro, carregarMais, recarregar, tentarNovamente };
}