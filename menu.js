// ========== PRODUCTS ==========
const products = [
  // Pizzas
  {
    id: 1,
    name: "Pizza Margherita",
    description: "Molho de tomate, mussarela, manjericão fresco e azeite",
    price: 49.90,
    category: "pizza",
    emoji: "🍕",
    badge: "Clássica"
  },
  {
    id: 2,
    name: "Pizza Calabresa",
    description: "Molho de tomate, mussarela, calabresa fatiada e cebola",
    price: 54.90,
    category: "pizza",
    emoji: "🍕"
  },
  {
    id: 3,
    name: "Pizza Quatro Queijos",
    description: "Mussarela, provolone, gorgonzola e parmesão",
    price: 59.90,
    category: "pizza",
    emoji: "🍕",
    badge: "Popular"
  },
  {
    id: 4,
    name: "Pizza Portuguesa",
    description: "Presunto, ovos, cebola, azeitona, ervilha e mussarela",
    price: 57.90,
    category: "pizza",
    emoji: "🍕"
  },
  {
    id: 5,
    name: "Pizza Frango com Catupiry",
    description: "Frango desfiado, catupiry cremoso e mussarela",
    price: 56.90,
    category: "pizza",
    emoji: "🍕"
  },
  {
    id: 6,
    name: "Pizza Pepperoni",
    description: "Molho de tomate, mussarela e pepperoni",
    price: 58.90,
    category: "pizza",
    emoji: "🍕"
  },
  // Esfihas Salgadas
  {
    id: 7,
    name: "Esfiha de Carne",
    description: "Carne moída temperada com especiarias",
    price: 6.50,
    category: "esfiha-salgada",
    emoji: "🥙",
    badge: "Tradicional"
  },
  {
    id: 8,
    name: "Esfiha de Calabresa",
    description: "Calabresa moída com cebola",
    price: 7.50,
    category: "esfiha-salgada",
    emoji: "🥙"
  },
  {
    id: 9,
    name: "Esfiha de Queijo",
    description: "Queijo mussarela derretido",
    price: 7.00,
    category: "esfiha-salgada",
    emoji: "🥙"
  },
  {
    id: 10,
    name: "Esfiha de Frango",
    description: "Frango desfiado temperado",
    price: 7.00,
    category: "esfiha-salgada",
    emoji: "🥙"
  },
  {
    id: 11,
    name: "Esfiha de Carne com Queijo",
    description: "Carne moída e queijo mussarela",
    price: 8.50,
    category: "esfiha-salgada",
    emoji: "🥙"
  },
  {
    id: 12,
    name: "Esfiha de Pizza",
    description: "Mussarela, orégano e tomate",
    price: 7.50,
    category: "esfiha-salgada",
    emoji: "🥙"
  },
  // Esfihas Doces
  {
    id: 13,
    name: "Esfiha de Chocolate",
    description: "Chocolate ao leite derretido",
    price: 8.00,
    category: "esfiha-doce",
    emoji: "🍫",
    badge: "Doce"
  },
  {
    id: 14,
    name: "Esfiha de Banana com Canela",
    description: "Banana, canela e açúcar",
    price: 7.50,
    category: "esfiha-doce",
    emoji: "🍌"
  },
  {
    id: 15,
    name: "Esfiha de Prestígio",
    description: "Chocolate e coco ralado",
    price: 8.50,
    category: "esfiha-doce",
    emoji: "🥥"
  },
  {
    id: 16,
    name: "Esfiha de Doce de Leite",
    description: "Doce de leite cremoso",
    price: 8.00,
    category: "esfiha-doce",
    emoji: "🍮"
  },
  {
    id: 17,
    name: "Esfiha de Romeu e Julieta",
    description: "Goiabada e queijo",
    price: 8.00,
    category: "esfiha-doce",
    emoji: "❤️"
  }
];

// ========== CART (safe localStorage) ==========
let cart = [];
try {
  const saved = localStorage.getItem('lucianaCart');
  if (saved) {
    cart = JSON.parse(saved);
    if (!Array.isArray(cart)) cart = [];
  }
} catch (e) {
  cart = [];
}

