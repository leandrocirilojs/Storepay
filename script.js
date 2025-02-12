// Função para alternar entre as guias
function openTab(tabName) {
  const tabcontents = document.querySelectorAll('.tabcontent');
  const tablinks = document.querySelectorAll('.tablink');

  // Esconde todo o conteúdo das guias
  tabcontents.forEach((tab) => {
    tab.style.display = 'none';
  });

  // Remove a classe 'active' de todos os botões
  tablinks.forEach((tab) => {
    tab.classList.remove('active');
  });

  // Mostra a guia selecionada e marca o botão como ativo
  document.getElementById(tabName).style.display = 'block';
  event.currentTarget.classList.add('active');
}

// Função para salvar produtos no localStorage
function saveProduct(product) {
  let products = JSON.parse(localStorage.getItem('products')) || [];
  products.push(product);
  localStorage.setItem('products', JSON.stringify(products));
}

// Função para carregar produtos do localStorage
function loadProducts() {
  return JSON.parse(localStorage.getItem('products')) || [];
}

// Função para salvar vendas no localStorage
function saveSale(sale) {
  let sales = JSON.parse(localStorage.getItem('sales')) || [];
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

  // Atualizar selects de adicionar estoque e vendas
  updateProductSelects();
}

// Função para atualizar os selects de produtos
function updateProductSelects() {
  const products = loadProducts();
  const addStockProductSelect = document.getElementById('addStockProduct');
  const saleProductSelect = document.getElementById('saleProduct');

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

// Função para adicionar um produto
document.getElementById('productForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const productName = document.getElementById('productName').value;
  const productPrice = parseFloat(document.getElementById('productPrice').value);
  const productQuantity = parseInt(document.getElementById('productQuantity').value);

  if (productName && productPrice && productQuantity) {
    const product = {
      name: productName,
      price: productPrice,
      quantity: productQuantity
    };

    saveProduct(product);
    renderProducts();
    document.getElementById('productForm').reset();
  } else {
    alert('Preencha todos os campos!');
  }
});

// Função para excluir um produto
function deleteProduct(index) {
  let products = loadProducts();
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  renderProducts();
}

// Função para adicionar mais produtos ao estoque
document.getElementById('addStockForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const productIndex = document.getElementById('addStockProduct').value;
  const addQuantity = parseInt(document.getElementById('addStockQuantity').value);

  if (productIndex === '' || isNaN(addQuantity) || addQuantity <= 0) {
    alert('Selecione um produto e insira uma quantidade válida!');
    return;
  }

  let products = loadProducts();
  products[productIndex].quantity += addQuantity;
  localStorage.setItem('products', JSON.stringify(products));
  renderProducts();
  document.getElementById('addStockForm').reset();
});

// Função para registrar uma venda
document.getElementById('saleForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const productIndex = document.getElementById('saleProduct').value;
  const saleQuantity = parseInt(document.getElementById('saleQuantity').value);

  if (productIndex === '' || isNaN(saleQuantity) || saleQuantity <= 0) {
    alert('Selecione um produto e insira uma quantidade válida!');
    return;
  }

  let products = loadProducts();
  const product = products[productIndex];

  if (saleQuantity > product.quantity) {
    alert('Quantidade em estoque insuficiente!');
    return;
  }

  // Atualizar estoque
  product.quantity -= saleQuantity;
  localStorage.setItem('products', JSON.stringify(products));

  // Registrar a venda
  const sale = {
    productName: product.name,
    quantity: saleQuantity,
    total: saleQuantity * product.price,
    date: new Date().toLocaleString()
  };
  saveSale(sale);

  // Atualizar a interface
  renderProducts();
  renderSalesHistory();
  renderSalesReport();
  document.getElementById('saleForm').reset();
});

// Função para renderizar o histórico de vendas
function renderSalesHistory() {
  const sales = loadSales();
  const tableBody = document.querySelector('#salesHistoryTable tbody');
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









// Função para renderizar o relatório de vendas
function renderSalesReport() {
  const sales = loadSales();
  let totalSales = 0;
  const productSales = {};

  // Calcular total de vendas e vendas por produto
  sales.forEach((sale) => {
    totalSales += sale.total;
    if (productSales[sale.productName]) {
      productSales[sale.productName] += sale.quantity;
    } else {
      productSales[sale.productName] = sale.quantity;
    }
  });

  // Encontrar o produto mais vendido
  let bestSellingProduct = 'Nenhum';
  let maxQuantity = 0;
  for (const [product, quantity] of Object.entries(productSales)) {
    if (quantity > maxQuantity) {
      bestSellingProduct = product;
      maxQuantity = quantity;
    }
  }

  // Atualizar a interface
  document.getElementById('totalSales').textContent = totalSales.toFixed(2);
  document.getElementById('bestSellingProduct').textContent = bestSellingProduct;
}

// Renderizar produtos, histórico e relatório ao carregar a página
window.onload = () => {
  openTab('Estoque'); // Abre a guia Estoque por padrão
  renderProducts();
  renderSalesHistory();
  renderSalesReport();
};
