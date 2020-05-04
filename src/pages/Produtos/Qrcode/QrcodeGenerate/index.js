import React, { useState } from 'react';
import QRCode from 'qrcode-react';
import { Container } from './style'

export default function QRCODE(props) {

  const [init, setInit] = useState(false);
  const [registros, setRegistros] = useState({});
  
  if (props.registros.init && !init) {
    setInit(true);
    const { registros } = props;
    setRegistros(registros);

  }

  
  return (

    <Container>
      <QRCode value={registros.link}
        size={290}
        level={'H'}
        includeMargin={true}
        
      />
    </Container>

  );

}