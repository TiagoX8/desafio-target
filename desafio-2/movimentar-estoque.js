const fs = require("fs");
const path = require("path");
const readline = require("readline");

const arquivoEstoque = path.join(__dirname, "ex2.json");
const arquivoMovimentacoes = path.join(__dirname, "movimentacoes.json");
const dados = JSON.parse(fs.readFileSync(arquivoEstoque, "utf8"));
let movimentacoes = [];

if (fs.existsSync(arquivoMovimentacoes)) {
  movimentacoes = JSON.parse(fs.readFileSync(arquivoMovimentacoes, "utf8"));
}

const entrada = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function perguntar(texto) {
  return new Promise((resolver) => entrada.question(texto, resolver));
}

async function main() {
  let continuar = "s";

  while (continuar.toLowerCase() === "s") {
    console.log("\nProdutos disponíveis:");
    for (const produto of dados.estoque) {
      console.log(
        `${produto.codigoProduto} - ${produto.descricaoProduto} (estoque: ${produto.estoque})`,
      );
    }

    const codigo = Number(await perguntar("\nDigite o código do produto: "));
    const produto = dados.estoque.find((item) => item.codigoProduto === codigo);

    if (!produto) {
      console.log("Produto não encontrado.");
      continue;
    }

    const tipo = (await perguntar("Digite E para entrada ou S para saída: "))
      .trim()
      .toUpperCase();
    const quantidade = Number(await perguntar("Digite a quantidade: "));

    if (!["E", "S"].includes(tipo) || !Number.isInteger(quantidade) || quantidade <= 0) {
      console.log("Tipo ou quantidade inválidos. Tente novamente.");
      continue;
    }

    if (tipo === "S" && quantidade > produto.estoque) {
      console.log("Não há estoque suficiente para essa saída.");
      continue;
    }

    if (tipo === "E") {
      produto.estoque += quantidade;
    } else {
      produto.estoque -= quantidade;
    }

    const movimentacao = {
      id: movimentacoes.length + 1,
      codigoProduto: produto.codigoProduto,
      descricao: tipo === "E" ? "Entrada de mercadoria" : "Saída de mercadoria",
      quantidade,
      estoqueFinal: produto.estoque,
    };

    movimentacoes.push(movimentacao);
    fs.writeFileSync(arquivoEstoque, JSON.stringify(dados, null, 2), "utf8");
    fs.writeFileSync(
      arquivoMovimentacoes,
      JSON.stringify(movimentacoes, null, 2),
      "utf8",
    );

    console.log(`\nMovimentação ${movimentacao.id}: ${movimentacao.descricao}`);
    console.log(`Produto: ${produto.descricaoProduto}`);
    console.log(`Estoque final: ${produto.estoque} unidades`);

    continuar = (await perguntar("\nDeseja lançar outra movimentação? (s/n): "))
      .trim()
      .toLowerCase();
  }

  entrada.close();
}

main();
