export const convertDateLX = (cmd) => {
  cmd = cmd.toString();
  const ano = cmd.substr(0, 4);
  const mes = cmd.substr(4, 2);
  const dia = cmd.substr(6, 2);
  return new Date(ano, mes-1, dia);
}