

let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

function salvarProdutos() {
  localStorage.setItem('produtos', JSON.stringify(produtos));
}

function renderizarProdutos(filtro = '') {
  const lista = document.getElementById('lista-produtos');
  lista.innerHTML = '';

  produtos
    .filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()))
    .forEach((produto, index) => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <h3>${produto.nome}</h3>
        <p><strong>Categoria:</strong> ${produto.categoria}</p>
        <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
        <p><strong>Estoque:</strong> ${produto.quantidade}</p>
        <div class="card-buttons">
          <button onclick="editarProduto(${index})">Editar</button>
          <button onclick="excluirProduto(${index})">Excluir</button>
        </div>
      `;
      lista.appendChild(card);
    });
}

document.getElementById('form-produto').addEventListener('submit', function (e) {
  e.preventDefault();
  const nome = document.getElementById('nome-produto').value;
  const categoria = document.getElementById('categoria').value;
  const preco = parseFloat(document.getElementById('preco').value);
  const quantidade = parseInt(document.getElementById('quantidade').value);

  produtos.push({ nome, categoria, preco, quantidade });
  salvarProdutos();
  renderizarProdutos();
  this.reset();
});

function excluirProduto(index) {
  if (confirm('Deseja excluir este produto?')) {
    produtos.splice(index, 1);
    salvarProdutos();
    renderizarProdutos();
  }
}

function editarProduto(index) {
  const produto = produtos[index];
  const novoNome = prompt('Novo nome:', produto.nome);
  const novaCategoria = prompt('Nova categoria:', produto.categoria);
  const novoPreco = prompt('Novo preço:', produto.preco);
  const novaQuantidade = prompt('Nova quantidade:', produto.quantidade);

  if (novoNome && novaCategoria && novoPreco && novaQuantidade) {
    produtos[index] = {
      nome: novoNome,
      categoria: novaCategoria,
      preco: parseFloat(novoPreco),
      quantidade: parseInt(novaQuantidade)
    };
    salvarProdutos();
    renderizarProdutos();
  }
}

document.getElementById('busca').addEventListener('input', function () {
  renderizarProdutos(this.value);
});

document.getElementById('exportar-pdf').addEventListener('click', function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text('Relatório de Produtos - Ferragem na Mão', 14, 10);
  const dataAtual = new Date().toLocaleDateString();
  doc.text(`Data: ${dataAtual}`, 14, 18);

  const linhas = produtos.map(p => [
    p.nome, p.categoria, `R$ ${p.preco.toFixed(2)}`, p.quantidade
  ]);

  doc.autoTable({
    head: [['Nome', 'Categoria', 'Preço', 'Estoque']],
    body: linhas,
    startY: 25
  });

  doc.save('produtos.pdf');
});

// Carrega ao iniciar
renderizarProdutos();
