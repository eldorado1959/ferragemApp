
let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

function salvarClientes() {
  localStorage.setItem('clientes', JSON.stringify(clientes));
}

function renderizarClientes(filtro = '') {
  const lista = document.getElementById('lista-clientes');
  lista.innerHTML = '';

  clientes
    .filter(c => c.nome.toLowerCase().includes(filtro.toLowerCase()))
    .forEach((cliente, index) => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <h3>${cliente.nome}</h3>
        <p><strong>Email:</strong> ${cliente.email}</p>
        <p><strong>Telefone:</strong> ${cliente.telefone}</p>
        <div class="card-buttons">
          <button onclick="editarCliente(${index})">Editar</button>
          <button onclick="excluirCliente(${index})">Excluir</button>
        </div>
      `;
      lista.appendChild(card);
    });
}

document.getElementById('form-cliente').addEventListener('submit', function (e) {
  e.preventDefault();
  const nome = document.getElementById('nome-cliente').value;
  const email = document.getElementById('email').value;
  const telefone = document.getElementById('telefone').value;

  clientes.push({ nome, email, telefone });
  salvarClientes();
  renderizarClientes();
  this.reset();
});

function excluirCliente(index) {
  if (confirm('Deseja excluir este cliente?')) {
    clientes.splice(index, 1);
    salvarClientes();
    renderizarClientes();
  }
}

function editarCliente(index) {
  const cliente = clientes[index];
  const novoNome = prompt('Novo nome:', cliente.nome);
  const novoEmail = prompt('Novo e-mail:', cliente.email);
  const novoTelefone = prompt('Novo telefone:', cliente.telefone);

  if (novoNome && novoEmail && novoTelefone) {
    clientes[index] = {
      nome: novoNome,
      email: novoEmail,
      telefone: novoTelefone
    };
    salvarClientes();
    renderizarClientes();
  }
}

document.getElementById('busca-cliente').addEventListener('input', function () {
  renderizarClientes(this.value);
});

document.getElementById('exportar-clientes').addEventListener('click', function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text('Relatório de Clientes - Ferragem na Mão', 14, 10);
  const dataAtual = new Date().toLocaleDateString();
  doc.text(`Data: ${dataAtual}`, 14, 18);

  const linhas = clientes.map(c => [c.nome, c.email, c.telefone]);

  doc.autoTable({
    head: [['Nome', 'E-mail', 'Telefone']],
    body: linhas,
    startY: 25
  });

  doc.save('clientes.pdf');
});

// Carregar ao iniciar
renderizarClientes();
