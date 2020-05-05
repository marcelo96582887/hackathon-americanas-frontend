import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiChevronsRight, FiChevronRight, FiChevronsLeft, FiChevronLeft, FiPlus } from 'react-icons/fi';
import api from '../../services/api';
import { Paginator, Page, SToolbar } from './style';
import Toolbar from '../Toolbar';

export default function Fabricantes() {

  const [registros, setRegistros] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const history = useHistory();
  const [page, setPage] = useState(1);

  async function refresh(page = 1) {

    const limit = 10;
    // se ja existe um loading em andamento não faz nada
    if (loading) return;

    if (total > 0 && registros.length === total) return;
    if (page > totalPage && totalPage > 0) return;

    setLoading(true);

    try {
      const response = await api.get('fabricantes', { params: { page } });
      const { ret, totalReg } = response.data;
      setTotal(totalReg);
      setPage(page + 1);
      setRegistros(ret);
      setLoading(false);
      setTotalPage(Number.parseInt(totalReg / limit) + 1);
    } catch (error) {
      alert('Erro na leitura de dados: ', error);
    }

  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleDelete(id) {
    try {
      await api.delete(`fabricantes/${id}`);
      const index = registros.length - 1;
      if (index >= 0) registros.pop();
      setRegistros(registros.filter(registro => registro.id !== id));
    } catch (err) {
      alert('Erro ao deletar registro, tente novamente.');
    }
  }

  function handleUpdate(id, descricao) {
    history.push('/fabricantes/manter', {id, descricao, init: true});
  }

  function handleCadastro(){
    history.push('/fabricantes/manter');
  }

  return (
    <Container fluid>
      <Toolbar />
      <SToolbar>
        <h4>Fabricantes</h4>
        <button type='button' onClick={() => {handleCadastro()}} >
          <FiPlus size={20} color="#a8a8b3" />
        </button>
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
          {registros.map(registro => (
            <tr key={registro.id}>
              <td>{registro.id}</td>
              <td>{registro.descricao}</td>
              <td>
                <button type='button' onClick={() => handleUpdate(registro.id, registro.descricao)}>
                  <FiEdit2 size={20} color="#a8a8b3" />
                </button>
                <button type='button' onClick={() => handleDelete(registro.id)}>
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