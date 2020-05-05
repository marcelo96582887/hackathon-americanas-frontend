import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FiX } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import api from '../../../../services/api';
import { SToolbar } from '../style';
import { ImgPreview } from './style';

export default function CadastroImagensProduto(props) {

  const history = useHistory();
  const [registros, setRegistros] = useState({});
  const [inputCodigo, setInputCodigo] = useState('');
  const [inputNome, setInputNome] = useState('');
  const [inputLink, setInputLink] = useState('');
  const [msgErrorNome, setMsgErrorNome] = useState(null);
  const [msgErrorLink, setMsgErrorLink] = useState(null);
  const [init, setInit] = useState(false);
  const [action, setAction] = useState(true);
  const [imgSrc, setImgSrc] = useState('');

  if (props.location.state?.init && !init) {
    setInit(true);
    const { registros } = props.location.state;
    setRegistros(registros);
    if (!registros.action.insert) {
      setInputCodigo(registros.imagem.id);
      setInputNome(registros.imagem.nome);
      setInputLink(registros.imagem.link);
      setAction(false);
    }
  }

  function handleValidaNome() {
    setMsgErrorNome(null);
    if (inputNome.length === 0) {
      setMsgErrorNome('Nome inválido!!!');
      return true;
    }
    return false;
  }

  function handleValidaLink() {
    setMsgErrorLink(null);
    if (inputLink.length === 0) {
      setMsgErrorLink('Link inválido!!!');
      return true;
    }
    return false;
  }

  async function handleInsert() {
    if (!handleValidaLink() && !handleValidaNome()) {
      let ret = null;
      await api.post('imagem_produtos', {
        id_produto: registros.produto.id,
        nome: inputNome,
        link: inputLink,
        src: imgSrc
      }).then(result => { ret = result.data })
        .catch(error => { ret = error });

      const { error } = ret;
      if (error == null) {
        setInputCodigo('');
        setInputNome('');
        setInputLink('');
        setImgSrc('');
      } else {
        setMsgErrorLink('Registro já cadastrado!!!')
        setTimeout(() => { setMsgErrorLink(null) }, 3000);
      }
    }
  }

  async function handleUpdate() {
    if (!handleValidaLink() && !handleValidaNome()) {

      let ret = null;
      await api.put('imagem_produtos', {
        id: inputCodigo,
        id_produto: registros.produto.id,
        nome: inputNome,
        link: inputLink,
        src: imgSrc
      }).then(result => { ret = result.data })
        .catch(error => { ret = error });
      const { error } = ret;
      if (error == null) {
        setInputCodigo('');
        setInputNome('');
        setInputLink('');
        setImgSrc('');
        history.goBack();
      } else {
        setMsgErrorLink('Registro já cadastrado!!!')
        setTimeout(() => { setMsgErrorLink(null) }, 3000);
      }
    }
  }

  async function change(e) {
    let files = e.target.files;
    if (files.length > 0) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = async (e) => {
        const formData = { file: e.target.result };
        setImgSrc(formData.file);
      }
    }
  }

  return (
    <Container fluid >
      <SToolbar>
        <h4>Produto {registros?.produto?.descricao} - Cadastro de Imagem</h4>
        <button type='button' onClick={() => { history.goBack() }} >
          <FiX size={20} color="#a8a8b3" />
        </button>
      </SToolbar>

      <Row className='justify-content-center'>
        <Col xs lg='4'>
          <Form>
            <div hidden={action}>
              <Form.Group controlId='formCodigo'>
                <Form.Label className='form-label'>Código</Form.Label>
                <Form.Control type='number' placeholder='Código da Imagem'
                  value={inputCodigo}
                  disabled={true}
                />
              </Form.Group>
            </div>

            <Form.Group controlId='formNome'>
              <Form.Label>Nome</Form.Label>
              <Form.Control placeholder='Nome da Imagem'
                value={inputNome} onChange={(e) => setInputNome(e.target.value)}
                onBlur={handleValidaNome}
              />
            </Form.Group>
            <Alert variant='danger' hidden={msgErrorNome == null ? true : false}>{msgErrorNome}</Alert>

            <Form.Group controlId='formLink'>
              <Form.Label>Link</Form.Label>
              <Form.Control placeholder='Link da Imagem'
                value={inputLink} onChange={(e) => setInputLink(e.target.value)}
                onBlur={handleValidaLink}
                disabled={true}
              />
            </Form.Group>
            <Alert variant='danger' hidden={msgErrorLink == null ? true : false}>{msgErrorLink}</Alert>
            <ImgPreview>
              <input type='file' name='file' onChange={(e) => change(e)} />
              <br></br>
              <img id="imgPreview" src={imgSrc}></img>
            </ImgPreview>

            <Row className='justify-content-center'>
              <Col xs lg='4'>
                <Button onClick={!registros?.action?.insert ? handleUpdate : handleInsert} className='home-button' variant='primary'>Confirmar</Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>

  );
};


