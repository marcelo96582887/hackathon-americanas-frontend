import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FiX } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import api from '../../../services/api';
import { SToolbar } from '../style';

export default function ManterProdutos(props) {

  const history = useHistory();
  const [inputCodigo, setInputCodigo] = useState('');
  const [inputProduto, setInputProduto] = useState('');
  const [inputDescricao, setInputDescricao] = useState('');
  const [inputSaldo, setInputSaldo] = useState('');
  const [idFabricante, setIdFabricante] = useState('');
  const [inputFabricante, setInputFabricante] = useState('');
  const [inputCodigoBarras, setInputCodigoBarras] = useState('');
  const [msgErrorProduto, setMsgErrorProduto] = useState(null);
  const [msgErrorDescricao, setMsgErrorDescricao] = useState(null);
  const [msgErrorSaldo, setMsgErrorSaldo] = useState(null);
  const [msgErrorFabricante, setMsgErrorFabricante] = useState(null);
  const [msgErrorCodigoBarras, setMsgErrorCodigoBarras] = useState(null);
  const [init, setInit] = useState(false);
  const [action, setAction] = useState(true);

  if (props.location.state?.init && !init) {
    setInit(true);
    const { id, codigo, descricao, saldo_estoque, id_fabricante, fabricante, codigo_barras } = props.location.state;
    if (id) {
      setInputCodigo(id);
      setInputProduto(codigo);
      setInputDescricao(descricao);
      setInputSaldo(saldo_estoque);
      setIdFabricante(id_fabricante);
      setInputFabricante(fabricante);
      setInputCodigoBarras(codigo_barras);
      setAction(false);
    }
  }

  function handleValidaProduto() {
    setMsgErrorProduto(null);
    if (inputProduto.length === 0) {
      setMsgErrorProduto('Produto inválido!!!');
      return true;
    }
    return false;
  }

  function handleValidaDescricao() {
    setMsgErrorDescricao(null);
    if (inputDescricao.length === 0) {
      setMsgErrorDescricao('Descrição inválida!!!');
      return true;
    }
    return false;
  }

  function handleValidaSaldo() {
    setMsgErrorSaldo(null);
    if (inputSaldo < 0) {
      setMsgErrorSaldo('Saldo inválido!!!');
      return true;
    }
    return false;
  }

  function handleValidaFabricante() {
    setMsgErrorFabricante(null);
    if (inputFabricante.length === 0) {
      setMsgErrorFabricante('Fabricante inválido!!!');
      return true;
    }
    return false;
  }

  function handleValidaCodigoBarras() {
    setMsgErrorCodigoBarras(null);
    if (inputCodigoBarras?.length === 0) {
      setMsgErrorCodigoBarras('Código de barras inválido!!!');
      return true;
    }
    return false;
  }



  async function handleInsert() {

    if (!handleValidaCodigoBarras() && !handleValidaDescricao() && !handleValidaFabricante() && !handleValidaProduto() && !handleValidaSaldo()) {

      const data = {
        codigo: inputProduto,
        descricao: inputDescricao,
        saldo_estoque: inputSaldo,
        id_fabricante: 0,
        descricao_fabricante: inputFabricante,
        codigo_barras: inputCodigoBarras
      }
      try {
        api.post('produtos', data);
        setInputCodigo('');
        setInputProduto('');
        setInputDescricao('');
        setInputSaldo('');
        setInputFabricante('');
        setIdFabricante('');
        setInputCodigoBarras('');

      } catch (error) {
        setMsgErrorCodigoBarras('Erro na inclusão do produto: ', error);
        setTimeout(() => { setMsgErrorCodigoBarras(null) }, 3000);
      }
    }
  }

  async function handleUpdate() {
    if (!handleValidaCodigoBarras() && !handleValidaDescricao() && !handleValidaFabricante() && !handleValidaProduto() && !handleValidaSaldo()) {

      let ret = null;
      await api.put('produtos', {
        id: inputCodigo,
        codigo: inputProduto,
        descricao: inputDescricao,
        saldo_estoque: inputSaldo,
        id_fabricante: idFabricante,
        descricao_fabricante: inputFabricante,
        codigo_barras: inputCodigoBarras
      }).then(result => { ret = result.data })
        .catch(error => { ret = error });
      const { error } = ret;
      if (error == null) {
        setInputCodigo('');
        setInputProduto('');
        setInputDescricao('');
        setInputSaldo('');
        setInputFabricante('');
        setIdFabricante('');
        setInputCodigoBarras('');
        history.push('/produtos');
      } else {
        setMsgErrorCodigoBarras('Registro já cadastrado!!!')
        setTimeout(() => { setMsgErrorCodigoBarras(null) }, 3000);
      }
    }
  }

  return (
    <Container fluid >
      <SToolbar>
        <h4>Manter Produtos</h4>
        <button type='button' onClick={() => { history.push('/produtos') }} >
          <FiX size={20} color="#a8a8b3" />
        </button>
      </SToolbar>

      <Row className='justify-content-center'>
        <Col xs lg='4'>
          <Form>
            <div hidden={action}>
              <Form.Group controlId='formCodigo'>
                <Form.Label className='form-label'>Código</Form.Label>
                <Form.Control type='number' placeholder='Código'
                  value={inputCodigo}
                  disabled={true}
                />
              </Form.Group>
            </div>

            <Form.Group controlId='formProduto'>
              <Form.Label>Produto</Form.Label>
              <Form.Control placeholder='Código do Produto'
                value={inputProduto} onChange={(e) => setInputProduto(e.target.value)}
                onBlur={handleValidaProduto}
                disabled={!action}
              />
            </Form.Group>
            <Alert variant='danger' hidden={msgErrorProduto == null ? true : false}>{msgErrorProduto}</Alert>

            <Form.Group controlId='formDescricao'>
              <Form.Label>Descrição</Form.Label>
              <Form.Control placeholder='Descrição do Produto'
                value={inputDescricao} onChange={(e) => setInputDescricao(e.target.value)}
                onBlur={handleValidaDescricao}
              />
            </Form.Group>
            <Alert variant='danger' hidden={msgErrorDescricao == null ? true : false}>{msgErrorDescricao}</Alert>

            <Form.Group controlId='formSaldo'>
              <Form.Label>Saldo</Form.Label>
              <Form.Control placeholder='Saldo total do Produto' type='number'
                value={inputSaldo} onChange={(e) => setInputSaldo(e.target.value)}
                onBlur={handleValidaSaldo}
              />
            </Form.Group>
            <Alert variant='danger' hidden={msgErrorSaldo == null ? true : false}>{msgErrorSaldo}</Alert>

            <Form.Group controlId='formFabricante'>
              <Form.Label>Fabricante</Form.Label>
              <Form.Control placeholder='Fabricante'
                value={inputFabricante} onChange={(e) => setInputFabricante(e.target.value)}
                onBlur={handleValidaFabricante}
              />
            </Form.Group>
            <Alert variant='danger' hidden={msgErrorFabricante == null ? true : false}>{msgErrorFabricante}</Alert>

            <Form.Group controlId='formCodigoBarras'>
              <Form.Label>Código de Barras</Form.Label>
              <Form.Control placeholder='Código de Barras'
                value={inputCodigoBarras} onChange={(e) => setInputCodigoBarras(e.target.value)}
                onBlur={handleValidaCodigoBarras}
              />
            </Form.Group>
            <Alert variant='danger' hidden={msgErrorCodigoBarras == null ? true : false}>{msgErrorCodigoBarras}</Alert>

            <Row className='justify-content-center'>
              <Col xs lg='4'>
                <Button onClick={props.location.state?.init !== undefined ? handleUpdate : handleInsert} className='home-button' variant='primary'>Confirmar</Button>
              </Col>
            </Row>

          </Form>
        </Col>
      </Row>
    </Container>

  );
};


