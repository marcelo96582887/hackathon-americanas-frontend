import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiChevronsRight, FiChevronRight, FiChevronsLeft, FiChevronLeft, FiPlus } from 'react-icons/fi';
import api from '../../services/api';
import { Paginator, Page, SToolbar } from './style';
import Toolbar from '../Toolbar';

export default function Especificacoes() {

  const [especificacoes, setEspecificacoes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const history = useHistory();
  const [page, setPage] = useState(1);

  async function refresh(page = 1) {

    const limit = 10;
    // se ja existe um loading em andamento não faz nada
    if (loading) return;

    if (total > 0 && especificacoes.length === total) return;
    if (page > totalPage && totalPage > 0) return;

    setLoading(true);

    try {
      const response = await api.get('especificacoes', { params: { page } });
      const { ret, totalReg } = response.data;
      setTotal(totalReg);
      setPage(page + 1);
      setEspecificacoes(ret);
      setLoading(false);
      setTotalPage(Number.parseInt(totalReg / limit) + 1);
    } catch (error) {
      alert('Erro na leitura de dados: ', error);
    }

  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleDeleteEspecificacao(id) {
    try {
      await api.delete(`especificacoes/${id}`);
      const index = especificacoes.length - 1;
      if (index >= 0) especificacoes.pop();
      setEspecificacoes(especificacoes.filter(especificacao => especificacao.id !== id));
    } catch (err) {
      alert('Erro ao deletar registro, tente novamente.');
    }
  }

  function handleUpdateEspecificacao(id, nome) {
    history.push('/especificacoes/manter', { id, nome, init: true });
  }

  function handleCadastroEspecificacao() {
    history.push('/especificacoes/manter');
  }

  function handleInserirItem(id, nome){
    history.push('/especificacoes/item', {id, nome, init: true});
  }

  return (
    <Container fluid>
      <Toolbar />
      <SToolbar>
        <h4>Especificações</h4>
        <button type='button' onClick={() => { handleCadastroEspecificacao() }} >
          <FiPlus size={20} color="#a8a8b3" />
        </button>
      </SToolbar>
      <Table responsive>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descrição</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {especificacoes.map(especificacao => (
            <tr key={especificacao.id}>
              <td>{especificacao.id}</td>
              <td>{especificacao.nome}</td>
              <td>
                <button type='button' onClick={() => handleInserirItem(especificacao.id, especificacao.nome)}>
                  <FiPlus size={20} color="#a8a8b3" />
                </button>
                <button type='button' onClick={() => handleUpdateEspecificacao(especificacao.id, especificacao.nome)}>
                  <FiEdit2 size={20} color="#a8a8b3" />
                </button>
                <button type='button' onClick={() => handleDeleteEspecificacao(especificacao.id)}>
                  <FiTrash2 size={20} color="#a8a8b3" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </Table>
      <Paginator>
        <button type='button' onClick={() => refresh(1)}>
          <FiChevronsLeft size={20} color="#a8a8b3" />
        </button>
        <button type='button' onClick={() => refresh(page - 2)}>
          <FiChevronLeft size={20} color="#a8a8b3" />
        </button>
        <Page>{page - 1}</Page>
        <button type='button' onClick={() => refresh(page)}>
          <FiChevronRight size={20} color="#a8a8b3" />
        </button>
        <button type='button' onClick={() => refresh(totalPage)}>
          <FiChevronsRight size={20} color="#a8a8b3" />
        </button>
      </Paginator>
    </Container>

  );

}