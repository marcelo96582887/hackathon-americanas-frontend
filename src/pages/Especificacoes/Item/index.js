import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { FiX, FiTrash2, FiChevronsRight, FiChevronRight, FiChevronsLeft, FiChevronLeft, FiPlus } from 'react-icons/fi';
import api from '../../../services/api';
import { Paginator, Page, Toolbar } from './style';

export default function ItemEspecificacoes(props) {

  const [itens, setItens] = useState([]);
  const [idEspecificacao, setIdEspecificacao] = useState(0);
  const [nomeEspecificacao, setNomeEspecificacao] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [init, setInit] = useState(false);

  if (props.location.state?.init && !init) {
    setInit(true);
    const { id, nome } = props.location.state;
    if (id) {
      setIdEspecificacao(id);
      setNomeEspecificacao(nome);
    }
  }

  async function refresh(page = 1) {
    const limit = 10;
    // se ja existe um loading em andamento não faz nada
    if (loading) return;

    if (total > 0 && itens.length === total) return;
    if (page > totalPage && totalPage > 0) return;



    setLoading(true);

    try {
      const response = await api.get('especificacoes_itens', { params: { id_especificacao: idEspecificacao, page } });
      const { ret, totalReg } = response.data;
      setTotal(totalReg);
      setPage(page + 1);
      setItens(ret);
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
      const id_chave_valor = id;
      await api.delete(`especificacoes_itens/${idEspecificacao}/${id_chave_valor}`);
      const index = itens.length - 1;
      if (index >= 0) itens.pop();
      setItens(itens.filter(item => item.id !== id && item.id_especificacao && idEspecificacao));
    } catch (err) {
      alert('Erro ao deletar registro, tente novamente.');
    }
  }

  return (
    <Container fluid>
      <Toolbar>
        <h4>Parâmetros da Especificação: {nomeEspecificacao}</h4>
        <div>
          <button type='button' onClick={() => { history.push('/especificacoes/item/parametros', { id: idEspecificacao, nome: nomeEspecificacao, init: true }) }} >
            <FiPlus size={20} color="#a8a8b3" />
          </button>
          <button type='button' onClick={() => { history.push('/especificacoes') }} >
            <FiX size={20} color="#a8a8b3" />
          </button>

        </div>
      </Toolbar>
      <Table responsive>
        <thead>
          <tr>
            <th>Código</th>
            <th>Chave</th>
            <th>Valor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {itens.map(item => (
            <tr key={item.id_chave_valor}>
              <td>{item.id_chave_valor}</td>
              <td>{item.chave}</td>
              <td>{item.valor}</td>
              <td>
                <button type='button' onClick={() => handleDeleteEspecificacao(item.id_chave_valor)}>
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