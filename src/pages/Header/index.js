import React from 'react';
import { useHistory } from 'react-router-dom';

import { Container, Row } from 'react-bootstrap';

import './style.css';

export default function Header() {
  const history = useHistory();

  return (
    <Container fluid className='header-container'>
      <Row className = 'justify-content-center'>
        <div className="logo">
          <p>LOJAS AMERICANAS</p>
        </div>
      </Row>
    </Container>
  );
}