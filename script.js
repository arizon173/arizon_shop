// Мобільне меню
const menuButton = document.getElementById('menuButton');
const nav = document.getElementById('nav');
const overlay = document.getElementById('overlay');
const closeSearch = document.getElementById('closeSearch');
const mobileSearch = document.getElementById('mobileSearch');
const searchButton = document.querySelector('.search-btn');
const cartButton = document.getElementById('cartButton');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.getElementById('closeCart');

// Функція для закриття меню
function closeMenu() {
    nav.classList.remove('active');
    menuButton.classList.remove('active');
    overlay.classList.remove('active');
}

// Функція для відкриття меню
function openMenu() {
    nav.classList.add('active');
    menuButton.classList.add('active');
    overlay.classList.add('active');
}

// Функція для закриття пошуку
function closeMobileSearch() {
    mobileSearch.classList.remove('active');
}

// Функція для відкриття пошуку
function openMobileSearch() {
    mobileSearch.classList.add('active');
}

// Функція для закриття кошика
function closeCartPanel() {
    cartPanel.classList.remove('active');
    overlay.classList.remove('active');
}

// Функція для відкриття кошика
function openCartPanel() {
    cartPanel.classList.add('active');
    overlay.classList.add('active');
}

// Додавання обробників подій
menuButton.addEventListener('click', () => {
    if (nav.classList.contains('active')) {
        closeMenu();
    } else {
        openMenu();
    }
});

overlay.addEventListener('click', () => {
    closeMenu();
    closeMobileSearch();
    closeCartPanel();
});

searchButton.addEventListener('click', openMobileSearch);
closeSearch.addEventListener('click', closeMobileSearch);
cartButton.addEventListener('click', openCartPanel);
closeCart.addEventListener('click', closeCartPanel);

// Додавання товарів до кошика
class Cart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.count = 0;
        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.updateCartUI();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Додавання товарів
        document.querySelectorAll('.buy-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const name = e.currentTarget.getAttribute('data-name');
                const price = parseInt(e.currentTarget.getAttribute('data-price'));
                this.addItem({ id, name, price });
                
                // Анімація кнопки
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Додано';
                button.style.background = '#4cd964';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                }, 2000);
            });
        });
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        
        this.saveToLocalStorage();
        this.updateCartUI();
        this.showNotification(`${product.name} додано до кошика`);
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveToLocalStorage();
        this.updateCartUI();
    }

    updateQuantity(id, change) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                this.saveToLocalStorage();
                this.updateCartUI();
            }
        }
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.count = this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    updateCartUI() {
        this.calculateTotal();
        
        // Оновлення іконки кошика
        document.querySelector('.cart-count').textContent = this.count;
        
        // Оновлення списку товарів
        const cartItems = document.querySelector('.cart-items');
        cartItems.innerHTML = '';
        
        if (this.items.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Кошик порожній</p></div>';
        } else {
            this.items.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image" style="background-color: #e0e0e0;"></div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Кількість: ${item.quantity}</p>
                        <div class="cart-item-price">${(item.price * item.quantity).toLocaleString('uk-UA')} ₴</div>
                    </div>
                    <button class="remove-from-cart" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                cartItems.appendChild(cartItem);
            });
            
            // Додавання обробників подій для кнопок видалення
            cartItems.querySelectorAll('.remove-from-cart').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.removeItem(btn.getAttribute('data-id'));
                });
            });
        }
        
        // Оновлення загальної суми
        document.querySelector('.total-price').textContent = `${this.total.toLocaleString('uk-UA')} ₴`;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Анімація сповіщення
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    loadFromLocalStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    }
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    const cart = new Cart();
});