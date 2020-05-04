import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FiX } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import api from '../../../services/api';
import { Toolbar } from '../style';

export default function ManterEspecificacoes(props) {

  const history = useHistory();
  const [inputCodigo, setInputCodigo] = useState('');
  const [inputNome, setInputNome] = useState('');
  const [MsgErrorCodigo, setMsgErrorCodigo] = useState(null);
  const [MsgErrorNome, setMsgErrorNome] = useState(null);
  const [init, setInit] = useState(false);
  const [action, setAction] = useState(true);

  if (props.location.state?.init && !init) {
    setInit(true);
    setMsgErrorCodigo(null);
    const { id, nome } = props.location.state;
    if (id) {
      setInputCodigo(id);
      setInputNome(nome);
      setAction(false);
    }
  }

  function handleValidaNome() {
    setMsgErrorNome(null);
    if (inputNome.length === 0) {
      setMsgErrorNome('Descrição inválida!!!');
      return true;
    }
    return false;
  }

  async function handleInsert() {
    if (!handleValidaNome()) {
      let ret = null;
      await api.post('especificacoes', {
        nome: inputNome
      }).then(result => { ret = result.data })
        .catch(error => { ret = error });

      const { id, error } = ret;
      if (error == null) {
        setInputCodigo(id);
        setInputNome('');
      } else {
        setMsgErrorNome('Registro já cadastrado!!!')
        setTimeout(() => { setMsgErrorNome(null) }, 3000);
      }

    }
  }

  async function handleUpdate() {
    if (!handleValidaNome()) {
      let ret = null;
      await api.put('especificacoes', {
        id: inputCodigo,
        nome: inputNome
      }).then(result => { ret = result.data })
        .catch(error => { ret = error });
      const { id, error } = ret;
      if (error == null) {
        setInputCodigo('');
        setInputNome('');
        history.push('/especificacoes');
      } else {
        setMsgErrorNome('Registro já cadastrado!!!')
        setTimeout(() => { setMsgErrorNome(null) }, 3000);
      }
    }
  }

  return (
    <Container fluid >
      <Toolbar>
        <h4>Manter Especificações</h4>
        <button type='button' onClick={() => { history.push('/especificacoes') }} >
          <FiX size={20} color="#a8a8b3" />
        </button>
      </Toolbar>

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
              <Alert variant='danger' hidden={MsgErrorCodigo == null ? true : false} >{MsgErrorCodigo}</Alert>
            </div>

            <Form.Group controlId='formNome'>
              <Form.Label>Descrição</Form.Label>
              <Form.Control placeholder='Descrição da Especificação'
                value={inputNome} onChange={(e) => setInputNome(e.target.value)}
                onBlur={handleValidaNome}
              />
            </Form.Group>
            <Alert variant='danger' hidden={MsgErrorNome == null ? true : false}>{MsgErrorNome}</Alert>
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


