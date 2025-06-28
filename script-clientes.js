
const formCliente = document.getElementById("form-cliente");
const listaClientes = document.getElementById("lista-clientes");
const buscaCliente = document.getElementById("busca-cliente");
const btnExportarClientes = document.getElementById("exportar-clientes");

let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

function salvarClientes() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

function renderClientes(filtro = "") {
  listaClientes.innerHTML = "";

  clientes
    .filter(cliente => cliente.nome.toLowerCase().includes(filtro.toLowerCase()))
    .forEach((cliente, index) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <strong contenteditable="true" onblur="editarCliente(${index}, 'nome', this.textContent)">
          ${cliente.nome}
        </strong>
        <p contenteditable="true" onblur="editarCliente(${index}, 'email', this.textContent)">
          ${cliente.email}
        </p>
        <p contenteditable="true" onblur="editarCliente(${index}, 'telefone', this.textContent)">
          ${cliente.telefone}
        </p>
        <button onclick="excluirCliente(${index})">Excluir</button>
      `;

      listaClientes.appendChild(card);
    });
}

function editarCliente(index, campo, valor) {
  clientes[index][campo] = valor.trim();
  salvarClientes();
}

function excluirCliente(index) {
  if (confirm("Deseja excluir este cliente?")) {
    clientes.splice(index, 1);
    salvarClientes();
    renderClientes(buscaCliente.value);
  }
}

formCliente.addEventListener("submit", function (e) {
  e.preventDefault();
  const nome = document.getElementById("nome-cliente").value.trim();
  const email = document.getElementById("email-cliente").value.trim();
  const telefone = document.getElementById("telefone-cliente").value.trim();

  if (!nome || !email || !telefone) return;

  clientes.push({ nome, email, telefone });
  salvarClientes();
  renderClientes();
  formCliente.reset();
});

buscaCliente.addEventListener("input", () => renderClientes(buscaCliente.value));

btnExportarClientes.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Relatório de Clientes", 14, 20);
  doc.autoTable({
    head: [["Nome", "Email", "Telefone"]],
    body: clientes.map(c => [c.nome, c.email, c.telefone]),
    startY: 30,
  });

  doc.save("clientes.pdf");
});

// Renderizar ao iniciar
renderClientes();
