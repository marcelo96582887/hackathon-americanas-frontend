import React from 'react';
import { useHistory } from 'react-router-dom';

import { Container, Row } from 'react-bootstrap';

import './style.css';

export default function Header() {
  const history = useHistory();

  return (
    <div id="notfound">
      <Container fluid className='header-container'>
        <Row className='justify-content-center'>
          <div className="logo">
            <p>PAGINA NÃO ENCONTRADA</p>
          </div>
        </Row>
      </Container>

    </div>
  );
}