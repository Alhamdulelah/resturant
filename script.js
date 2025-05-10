     // Mobile Navigation
     const hamburger = document.querySelector('.hamburger');
     const navLinks = document.querySelector('.nav-links');
     const links = document.querySelectorAll('.nav-links li');

     hamburger.addEventListener('click', () => {
         navLinks.classList.toggle('active');
         hamburger.classList.toggle('active');
     });

     links.forEach(link => {
         link.addEventListener('click', () => {
             navLinks.classList.remove('active');
             hamburger.classList.remove('active');
         });
     });

     // Sticky Header
     const header = document.getElementById('header');
     window.addEventListener('scroll', () => {
         if (window.scrollY > 100) {
             header.classList.add('scrolled');
         } else {
             header.classList.remove('scrolled');
         }
     });

     // Smooth Scrolling
     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
         anchor.addEventListener('click', function(e) {
             e.preventDefault();
             document.querySelector(this.getAttribute('href')).scrollIntoView({
                 behavior: 'smooth'
             });
         });
     });

     // Testimonial Slider
     const testimonials = document.querySelectorAll('.testimonial');
     const dots = document.querySelectorAll('.slider-dot');
     let currentTestimonial = 0;

     function showTestimonial(index) {
         testimonials.forEach(testimonial => testimonial.classList.remove('active'));
         dots.forEach(dot => dot.classList.remove('active'));
         
         testimonials[index].classList.add('active');
         dots[index].classList.add('active');
         currentTestimonial = index;
     }

     dots.forEach((dot, index) => {
         dot.addEventListener('click', () => showTestimonial(index));
     });

     // Auto slide change
     setInterval(() => {
         currentTestimonial = (currentTestimonial + 1) % testimonials.length;
         showTestimonial(currentTestimonial);
     }, 5000);

     // Back to Top Button
     const backToTopBtn = document.querySelector('.back-to-top');
     window.addEventListener('scroll', () => {
         if (window.scrollY > 300) {
             backToTopBtn.classList.add('active');
         } else {
             backToTopBtn.classList.remove('active');
         }
     });

     backToTopBtn.addEventListener('click', () => {
         window.scrollTo({
             top: 0,
             behavior: 'smooth'
         });
     });

     // Animation on Scroll
     function animateOnScroll() {
         const elements = document.querySelectorAll('.menu-item, .about-img, .about-content, .contact-info, .contact-form');
         
         elements.forEach(element => {
             const elementPosition = element.getBoundingClientRect().top;
             const screenPosition = window.innerHeight / 1.3;
             
             if (elementPosition < screenPosition) {
                 element.style.opacity = '1';
                 element.style.transform = 'translateY(0)';
             }
         });
     }

     // Set initial state for animated elements
     document.querySelectorAll('.menu-item, .about-img, .about-content, .contact-info, .contact-form').forEach(element => {
         element.style.opacity = '0';
         element.style.transform = 'translateY(30px)';
         element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
     });

     window.addEventListener('scroll', animateOnScroll);
     window.addEventListener('load', animateOnScroll);

     // Order System
     const orderModal = document.getElementById('orderModal');
     const closeModal = document.querySelector('.close-modal');
     const checkoutPage = document.getElementById('checkoutPage');
     const confirmationModal = document.getElementById('confirmationModal');
     const backToHome = document.getElementById('backToHome');
     const orderButtons = document.querySelectorAll('.menu-item-content .btn');
     const proceedToCheckout = document.getElementById('proceedToCheckout');
     const checkoutForm = document.getElementById('checkoutForm');
     const placeOrderBtn = document.getElementById('placeOrderBtn');
     const quantityInput = document.getElementById('quantity');
     const minusBtn = document.querySelector('.quantity-btn.minus');
     const plusBtn = document.querySelector('.quantity-btn.plus');

     let currentOrder = {
         items: [],
         subtotal: 0,
         tax: 0,
         total: 0
     };

     // Open order modal when clicking "Order Now"
     orderButtons.forEach(button => {
         button.addEventListener('click', (e) => {
             e.preventDefault();
             const menuItem = button.closest('.menu-item');
             const itemName = menuItem.querySelector('h3').textContent;
             const itemPrice = parseFloat(menuItem.querySelector('span').textContent.replace('$', ''));
             const itemImage = menuItem.querySelector('img').src;
             const itemDescription = menuItem.querySelector('p').textContent;
             
             document.getElementById('modalItemName').textContent = itemName;
             document.getElementById('modalItemPrice').textContent = itemPrice.toFixed(2);
             document.getElementById('modalItemImage').src = itemImage;
             document.getElementById('modalItemDescription').textContent = itemDescription;
             document.getElementById('quantity').value = 1;
             document.getElementById('requests').value = '';
             
             orderModal.style.display = 'block';
             document.body.style.overflow = 'hidden';
             
             // Store current item info
             currentOrder.currentItem = {
                 name: itemName,
                 price: itemPrice,
                 image: itemImage,
                 description: itemDescription
             };
         });
     });

     // Close modal
     closeModal.addEventListener('click', () => {
         orderModal.style.display = 'none';
         document.body.style.overflow = 'auto';
     });

     // Quantity controls
     minusBtn.addEventListener('click', () => {
         let value = parseInt(quantityInput.value);
         if (value > 1) {
             quantityInput.value = value - 1;
         }
     });

     plusBtn.addEventListener('click', () => {
         let value = parseInt(quantityInput.value);
         quantityInput.value = value + 1;
     });

     // Proceed to checkout
     proceedToCheckout.addEventListener('click', () => {
         const quantity = parseInt(quantityInput.value);
         const specialRequests = document.getElementById('requests').value;
         
         // Add item to order
         currentOrder.items = [{
             name: currentOrder.currentItem.name,
             price: currentOrder.currentItem.price,
             quantity: quantity,
             requests: specialRequests
         }];
         
         // Calculate totals
         calculateOrderTotals();
         
         // Update order summary
         updateOrderSummary();
         
         // Show checkout page
         orderModal.style.display = 'none';
         checkoutPage.style.display = 'block';
         document.body.style.overflow = 'hidden';
     });

     // Calculate order totals
     function calculateOrderTotals() {
         currentOrder.subtotal = currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
         currentOrder.tax = currentOrder.subtotal * 0.08; // 8% tax
         currentOrder.total = currentOrder.subtotal + currentOrder.tax;
     }

     // Update order summary
     function updateOrderSummary() {
         const summaryItems = document.getElementById('summaryItems');
         summaryItems.innerHTML = '';
         
         currentOrder.items.forEach(item => {
             const itemElement = document.createElement('div');
             itemElement.className = 'summary-item';
             itemElement.innerHTML = `
                 <div>
                     <div class="item-name">${item.name}</div>
                     <div class="item-quantity">Qty: ${item.quantity}</div>
                     ${item.requests ? `<div class="item-requests">Note: ${item.requests}</div>` : ''}
                 </div>
                 <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
             `;
             summaryItems.appendChild(itemElement);
         });
         
         document.getElementById('subtotal').textContent = currentOrder.subtotal.toFixed(2);
         document.getElementById('tax').textContent = currentOrder.tax.toFixed(2);
         document.getElementById('total').textContent = currentOrder.total.toFixed(2);
     }

     // Place order
     checkoutForm.addEventListener('submit', (e) => {
         e.preventDefault();
         
         // In a real app, you would send this data to your backend
         const orderData = {
             ...currentOrder,
             customer: {
                 name: document.getElementById('name').value,
                 email: document.getElementById('email').value,
                 phone: document.getElementById('phone').value,
                 address: document.getElementById('address').value,
                 payment: document.getElementById('payment').value
             },
             orderId: 'SB-' + Math.floor(Math.random() * 1000000)
         };
         
         // Show confirmation
         document.getElementById('orderId').textContent = orderData.orderId;
         checkoutPage.style.display = 'none';
         confirmationModal.style.display = 'flex';
     });

     // Back to home from confirmation
     backToHome.addEventListener('click', () => {
         confirmationModal.style.display = 'none';
         document.body.style.overflow = 'auto';
         
         // Reset form
         checkoutForm.reset();
         currentOrder = {
             items: [],
             subtotal: 0,
             tax: 0,
             total: 0
         };
     });

     // Close modals when clicking outside
     window.addEventListener('click', (e) => {
         if (e.target === orderModal) {
             orderModal.style.display = 'none';
             document.body.style.overflow = 'auto';
         }
         if (e.target === confirmationModal) {
             confirmationModal.style.display = 'none';
             document.body.style.overflow = 'auto';
         }
     });