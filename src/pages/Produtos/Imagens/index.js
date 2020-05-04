import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { FiX, FiEdit2, FiTrash2, FiChevronsRight, FiChevronRight, FiChevronsLeft, FiChevronLeft, FiPlus } from 'react-icons/fi';
import api from '../../../services/api';
import { Paginator, Page, Toolbar } from './style';

export default function ImagensProduto(props) {

  const [itens, setItens] = useState([]);
  const [produto, setProduto] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [init, setInit] = useState(false);

  if (props.location.state?.init && !init) {
    setInit(true);
    const { registro } = props.location.state;
    if (registro) {
      setProduto(registro);
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
      const response = await api.get('imagem_produtos', { params: { id_produto: produto.id, page } });
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

  async function handleDeleteImagem(registro) {
    try {
      await api.delete(`imagem_produtos/${registro.id}`);
      const index = itens.length - 1;
      if (index >= 0) itens.pop();
      setItens(itens.filter(item => item.id !== registro.id && item.id && registro.id));
    } catch (err) {
      alert('Erro ao deletar registro, tente novamente.');
    }
  }

  function handleUpdateImagem(registro) {
    console.log('update aqui');
    history.push('/produtos/imagens/cadastro', { registros: { produto: produto, imagem: registro, action: { insert: false } }, init: true });
  }

  function handleInsertImagem() {
    history.push('/produtos/imagens/cadastro', { registros: { produto: produto, imagem: null, action: { insert: true } }, init: true });
  }

  return (
    <Container fluid>
      <Toolbar>
        <h4>Imagens do Produto {produto.descricao}</h4>
        <div>
          <button type='button' onClick={() => handleInsertImagem()} >
            <FiPlus size={20} color="#a8a8b3" />
          </button>
          <button type='button' onClick={() => { history.push('/produtos') }} >
            <FiX size={20} color="#a8a8b3" />
          </button>

        </div>
      </Toolbar>
      <Table responsive>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Link</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {itens.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nome}</td>
              <td>{item.link}</td>
              <td>
                <button type='button' onClick={() => handleUpdateImagem(item)}>
                  <FiEdit2 size={20} color="#a8a8b3" />
                </button>
                <button type='button' onClick={() => handleDeleteImagem(item)}>
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