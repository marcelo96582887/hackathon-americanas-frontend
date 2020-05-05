import React, { useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Header from './pages/Header';
import Toolbar from './pages/Toolbar';
import Especificacoes from './pages/Especificacoes';
import ManterEspecificacoes from './pages/Especificacoes/Manter';
import ItemEspecificacoes from './pages/Especificacoes/Item';
import Fabricantes from './pages/Fabricantes';
import ManterFabricantes from './pages/Fabricantes/Manter';
import Produtos from './pages/Produtos';
import Parametros from './pages/Parametros';
import ManterParametros from './pages/Parametros/Manter';
import ManterProdutos from './pages/Produtos/Manter';
import ItemParametrosEspecificacao from './pages/Especificacoes/Item/Parametros';
import ImagensProduto from './pages/Produtos/Imagens';
import CadastroImagensProduto from './pages/Produtos/Imagens/Cadastro';
import QrcodeProduto from './pages/Produtos/Qrcode';
import EspecificacoesProduto from './pages/Produtos/Especificacoes';
import ListaEspecificacoesProduto from './pages/Produtos/Especificacoes/Lista';
//import CadastroUsuario from './pages/Cadastro';
//<Route path='/cadastro/usuario' exact component={CadastroUsuario} />
//    <Toolbar />



export default function Routes() {


  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/sair' exact component={Login} />
        <Route path='/especificacoes' exact component={Especificacoes} />
        <Route path='/especificacoes/manter' exact component={ManterEspecificacoes} />
        <Route path='/especificacoes/item' exact component={ItemEspecificacoes} />
        <Route path='/especificacoes/item/parametros' exact component={ItemParametrosEspecificacao} />
        <Route path='/fabricantes' exact component={Fabricantes} />
        <Route path='/fabricantes/manter' exact component={ManterFabricantes} />
        <Route path='/parametros' exact component={Parametros} />
        <Route path='/parametros/manter' exact component={ManterParametros} />
        <Route path='/produtos' exact component={Produtos} />
        <Route path='/produtos/manter' exact component={ManterProdutos} />
        <Route path='/produtos/imagens' exact component={ImagensProduto} />
        <Route path='/produtos/imagens/cadastro' exact component={CadastroImagensProduto} />
        <Route path='/produtos/qrcode' exact component={QrcodeProduto} />
        <Route path='/produtos/especificacoes' exact component={EspecificacoesProduto} />
        <Route path='/produtos/especificacoes/lista' exact component={ListaEspecificacoesProduto} />

        <Route path='/' component={NotFound} />


      </Switch>
    </BrowserRouter>
  );
};