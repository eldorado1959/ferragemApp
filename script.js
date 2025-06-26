const formProduto = document.getElementById("form-produto");
const listaProdutos = document.getElementById("lista-produtos");
const campoBusca = document.getElementById("busca");
const botaoPDF = document.getElementById("exportar-pdf");

let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

function renderizarProdutos(filtro = "") {
  listaProdutos.innerHTML = "";
  produtos.forEach((produto, index) => {
    if (!produto.nome.toLowerCase().includes(filtro.toLowerCase())) return;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="./img/produtos/caixaferr.jpg" alt="Produto">
      <p>
        <strong contenteditable="false">${produto.nome}</strong><br>
        <span contenteditable="false">${produto.categoria}</span> -
        R$ <span contenteditable="false">${parseFloat(produto.preco).toFixed(2)}</span><br>
        <span contenteditable="false">Estoque: ${produto.quantidade}</span>
      </p>
      <button class="editar">Editar</button>
      <button class="salvar" style="display: none;">Salvar</button>
      <button class="excluir">Excluir</button>
    `;

    const btnEditar = card.querySelector(".editar");
    const btnSalvar = card.querySelector(".salvar");
    const btnExcluir = card.querySelector(".excluir");
    const campos = card.querySelectorAll("[contenteditable]");

    btnEditar.addEventListener("click", () => {
      campos.forEach(c => c.contentEditable = "true");
      btnEditar.style.display = "none";
      btnSalvar.style.display = "inline-block";
    });

    btnSalvar.addEventListener("click", () => {
      campos.forEach(c => c.contentEditable = "false");
      produto.nome = campos[0].innerText;
      produto.categoria = campos[1].innerText;
      produto.preco = parseFloat(campos[2].innerText.replace(",", "."));
      produto.quantidade = parseInt(campos[3].innerText.replace("Estoque: ", ""));
      localStorage.setItem("produtos", JSON.stringify(produtos));
      renderizarProdutos(campoBusca.value);
    });

    btnExcluir.addEventListener("click", () => {
      produtos.splice(index, 1);
      localStorage.setItem("produtos", JSON.stringify(produtos));
      renderizarProdutos(campoBusca.value);
    });

    listaProdutos.appendChild(card);
  });
}

formProduto.addEventListener("submit", function (e) {
  e.preventDefault();
  const nome = document.getElementById("nome-produto").value;
  const categoria = document.getElementById("categoria").value;
  const preco = document.getElementById("preco").value;
  const quantidade = document.getElementById("quantidade").value;

  produtos.push({ nome, categoria, preco, quantidade });
  localStorage.setItem("produtos", JSON.stringify(produtos));
  renderizarProdutos();
  formProduto.reset();
});

campoBusca.addEventListener("input", () => {
  renderizarProdutos(campoBusca.value);
});

botaoPDF.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Relatório de Produtos", 14, 15);
  doc.setFontSize(12);
  doc.text("Data: " + new Date().toLocaleString(), 14, 25);

  const tabela = produtos.map(p => [
    p.nome,
    p.categoria,
    `R$ ${parseFloat(p.preco).toFixed(2)}`,
    p.quantidade
  ]);

  doc.autoTable({
    startY: 35,
    head: [["Nome", "Categoria", "Preço", "Estoque"]],
    body: tabela,
    styles: {
      fillColor: [255, 102, 0],
      halign: 'center',
      valign: 'middle',
    },
    headStyles: {
      fillColor: [255, 102, 0],
      textColor: 20,
    },
    theme: 'striped'
  });

  doc.save("produtos.pdf");
});

renderizarProdutos();
