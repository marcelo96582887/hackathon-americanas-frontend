import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';

export default function Toolbar() {


  return (
      <Nav fill variant="tabs" defaultActiveKey="/">
        <Nav.Item>
          <Nav.Link href="/parametros">Parâmetros</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/especificacoes">Especificações do Produto</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/fabricantes">Fabricantes</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/produtos">Produtos</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/sair">Sair</Nav.Link>
        </Nav.Item>
      </Nav>

  );

}

