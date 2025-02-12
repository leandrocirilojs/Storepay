// Função para alternar entre as guias
function openTab(tabName, element = null) {
  const tabcontents = document.querySelectorAll('.tabcontent');
  const tablinks = document.querySelectorAll('.tablink');

  tabcontents.forEach((tab) => {
    tab.style.display = 'none';
  });

  tablinks.forEach((tab) => {
    tab.classList.remove('active');
  });

  document.getElementById(tabName).style.display = 'block';

  if (element) {
    element.classList.add('active');
  }
}

// Função para salvar produtos no localStorage
function saveProduct(product) {
  let products = loadProducts();
  products.push(product);
  localStorage.setItem('products', JSON.stringify(products));
}



// Função para carregar produtos do localStorage
function loadProducts() {
  return JSON.parse(localStorage.getItem('products')) || [];
}




// Função para salvar vendas no localStorage
function saveSale(sale) {
  let sales = loadSales();
  sales.push(sale);
  localStorage.setItem('sales', JSON.stringify(sales));
}




// Função para carregar vendas do localStorage
function loadSales() {
  return JSON.parse(localStorage.getItem('sales')) || [];
}

// Função para renderizar a tabela de produtos
function renderProducts() {
  const products = loadProducts();

  const tableBody = document.querySelector('#productTable tbody');

  if (!tableBody) return; // Evita erro se o elemento não existir

  tableBody.innerHTML = '';

  products.forEach((product, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price.toFixed(2)}</td>
      <td>${product.quantity}</td>
      <td class="actions">
        <button onclick="deleteProduct(${index})">Excluir</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  updateProductSelects();
}

// Atualiza os selects de produtos
function updateProductSelects() {
  const products = loadProducts();
  const addStockProductSelect = document.getElementById('addStockProduct');
  const saleProductSelect = document.getElementById('saleProduct');

  if (!addStockProductSelect || !saleProductSelect) return;

  addStockProductSelect.innerHTML = '<option value="">Selecione um produto</option>';
  saleProductSelect.innerHTML = '<option value="">Selecione um produto</option>';

  products.forEach((product, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = product.name;
    addStockProductSelect.appendChild(option.cloneNode(true));
    saleProductSelect.appendChild(option);
  });
}

// Renderiza o histórico de vendas
function renderSalesHistory() {
  const sales = loadSales();
  const tableBody = document.querySelector('#salesHistoryTable tbody');

  if (!tableBody) return;

  tableBody.innerHTML = '';

  sales.forEach((sale) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${sale.productName}</td>
      <td>${sale.quantity}</td>
      <td>${sale.total.toFixed(2)}</td>
      <td>${sale.date}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Renderiza o relatório de vendas
function renderSalesReport() {
  const sales = loadSales();
  let totalSales = 0;
  const productSales = {};

  sales.forEach((sale) => {
    totalSales += sale.total;
    productSales[sale.productName] = (productSales[sale.productName] || 0) + sale.quantity;
  });

  let bestSellingProduct = 'Nenhum';
  let maxQuantity = 0;
  for (const [product, quantity] of Object.entries(productSales)) {
    if (quantity > maxQuantity) {
      bestSellingProduct = product;
      maxQuantity = quantity;
    }
  }

  document.getElementById('totalSales').textContent = totalSales.toFixed(2);
  document.getElementById('bestSellingProduct').textContent = bestSellingProduct;
}

function searchProduct() {
  let search = document.getElementById('searchProduct').value.toLowerCase();
  let products = loadProducts();
  const tableBody = document.querySelector('#productTable tbody');
  tableBody.innerHTML = '';

  products.forEach((product, index) => {
    if (product.name.toLowerCase().includes(search)) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.price.toFixed(2)}</td>
        <td>${product.quantity}</td>
        <td class="actions">
          <button onclick="deleteProduct(${index})">Excluir</button>
        </td>
      `;
      tableBody.appendChild(row);
    }
  });
}

// Garante que os dados sejam carregados corretamente ao iniciar a página
window.onload = () => {
  
  openTab('Estoque'); // Abre a guia Estoque
  renderProducts();
  renderSalesHistory();
  renderSalesReport();
};
