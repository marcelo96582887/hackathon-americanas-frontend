import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { FiCheck, FiMaximize, FiX, FiTrash2, FiChevronsRight, FiChevronRight, FiChevronsLeft, FiChevronLeft, FiPlus } from 'react-icons/fi';
import api from '../../../../services/api';
import { Paginator, Page, Toolbar, Confirmar } from './style';
import './style.css';


export default function ItemParametrosEspecificacao(props) {

  const [idEspecificacao, setIdEspecificacao] = useState(0);
  const [nomeEspecificacao, setNomeEspecificacao] = useState('');
  const [registros, setRegistros] = useState([]);
  const [sel, setSel] = useState(new Map());
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [init, setInit] = useState(false);


  if (props.location.state?.init && !init) {
    console.log(props);
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

    if (total > 0 && registros.length === total) return;
    if (page > totalPage && totalPage > 0) return;

    setLoading(true);

    try {
      const response = await api.get('especificacoes_parametros', { params: { id_especificacao:idEspecificacao, page } });
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
  }

  function handleClose() {
    //history.push('/especificacoes_item', { id: id_especificacao, nome: nome_especificacao, init: true });
    history.goBack();
  }

  async function handleConfirmar() {
    const ok = true;
    sel.forEach(async (key, item) => {
      try {
        const reg = JSON.parse(item);
        const data = { id_especificacao: idEspecificacao, id_chave_valor: reg.id };
        const response = await api.post('especificacoes_itens', data);
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
      <Toolbar>
        <h4>Selecionar Parâmetros para a especificação {nomeEspecificacao}</h4>
        <button type='button'>
          <FiX size={20} color="#a8a8b3" onClick={() => { handleClose() }} />
        </button>
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
          {registros.map(registro => (
            <tr key={registro.id} >
              <td>{registro.id}</td>
              <td>{registro.chave}</td>
              <td>{registro.valor}</td>
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