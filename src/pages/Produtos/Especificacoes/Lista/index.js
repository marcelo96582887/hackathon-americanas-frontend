import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { FiX, FiChevronsRight, FiChevronRight, FiChevronsLeft, FiChevronLeft } from 'react-icons/fi';
import api from '../../../../services/api';
import { Paginator, Page, SToolbar, Confirmar } from './style';
import './style.css';


export default function ListaEspecificacoesProduto(props) {

  const [idProduto, setIdProduto] = useState(0);
  const [nomeProduto, setNomeProduto] = useState('');
  const [registros, setRegistros] = useState([]);
  const [sel, setSel] = useState(new Map());
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [init, setInit] = useState(false);
  const [params, setParams] = useState({});

  if (props.location.state?.init && !init) {
    setInit(true);
    const { params } = props.location.state;
    setParams(params);
    setIdProduto(params.id);
    setNomeProduto(params.nome);
  }


  async function refresh(page = 1) {
    const limit = 10;
    // se ja existe um loading em andamento não faz nada
    if (loading) return;

    if (total > 0 && registros.length === total) return;
    if (page > totalPage && totalPage > 0) return;

    setLoading(true);

    try {
      const response = await api.get('produtos_especificacoes', { params: { id_produto: idProduto,  page } });
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

  function handleCheckBox(e) {
    const reg = e.target.id;
    const ok = sel.has(reg);
    if (ok) {
      sel.delete(reg);
    } else {
      sel.set(reg, e);
    }
    setSel(sel);
  }

  function handleClose() {
    history.goBack();
  }

  async function handleConfirmar() {
    let ok = true;
    sel.forEach(async (key, item) => {
      try {
        const reg = JSON.parse(item);
        const data = { id_produto: idProduto, id_especificacao: reg.id };
        await api.post('especificacoes_produtos', data);
      } catch (error) {
        alert('Itens não cadastrados!!!');
        ok = false;
      }
    })

    if (ok) {
      sel.clear();
      handleClose();
    }

  }

  return (
    <Container fluid>
      <SToolbar>
        <h4>Selecionar especificações para o produto {nomeProduto}</h4>
        <button type='button'>
          <FiX size={20} color="#a8a8b3" onClick={() => { handleClose() }} />
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
            <tr key={registro.id} >
              <td>{registro.id}</td>
              <td>{registro.nome}</td>
              <td>
                <input
                  id={JSON.stringify(registro)}
                  type='checkbox'
                  onClick={(e) => { handleCheckBox(e) }}
                >
                </input>
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
      <Confirmar><button className='btn btn-primary' onClick={() => handleConfirmar()}>Confirmar</button></Confirmar>
    </Container>

  );

}