// --- Mobile Menu Layout Handler ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.className = 'fas fa-bars';
    });
});

// --- Category Menu Filters ---
const filterButtons = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const filterValue = button.getAttribute('data-filter');

        menuItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                setTimeout(() => { item.style.opacity = '1'; }, 10);
            } else {
                item.style.opacity = '0';
                item.style.display = 'none';
            }
        });
    });
});

// --- CART COUNTER & WHATSAPP LOGIC ---
let cart = {}; 

const cartBar = document.getElementById('cartBar');
const cartItemsCount = document.getElementById('cartItemsCount');
const cartTotalBill = document.getElementById('cartTotalBill');
const whatsappCheckoutBtn = document.getElementById('whatsappCheckoutBtn');

// Monitor and add tracking to increment control triggers
document.querySelectorAll('.quantity-controls').forEach(control => {
    const name = control.getAttribute('data-name');
    const price = parseInt(control.getAttribute('data-price'));
    const qtyDisplay = control.querySelector('.qty');
    const plusBtn = control.querySelector('.plus-btn');
    const minusBtn = control.querySelector('.minus-btn');

    plusBtn.addEventListener('click', () => {
        if (!cart[name]) {
            cart[name] = { price: price, qty: 0 };
        }
        cart[name].qty += 1;
        qtyDisplay.textContent = cart[name].qty;
        updateCartStatus();
    });

    minusBtn.addEventListener('click', () => {
        if (cart[name] && cart[name].qty > 0) {
            cart[name].qty -= 1;
            qtyDisplay.textContent = cart[name].qty;
            
            if (cart[name].qty === 0) {
                delete cart[name];
            }
            updateCartStatus();
        }
    });
});

// Evaluate real-time grand total bill details
function updateCartStatus() {
    let totalItems = 0;
    let totalBill = 0;

    for (let item in cart) {
        totalItems += cart[item].qty;
        totalBill += (cart[item].price * cart[item].qty);
    }

    cartItemsCount.textContent = `${totalItems} Item${totalItems > 1 ? 's' : ''}`;
    cartTotalBill.textContent = `₹${totalBill}`;

    if (totalItems > 0) {
        cartBar.classList.add('show');
    } else {
        cartBar.classList.remove('show');
    }
}

// Generate the itemized text and send straight to WhatsApp
whatsappCheckoutBtn.addEventListener('click', () => {
    const restaurantPhone = "918167046888"; // The Basiil Contact Number
    
    // Capture the dynamic Cooking Request text input
    const instructions = document.getElementById('cookingInstructions').value.trim();
    
    let message = `*--- NEW ORDER FOR THE BASIIL ---*\n\n`;
    let grandTotal = 0;

    for (let item in cart) {
        let itemTotal = cart[item].price * cart[item].qty;
        grandTotal += itemTotal;
        message += `• *${item}* x ${cart[item].qty} = ₹${itemTotal}\n`;
    }

    message += `\n*Total Bill Amount: ₹${grandTotal}*\n`;
    
    // Inject custom cooking request details if the input isn't blank
    if (instructions !== "") {
        message += `-------------------------\n`;
        message += `💡 *Special Instructions:* ${instructions}\n`;
    }

    message += `-------------------------\n`;
    message += `Please confirm my order and share payment details! 🙏`;

    // Process characters cleanly into text code formatting
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${restaurantPhone}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
});

