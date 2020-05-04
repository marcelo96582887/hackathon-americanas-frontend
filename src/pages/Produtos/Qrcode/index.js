import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Modal } from 'react-bootstrap';
import { FiX } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import api from '../../../services/api';
import { Toolbar } from '../style';
import QRCODE from './QrcodeGenerate';


export default function QrcodeProduto(props) {

  const history = useHistory();
  const [modalShow, setModalShow] = useState(false);
  const [registros, setRegistros] = useState({});
  const [inputCodigo, setInputCodigo] = useState('');
  const [inputNome, setInputNome] = useState('');
  const [inputLink, setInputLink] = useState('');
  const [msgErrorNome, setMsgErrorNome] = useState(null);
  const [msgErrorLink, setMsgErrorLink] = useState(null);
  const [init, setInit] = useState(false);
  const [action, setAction] = useState(true);
  const [imgQrcode, setImgQrcode] = useState(null);

  if (props.location.state?.init && !init) {
    setInit(true);
    const { registros } = props.location.state;
    setRegistros(registros);
    if (!registros.action.insert) {
      setInputCodigo(registros.produto.id);
      setInputNome(registros.produto.nome);
      setInputLink(registros.produto.link);
      setImgQrcode(registros.produto.qrcode);
      setAction(false);
    }else{
      console.log(props.location.pathname);
      setInputLink(`${props.location.pathname}/viewer/${registros.produto.id}`);
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
      try {
        const response = await api.post('qrcode_produtos', {
          id_produto: registros.produto.id,
          nome: inputNome,
          link: inputLink,
          qrcode: imgQrcode
        });
        history.push('/produtos');
      } catch (error) {
        setMsgErrorLink('Registro já cadastrado!!!')
        setTimeout(() => { setMsgErrorLink(null) }, 3000);
      }
    }
  }

  async function handleUpdate() {

    if (!handleValidaLink() && !handleValidaNome()) {
      console.log('atualoou');
      try {
        const response = await api.put('qrcode_produtos', {
          id_produto: inputCodigo,
          nome: inputNome,
          link: inputLink,
          qrcode: imgQrcode
        });
        history.push('/produtos');
      } catch (error) {
        setMsgErrorLink('Registro já cadastrado: ', error)
        setTimeout(() => { setMsgErrorLink(null) }, 3000);
      }
    }
  }

  function onHide() {
    setModalShow(false);
  }

  function onShow() {
    setModalShow(true);
  }

  async function onBaixar() {
    await download();
    await onHide();
  }

  function download() {
    const canvas = document.getElementsByTagName('canvas')[0];
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    setImgQrcode(pngUrl);
    downloadLink.download = registros.produto.id + "_" + inputNome + "_" + ".png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  return (
    <Container fluid >
      <Toolbar>
        <h4>Produto {registros?.produto?.descricao} - Cadastro de Qrcode</h4>
        <button type='button' onClick={() => { history.push('/produtos') }} >
          <FiX size={20} color="#a8a8b3" />
        </button>
      </Toolbar>



      <Modal
        show={modalShow}
        onHide={() => onHide()}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="container-modal-title-vcenter">
            Geração de QRCODE
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Link: {inputLink} </h4>
          <QRCODE registros={{ nome: inputNome, link: inputLink, init: true }} />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="primary" onClick={() => onBaixar()}>Baixar</Button>
          <Button onClick={() => onHide()}>Fechar</Button>

        </Modal.Footer>
      </Modal>


      <Row className='justify-content-center'>
        <Col xs lg='4'>
          <Form>
            <div hidden={action}>
              <Form.Group controlId='formCodigo'>
                <Form.Label className='form-label'>Código</Form.Label>
                <Form.Control type='number' placeholder='Código do Qrcode'
                  value={inputCodigo}
                  disabled={true}
                />
              </Form.Group>
            </div>

            <Form.Group controlId='formNome'>
              <Form.Label>Nome</Form.Label>
              <Form.Control placeholder='Nome da Qrcode'
                value={inputNome} onChange={(e) => setInputNome(e.target.value)}
                onBlur={handleValidaNome}
              />
            </Form.Group>
            <Alert variant='danger' hidden={msgErrorNome == null ? true : false}>{msgErrorNome}</Alert>

            <Form.Group controlId='formLink'>
              <Form.Label>Link</Form.Label>
              <Form.Control placeholder='Link do Qrcode'
                value={inputLink} onChange={(e) => setInputLink(e.target.value)}
                onBlur={handleValidaLink}
                disabled={true}
              />
            </Form.Group>
            <Alert variant='danger' hidden={msgErrorLink == null ? true : false}>{msgErrorLink}</Alert>
            <Row className='justify-content-center'>
              <Col xs lg='4'>
                <Button variant="primary" onClick={() => onShow()}>
                  QRCODE
                </Button>
              </Col>
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


