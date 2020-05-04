import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FiX } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import api from '../../../services/api';
import { Toolbar } from '../style';

export default function ManterParametros(props) {

  const history = useHistory();
  const [inputCodigo, setInputCodigo] = useState('');
  const [inputChave, setInputChave] = useState('');
  const [inputValor, setInputValor] = useState('');
  const [msgErrorChave, setMsgErrorChave] = useState(null);
  const [msgErrorValor, setMsgErrorValor] = useState(null);
  const [init, setInit] = useState(false);
  const [action, setAction] = useState(true);

  if (props.location.state?.init && !init) {
    setInit(true);
    const { id, chave, valor } = props.location.state;
    if (id) {
      setInputCodigo(id);
      setInputChave(chave);
      setInputValor(valor);
      setAction(false);
    }
  }

  function handleValidaChave() {
    setMsgErrorChave(null);
    if (inputChave.length === 0) {
      setMsgErrorChave('Chave inválida!!!');
      return true;
    }
    return false;
  }

  function handleValidaValor() {
    setMsgErrorValor(null);
    if (inputValor.length === 0) {
      setMsgErrorValor('Valor inválido!!!');
      return true;
    }
    return false;
  }

  async function handleInsert() {

    if (!handleValidaChave() && !handleValidaValor()) {
      let ret = null;
      await api.post('chave_valor', {
        chave: inputChave,
        valor: inputValor
      }).then(result => { ret = result.data })
        .catch(error => { ret = error });

      const { error } = ret;
      if (error == null) {
        setInputCodigo('');
        setInputChave('');
        setInputValor('');
      } else {
        setMsgErrorValor('Registro já cadastrado!!!')
        setTimeout(() => { setMsgErrorValor(null) }, 3000);
      }

    }
  }

  async function handleUpdate() {
    if (!handleValidaChave() && !handleValidaValor()) {
      let ret = null;
      await api.put('chave_valor', {
        id: inputCodigo,
        chave: inputChave,
        valor: inputValor
      }).then(result => { ret = result.data })
        .catch(error => { ret = error });
      const { error } = ret;
      if (error == null) {
        setInputCodigo('');
        setInputChave('');
        setInputValor('');
        history.push('/parametros');
      } else {
        setMsgErrorValor('Registro já cadastrado!!!')
        setTimeout(() => { setMsgErrorValor(null) }, 3000);
      }

    }
  }
  return (
    <Container fluid >
      <Toolbar>
        <h4>Manter Parâmetros</h4>
        <button type='button' onClick={() => { history.push('/parametros') }} >
          <FiX size={20} color="#a8a8b3" />
        </button>
      </Toolbar>

      <Row className='justify-content-center'>
        <Col xs lg='4'>
          <Form>
            <div hidden={action}>
              <Form.Group controlId='formCodigo'>
                <Form.Label className='form-label'>Código</Form.Label>
                <Form.Control type='number' placeholder='Código do Parâmetro'
                  value={inputCodigo}
                  disabled={true}
                />
              </Form.Group>
            </div>

            <Form.Group controlId='formChave'>
              <Form.Label>Nome</Form.Label>
              <Form.Control placeholder='Nome do Parâmetro'
                value={inputChave} onChange={(e) => setInputChave(e.target.value)}
                onBlur={handleValidaChave}
              />
            </Form.Group>
            <Alert variant='danger' hidden={msgErrorChave == null ? true : false}>{msgErrorChave}</Alert>

            <Form.Group controlId='formValor'>
              <Form.Label>Valor</Form.Label>
              <Form.Control placeholder='Valor do Parâmetro'
                value={inputValor} onChange={(e) => setInputValor(e.target.value)}
                onBlur={handleValidaValor}
              />
            </Form.Group>
            <Alert variant='danger' hidden={msgErrorValor == null ? true : false}>{msgErrorValor}</Alert>
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


