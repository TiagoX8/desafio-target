const fs = require("fs");
const path = require("path");

const arquivo = path.join(__dirname, "ex1.json");
const dados = JSON.parse(fs.readFileSync(arquivo, "utf8"));
const comissoes = {};

for (const venda of dados.vendas) {
  let porcentagem = 0;

  if (venda.valor >= 500) {
    porcentagem = 0.05;
  } else if (venda.valor >= 100) {
    porcentagem = 0.01;
  }

  const comissao = Math.round(venda.valor * porcentagem * 100) / 100;
  comissoes[venda.vendedor] = (comissoes[venda.vendedor] || 0) + comissao;
}

for (const vendedor in comissoes) {
  const valor = comissoes[vendedor].toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  console.log(`${vendedor}: ${valor}`);
}