// ========== RENDER MENU ==========
function renderMenu(category) {
  if (!category) category = 'all';

  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  const filtered = category === 'all'
    ? products
    : products.filter(function (p) { return p.category === category; });

  grid.innerHTML = filtered.map(function (p) {
    const badge = p.badge
      ? '<span class="product-badge">' + p.badge + '</span>'
      : '';

    return (
      '<div class="product-card" data-category="' + p.category + '">' +
        '<div class="product-img">' +
          badge +
          '<span>' + p.emoji + '</span>' +
        '</div>' +
        '<div class="product-body">' +
          '<h3>' + p.name + '</h3>' +
          '<p>' + p.description + '</p>' +
          '<div class="product-footer">' +
            '<span class="price">R$ ' + p.price.toFixed(2).replace('.', ',') + '</span>' +
            '<button class="add-btn" onclick="addToCart(' + p.id + ')" title="Adicionar">+</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

// ========== CART FUNCTIONS ==========
function addToCart(id) {
  const product = products.find(function (p) { return p.id === id; });
  if (!product) return;

  const existing = cart.find(function (item) { return item.id === id; });

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(product.name + ' adicionado!');
}

function removeFromCart(id) {
  cart = cart.filter(function (item) { return item.id !== id; });
  saveCart();
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(function (i) { return i.id === id; });
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
    updateCartUI();
  }
}

function saveCart() {
  try {
    localStorage.setItem('lucianaCart', JSON.stringify(cart));
  } catch (e) {
    // ignore storage errors
  }
}

function getCartTotal() {
  return cart.reduce(function (sum, item) {
    return sum + (item.price * item.qty);
  }, 0);
}

function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (!countEl || !itemsEl || !totalEl || !checkoutBtn) return;

  const totalItems = cart.reduce(function (sum, i) {
    return sum + i.qty;
  }, 0);

  countEl.textContent = totalItems;

  if (cart.length === 0) {
    itemsEl.innerHTML =
      '<div class="cart-empty">' +
        '<div class="icon">🛒</div>' +
        '<p>Seu carrinho está vazio</p>' +
        '<p style="font-size: 0.85rem; margin-top: 8px;">Adicione itens do cardápio!</p>' +
      '</div>';
    checkoutBtn.disabled = true;
  } else {
    itemsEl.innerHTML = cart.map(function (item) {
      return (
        '<div class="cart-item">' +
          '<div class="cart-item-img">' + item.emoji + '</div>' +
          '<div class="cart-item-info">' +
            '<h4>' + item.name + '</h4>' +
            '<div class="item-price">R$ ' + (item.price * item.qty).toFixed(2).replace('.', ',') + '</div>' +
            '<div class="qty-controls">' +
              '<button class="qty-btn" onclick="changeQty(' + item.id + ', -1)">−</button>' +
              '<span>' + item.qty + '</span>' +
              '<button class="qty-btn" onclick="changeQty(' + item.id + ', 1)">+</button>' +
            '</div>' +
            '<button class="remove-item" onclick="removeFromCart(' + item.id + ')">Remover</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
    checkoutBtn.disabled = false;
  }

  totalEl.textContent = 'R$ ' + getCartTotal().toFixed(2).replace('.', ',');
}

function openCart() {
  const overlay = document.getElementById('cartOverlay');
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  const overlay = document.getElementById('cartOverlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ========== CHECKOUT ==========
function openCheckout() {
  if (cart.length === 0) return;
  closeCart();

  const summary = document.getElementById('orderSummary');
  if (!summary) return;

  let itemsHtml = '';
  cart.forEach(function (item) {
    itemsHtml +=
      '<div class="summary-item">' +
        '<span>' + item.qty + 'x ' + item.name + '</span>' +
        '<span>R$ ' + (item.price * item.qty).toFixed(2).replace('.', ',') + '</span>' +
      '</div>';
  });

  summary.innerHTML =
    '<h4>Resumo do pedido</h4>' +
    itemsHtml +
    '<div class="summary-total">' +
      '<span>Total</span>' +
      '<span>R$ ' + getCartTotal().toFixed(2).replace('.', ',') + '</span>' +
    '</div>';

  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCheckout() {
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function selectPayment(el) {
  document.querySelectorAll('.payment-option').forEach(function (o) {
    o.classList.remove('selected');
  });
  el.classList.add('selected');

  const method = el.getAttribute('data-payment');
  const paymentInput = document.getElementById('paymentMethod');
  if (paymentInput) paymentInput.value = method;

  const changeGroup = document.getElementById('changeGroup');
  if (changeGroup) {
    changeGroup.style.display = method === 'Dinheiro' ? 'block' : 'none';
  }
}

function submitOrder(e) {
  e.preventDefault();

  const name = (document.getElementById('customerName') || {}).value || '';
  const phone = (document.getElementById('customerPhone') || {}).value || '';
  const street = (document.getElementById('street') || {}).value || '';
  const number = (document.getElementById('number') || {}).value || '';
  const complement = (document.getElementById('complement') || {}).value || '';
  const neighborhood = (document.getElementById('neighborhood') || {}).value || '';
  const city = (document.getElementById('city') || {}).value || '';
  const reference = (document.getElementById('reference') || {}).value || '';
  const payment = (document.getElementById('paymentMethod') || {}).value || 'PIX';
  const changeFor = (document.getElementById('changeFor') || {}).value || '';
  const notes = (document.getElementById('notes') || {}).value || '';

  let message = '🍕 *NOVO PEDIDO - Pizza La Luciana*\n\n';
  message += '👤 *Cliente:* ' + name.trim() + '\n';
  message += '📱 *Telefone:* ' + phone.trim() + '\n\n';
  message += '📍 *Endereço de entrega:*\n';
  message += 'Rua ' + street.trim() + ', ' + number.trim();
  if (complement.trim()) message += ' - ' + complement.trim();
  message += '\n' + neighborhood.trim() + ' - ' + city.trim();
  if (reference.trim()) message += '\nRef: ' + reference.trim();
  message += '\n\n🛒 *Itens do pedido:*\n';

  cart.forEach(function (item) {
    message += '• ' + item.qty + 'x ' + item.name + ' - R$ ' + (item.price * item.qty).toFixed(2).replace('.', ',') + '\n';
  });

  message += '\n💰 *Total: R$ ' + getCartTotal().toFixed(2).replace('.', ',') + '*\n';
  message += '💳 *Pagamento:* ' + payment;
  if (payment === 'Dinheiro' && changeFor.trim()) {
    message += ' (troco para ' + changeFor.trim() + ')';
  }
  if (notes.trim()) {
    message += '\n\n📝 *Observações:* ' + notes.trim();
  }
  message += '\n\n_Pedido enviado pelo site_';

  const encoded = encodeURIComponent(message);
  const whatsappUrl = 'https://wa.me/5511966019490?text=' + encoded;

  cart = [];
  saveCart();
  updateCartUI();
  closeCheckout();

  window.open(whatsappUrl, '_blank');
  showToast('Pedido enviado! Abrindo WhatsApp...');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(function () {
    toast.classList.remove('show');
  }, 2500);
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', function () {
  // Tabs
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (t) {
        t.classList.remove('active');
      });
      tab.classList.add('active');
      renderMenu(tab.getAttribute('data-category'));
    });
  });

  // Close cart when clicking overlay
  const cartOverlay = document.getElementById('cartOverlay');
  if (cartOverlay) {
    cartOverlay.addEventListener('click', function (e) {
      if (e.target.id === 'cartOverlay') closeCart();
    });
  }

  // Close checkout when clicking overlay
  const checkoutModal = document.getElementById('checkoutModal');
  if (checkoutModal) {
    checkoutModal.addEventListener('click', function (e) {
      if (e.target.id === 'checkoutModal') closeCheckout();
    });
  }

  // First render
  renderMenu('all');
  updateCartUI();
});