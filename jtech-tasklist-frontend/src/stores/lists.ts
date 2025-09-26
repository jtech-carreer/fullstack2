import { defineStore } from 'pinia';
import { useLocalStorage } from '@/composables/useLocalStorage';
import type { Lista } from '@/types';
//import { v4 as uuidv4 } from 'uuid';

const getNextId = (items: Lista[]): number => {
  const ids = items.map((item) => item.id);
  const maxId = ids.length > 0 ? Math.max(...ids) : 0
  return maxId + 1
}
const listas: import('vue').Ref<Lista[]> = useLocalStorage('jtech-lists', []);

export const useListasStore = defineStore('listas', {
  state: () => ({
    listas: listas.value,
    listaAtivaId: listas.value.length > 0 ? listas.value[0].id : 0,
  }),
  actions: {
    criarLista(nome: string) {
      const novaLista: Lista = {
        id: getNextId(this.listas),
        nome,
        criadaEm: Date.now(),
      }
      this.listas.push(novaLista)
      this.listaAtivaId = novaLista.id
    },

    excluirLista(id: number) {
      listas.value = listas.value.filter((lista) => lista.id !== id)
      this.listas = listas.value
      if (this.listaAtivaId === id && this.listas.length > 0) {
        this.listaAtivaId = this.listas[0].id
      } else if (this.listas.length === 0) {
        this.listaAtivaId = 0
      }
    },
    renomearLista(id: number, nome: string) {
      const lista = this.listas.find((l) => l.id === id)
      if (lista) {
        lista.nome = nome
      }
    },
    definirListaAtiva(id: number) {
      this.listaAtivaId = id
    },
  },
})
