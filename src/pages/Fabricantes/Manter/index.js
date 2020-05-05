import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FiX } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import api from '../../../services/api';
import { SToolbar } from '../style';

export default function ManterFabricantes(props) {

  const history = useHistory();
  const [inputCodigo, setInputCodigo] = useState('');
  const [inputDescricao, setInputDescricao] = useState('');
  const [msgErrorCodigo, setMsgErrorCodigo] = useState(null);
  const [msgErrorDescricao, setMsgErrorDescricao] = useState(null);
  const [init, setInit] = useState(false);
  const [action, setAction] = useState(true);

  if (props.location.state?.init && !init) {
    setInit(true);
    setMsgErrorCodigo(null);
    const { id, descricao } = props.location.state;
    if (id) {
      setInputCodigo(id);
      setInputDescricao(descricao);
      setAction(false);
    }
  }

  function handleValidaDescricao() {
    setMsgErrorDescricao(null);
    if (inputDescricao.length === 0) {
      setMsgErrorDescricao('Nome inválido!!!');
      return true;
    }
    return false;
  }

  async function handleInsert() {
    if (!handleValidaDescricao()) {
      let ret = null;
      await api.post('fabricantes', {
        descricao: inputDescricao
      }).then(result => { ret = result.data })
        .catch(error => { ret = error });

      const { id, error } = ret;
      if (error == null) {
        setInputCodigo(id);
        setInputDescricao('');
      } else {
        setMsgErrorDescricao('Registro já cadastrado!!!')
        setTimeout(() => { setMsgErrorDescricao(null) }, 3000);
      }
    }
  }

  async function handleUpdate() {
    if (!handleValidaDescricao()) {
      let ret = null;
      await api.put('fabricantes', {
        id: inputCodigo,
        descricao: inputDescricao
      }).then(result => { ret = result.data })
        .catch(error => { ret = error });
      const { id, error } = ret;
      if (error == null) {
        setInputCodigo('');
        setInputDescricao('');
        history.push('/fabricantes');
      } else {
        setMsgErrorDescricao('Registro já cadastrado!!!')
        setTimeout(() => { setMsgErrorDescricao(null) }, 3000);
      }
    }
  }

  return (
    <Container fluid >
      <SToolbar>
        <h4>Manter Fabricantes</h4>
        <button type='button' onClick={() => { history.push('/fabricantes') }} >
          <FiX size={20} color="#a8a8b3" />
        </button>
      </SToolbar>

      <Row className='justify-content-center'>
        <Col xs lg='4'>
          <Form>
            <div hidden={action}>
              <Form.Group controlId='formCodigo'>
                <Form.Label className='form-label'>Código</Form.Label>
                <Form.Control type='number' placeholder='Código da Especificação'
                  value={inputCodigo}
                  disabled={true}
                />
              </Form.Group>
              <Alert variant='danger' hidden={msgErrorCodigo == null ? true : false} >{msgErrorCodigo}</Alert>
            </div>

            <Form.Group controlId='formNome'>
              <Form.Label>Nome</Form.Label>
              <Form.Control placeholder='Nome do Fabricante'
                value={inputDescricao} onChange={(e) => setInputDescricao(e.target.value)}
                onBlur={handleValidaDescricao}
              />
            </Form.Group>
            <Alert variant='danger' hidden={msgErrorDescricao == null ? true : false}>{msgErrorDescricao}</Alert>
            <Row className='justify-content-center'>
              <Col xs lg='4'>
                <Button onClick={props.location.state?.init != undefined ? handleUpdate : handleInsert} className='home-button' variant='primary'>Confirmar</Button>
              </Col>
            </Row>

          </Form>
        </Col>
      </Row>
    </Container>

  );
};


