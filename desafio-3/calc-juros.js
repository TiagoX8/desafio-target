const readline = require("readline");

const entrada = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

entrada.question("Digite o valor da conta (ex.: 120,50): ", (valorDigitado) => {
  entrada.question("Digite o vencimento (DD/MM/AAAA): ", (dataDigitada) => {
    const valor = Number(valorDigitado.replace(",", "."));
    const [dia, mes, ano] = dataDigitada.split("/").map(Number);
    const vencimento = new Date(ano, mes - 1, dia);

    if (
      !Number.isFinite(valor) ||
      valor <= 0 ||
      vencimento.getDate() !== dia ||
      vencimento.getMonth() !== mes - 1 ||
      vencimento.getFullYear() !== ano
    ) {
      console.log("Valor ou data inválidos.");
      entrada.close();
      return;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const diasDeAtraso = Math.max(
      0,
      Math.floor((hoje - vencimento) / (1000 * 60 * 60 * 24)),
    );
    const juros = Math.round(valor * diasDeAtraso * 0.025 * 100) / 100;
    const total = valor + juros;

    console.log(`Dias de atraso: ${diasDeAtraso}`);
    console.log(`Juros: R$ ${juros.toFixed(2).replace(".", ",")}`);
    console.log(`Total atualizado: R$ ${total.toFixed(2).replace(".", ",")}`);

    entrada.close();
  });
});
