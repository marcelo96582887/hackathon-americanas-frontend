import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { FiX, FiTrash2, FiChevronsRight, FiChevronRight, FiChevronsLeft, FiChevronLeft, FiPlus } from 'react-icons/fi';
import api from '../../../services/api';
import { Paginator, Page, SToolbar } from './style';
import Toolbar from '../../Toolbar';

export default function EspecificacoesProduto(props) {

  const [itens, setItens] = useState([]);
  const [registros, setRegistros] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [init, setInit] = useState(false);

  if (props.location.state?.init && !init) {
    setInit(true);
    const { registros } = props.location.state;
    setRegistros(registros);
  }

  async function refresh(page = 1) {
    const limit = 10;
    // se ja existe um loading em andamento não faz nada
    if (loading) return;

    if (total > 0 && itens.length === total) return;
    if (page > totalPage && totalPage > 0) return;

    setLoading(true);

    try {
      const response = await api.get('especificacoes_produtos', { params: { id_produto: registros.produto.id, page } });
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

  async function handleDeleteEspecificacao(reg) {
    try {
      const id_especificacao = reg.id_especificacao;
      const id_produto = reg.id_produto;
      await api.delete(`especificacoes_produtos/${id_produto}/${id_especificacao}`);
      setItens(itens.filter(item => item.id_especificacao !== id_especificacao 
          && id_especificacao));
    } catch (err) {
      alert('Erro ao deletar registro, tente novamente.');
    }
  }

  return (
    <Container fluid>
      <SToolbar>
        <h4>Especificaçôes do Produto: {registros?.produto?.descricao}</h4>
        <div>
          <button type='button' onClick={() => { history.push('/produtos/especificacoes/lista', { params: {id: registros.produto.id, nome: registros.produto.descricao}, init: true }) }} >
            <FiPlus size={20} color="#a8a8b3" />
          </button>
          <button type='button' onClick={() => { history.push('/produtos') }} >
            <FiX size={20} color="#a8a8b3" />
          </button>

        </div>
      </SToolbar>
      <Table responsive>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {itens.map(item => (
            <tr key={item.id_especificacao}>
              <td hidden={true}>{item.id_produto}</td>
              <td>{item.id_especificacao}</td>
              <td>{item.nome}</td>
              <td>
                <button type='button' onClick={() => handleDeleteEspecificacao(item)}>
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