const itemInput = document.getElementById('item');
const quantityInput = document.getElementById('quantity');
const priceInput = document.getElementById('price');
const addBtn = document.getElementById('addBtn');
const invoiceBody = document.getElementById('invoiceBody');

const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');

const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');

let invoiceItems = [];

const datosGuardados = localStorage.getItem('factura');
if (datosGuardados) {
  invoiceItems = JSON.parse(datosGuardados); // Convertimos el string a array
  renderTable(); // Mostramos lo que estaba guardado
}

addBtn.addEventListener('click', () => {
  const item = itemInput.value.trim();
  const quantity = parseInt(quantityInput.value);
  const price = parseFloat(priceInput.value);

  if (item === '' || isNaN(quantity) || isNaN(price)) {
    alert('Por favor, completa todos los campos correctamente.');
    return;
  }

  invoiceItems.push({
    item,
    quantity,
    price
  });

  itemInput.value = '';
  quantityInput.value = '';
  priceInput.value = '';

  renderTable();
});

function renderTable() {
  invoiceBody.innerHTML = ''; // Limpiamos la tabla
  let subtotal = 0;

invoiceItems.forEach((product, index) => {
    const row = document.createElement('tr');

row.innerHTML = `
      <td>${product.item}</td>
      <td>${product.quantity}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>$${(product.quantity * product.price).toFixed(2)}</td>
      <td><button class="deleteBtn" data-index="${index}">❌</button></td>
    `;

    invoiceBody.appendChild(row);

    subtotal += product.quantity * product.price;
  });

const tax = subtotal * 0.16;
const total = subtotal + tax;

subtotalEl.textContent = subtotal.toFixed(2);
taxEl.textContent = tax.toFixed(2);
totalEl.textContent = total.toFixed(2);

localStorage.setItem('factura', JSON.stringify(invoiceItems));

const deleteButtons = document.querySelectorAll('.deleteBtn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      invoiceItems.splice(index, 1);
      renderTable();
    });
  });
}

resetBtn.addEventListener('click', () => {
  if (confirm('¿Estás seguro de reiniciar la factura?')) {
    invoiceItems = [];
    localStorage.removeItem('factura');
    renderTable();
  }
});

exportBtn.addEventListener('click', () => {
  const element = document.querySelector('.container');
  const opt = {
    margin: 0.5,
    filename: 'factura.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
});
