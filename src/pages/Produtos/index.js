import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiFileText, FiImage, FiGrid, FiChevronsRight, FiChevronRight, FiChevronsLeft, FiChevronLeft, FiPlus } from 'react-icons/fi';
import api from '../../services/api';
import { Paginator, Page, Toolbar } from './style';

export default function Produtos() {

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
      const response = await api.get('produtos', { params: { page } });
      const { ret, totalReg } = response.data;
      console.log(ret);
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

  async function handleDelete(id, codigo) {
    try {
      await api.delete(`produtos/${id}/${codigo}`);
      const index = registros.length - 1;
      if (index >= 0) registros.pop();
      setRegistros(registros.filter(registro => registro.id !== id && registro.codigo !== codigo));
    } catch (err) {
      alert('Erro ao deletar registro, tente novamente.');
    }
  }

  function handleUpdate(id, codigo, descricao, saldo_estoque, id_fabricante, fabricante, codigo_barras, qrcode) {
    history.push('/produtos/manter', { id, codigo, descricao, saldo_estoque, id_fabricante, fabricante, codigo_barras, qrcode, init: true });
  }

  function handleCadastro() {
    history.push('/produtos/manter');
  }

  function handleListaImagens(registro) {
    history.push('produtos/imagens', { registro, init: true});
  }

  function handleCadastrarQrcode(registro) {
    let acao = true;
    if(registro.link) acao = false;
    history.push('produtos/qrcode', { registros: {produto: registro, action: {insert: acao}}, init: true});
  }

  function handleVincularEspecificacao(registro) {
    history.push('produtos/especificacoes', { registros: {produto: registro}, init: true});
  }

  return (
    <Container fluid>
      <Toolbar>
        <h4>Produtos</h4>
        <button type='button' onClick={() => { handleCadastro() }} >
          <FiPlus size={20} color="#a8a8b3" />
        </button>
      </Toolbar>
      <Table responsive>
        <thead>
          <tr>
            <th>Código</th>
            <th>Produto</th>
            <th>Descrição</th>
            <th>Saldo Estoque</th>
            <th>Fabricante</th>
            <th>Código de Barras</th>
            <th>Qrcode</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {registros.map(registro => (
            <tr key={registro.id}>
              <td>{registro.id}</td>
              <td>{registro.codigo}</td>
              <td>{registro.descricao}</td>
              <td>{registro.saldo_estoque}</td>
              <td hidden={true}>{registro.id_fabricante}</td>
              <td>{registro.fabricante}</td>
              <td>{registro.codigo_barras}</td>
              <td>{registro.link}</td>
              <td hidden={true}>{registro.qrcode}</td>
              <td>
                <button type="button" onClick={() => handleVincularEspecificacao(registro)}>
                  <FiFileText size={20} color="a8a8b3" />
                </button>
                <button type='button' onClick={() => handleListaImagens(registro)}>
                  <FiImage size={20} color="#a8a8b3" />
                </button>
                <button type='button' onClick={() => handleCadastrarQrcode(registro)}>
                  <FiGrid size={20} color="#a8a8b3" />
                </button>
                <button type='button' onClick={() => handleUpdate(registro.id, registro.codigo, registro.descricao,
                  registro.saldo_estoque, registro.id_fabricante, registro.fabricante, registro.codigo_barras, registro.qrcode)}>
                  <FiEdit2 size={20} color="#a8a8b3" />
                </button>
                <button type='button' onClick={() => handleDelete(registro.id, registro.codigo)}>
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