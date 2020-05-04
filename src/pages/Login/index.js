import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { formataCpfCnpj } from '../../utils/cpf-cnpj';
import { ReCAPTCHA } from 'react-google-recaptcha';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import './style.js';
import './style.css';


export default function Login() {

  const history = useHistory();
  const [inputCgc, setInputCgc] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputSenha, setInputSenha] = useState('');
  const [MsgErrorCgc, setMsgErrorCgc] = useState(null);
  const [MsgErrorEmail, setMsgErrorEmail] = useState(null);
  const [MsgErrorSenha, setMsgErrorSenha] = useState(null);
  const [MsgErrroRecaptcha, setMsgErrorRecaptcha] = useState(null);
  const [recaptcha, setRecaptcha] = useState(true);
  const [init, setInit] = useState(false);

  if (!init) {
    setInit(true);  
    const autorizado = localStorage.getItem('autorizado');
    if (autorizado) {

      console.log('aut ', autorizado);
      history.push('/produtos', {
        cgc: inputCgc.replace(/[^0-9]/g, ''),
        email: inputEmail,
        senha: inputSenha,
        limit: 10,
        pagina: 1
      });
    }
  }

  function handleValidaCgc() {
    setMsgErrorCgc(null);
    const { error, formatado } = formataCpfCnpj(inputCgc);
    if (!error) {
      setInputCgc(formatado);
    } else {
      setMsgErrorCgc('CPF/CNPJ inválido!!!');
      return true;
    }
    return false;
  };

  function handleValidaEmail() {
    setMsgErrorEmail(null);
    if (inputEmail.length === 0) {
      setMsgErrorEmail('Email inválido!!!');
      return true;
    }
    return false;
  }

  function handleValidaSenha() {
    setMsgErrorSenha(null);
    if (inputSenha.length === 0) {
      setMsgErrorSenha('Senha inválida!!!');
      return true;
    }
    return false;
  }


  function handleRecaptcha(event) {
    setMsgErrorRecaptcha(null);
    if (event == null) {
      setRecaptcha(false);
    } else {
      setRecaptcha(true);
    }
  }

  async function handleHome() {
    setMsgErrorRecaptcha(null);
    const okCgc = !handleValidaCgc();
    const okEmail = !handleValidaEmail();
    const okSenha = !handleValidaSenha();
    if (!recaptcha) {
      setMsgErrorRecaptcha('Recaptcha não clicado!!!');
    }
    setRecaptcha(true);
    if (okCgc && okEmail && okSenha && recaptcha) {

      const autorizado = localStorage.getItem('autorizado');
      if (!autorizado) {
        try {
          const cnpj = inputCgc.replace(/[^0-9]/g, '');
          //const response = await api.get('lojas', {params: {cnpj}});
          //const {ret}  = response.data;
          const ret = { success: true };
          if (ret.success === false) {
            setMsgErrorEmail('Usuário não cadastrado. Redirecionando para cadastro...');
            setTimeout(() => {
              history.push('/produtos', {
                cgc: inputCgc.replace(/[^0-9]/g, ''),
                email: inputEmail,
                senha: inputSenha,
                limit: 10,
                pagina: 1
              });
            }, 3000);

            //{parametros: { cnpj: inputCgc.replace(/[^0-9]/g, ''), email: inputEmail }, init:true, action: {insert: true}}
          } else {
            const autorizado = localStorage.getItem('autorizado');
            if (!autorizado) {
              localStorage.setItem('autorizado', true);
            }
            console.log('aut ', autorizado);
            history.push('/produtos', {
              cgc: inputCgc.replace(/[^0-9]/g, ''),
              email: inputEmail,
              senha: inputSenha,
              limit: 10,
              pagina: 1
            });

          }


        } catch (error) {
          alert('Erro na leitura de dados');
        }

      }

      try {
        const cnpj = inputCgc.replace(/[^0-9]/g, '');
        //const response = await api.get('lojas', {params: {cnpj}});
        //const {ret}  = response.data;
        const ret = { success: true };
        if (ret.success === false) {
          setMsgErrorEmail('Usuário não cadastrado. Redirecionando para cadastro...');
          setTimeout(() => {
            history.push('/produtos', {
              cgc: inputCgc.replace(/[^0-9]/g, ''),
              email: inputEmail,
              senha: inputSenha,
              limit: 10,
              pagina: 1
            });
          }, 3000);

          //{parametros: { cnpj: inputCgc.replace(/[^0-9]/g, ''), email: inputEmail }, init:true, action: {insert: true}}
        } else {
          history.push('/produtos', {
            cgc: inputCgc.replace(/[^0-9]/g, ''),
            email: inputEmail,
            senha: inputSenha,
            limit: 10,
            pagina: 1
          });

        }

      } catch (error) {
        alert('Erro na leitura de dados');
      }


    }

  }


  return (
    <Container fluid className='home-container'>
      <Row className='justify-content-center'>
        <Col xs lg='4'>
          <Form>
            <Form.Group controlId='formCgc'>
              <Form.Label className='form-label'>Digite o CNPJ da sua empresa</Form.Label>
              <Form.Control type='text' placeholder='CNPJ'
                value={inputCgc} onChange={(e) => setInputCgc(e.target.value)}
                onBlur={handleValidaCgc}
              />
            </Form.Group>

            <Alert variant='danger' hidden={MsgErrorCgc == null ? true : false} >{MsgErrorCgc}</Alert>

            <Form.Group controlId='formEmail'>
              <Form.Label>E-mail</Form.Label>
              <Form.Control type='e-mail' placeholder='E-mail'
                value={inputEmail} onChange={(e) => setInputEmail(e.target.value)}
                onBlur={handleValidaEmail}
              />
            </Form.Group>
            <Alert variant='danger' hidden={MsgErrorEmail == null ? true : false} >{MsgErrorEmail}</Alert>

            <Form.Group controlId='formSenha'>
              <Form.Label>Senha</Form.Label>
              <Form.Control type='password' placeholder='Senha'
                value={inputSenha} onChange={(e) => setInputSenha(e.target.value)}
                onBlur={handleValidaSenha}
              />
            </Form.Group>
            <Alert variant='danger' hidden={MsgErrorSenha == null ? true : false} >{MsgErrorSenha}</Alert>

            <ReCAPTCHA className='recaptcha' sitekey='6LePUyAUAAAAAGG0SlDZ_gnJqWKbwnNnxiZL9DdK'
              onChange={(event) => { handleRecaptcha(event) }}
            />
            <Alert variant='danger' hidden={MsgErrroRecaptcha == null ? true : false} >{MsgErrroRecaptcha}</Alert>
            <Row className='justify-content-center'>
              <Col xs lg='4'>
                <Button onClick={handleHome} className='home-button' variant='primary'>Entrar</Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>

  );
};


