$(document).ready(function () {
    // Данные о товарах
    const productsData = {
        1: {
            name: "PlayStation 5",
            price: 54990,
            images: ["images/ps5.png", "images/ps5_2.png", "images/ps5_3.png"],
            description: "PlayStation 5 - новейшая игровая консоль от Sony с революционной скоростью загрузки, потрясающей графикой и новым геймпадом DualSense с тактильной отдачей.",
            specs: {
                manufacturer: "Sony",
                year: "2020",
                cpu: "8-ядерный AMD Zen 2, 3.5 ГГц",
                gpu: "AMD RDNA 2, 10.28 TFLOPS",
                memory: "16GB GDDR6",
                storage: "825GB NVMe SSD"
            }
        },
        2: {
            name: "Xbox Series X",
            price: 49990,
            images: ["images/xbox.png", "images/xbox_2.png", "images/xbox_3.png"],
            description: "Xbox Series X - самая мощная консоль Microsoft с поддержкой 4K при 120 FPS, быстрой загрузкой и обратной совместимостью с предыдущими поколениями.",
            specs: {
                manufacturer: "Microsoft",
                year: "2020",
                cpu: "8-ядерный AMD Zen 2, 3.8 ГГц",
                gpu: "AMD RDNA 2, 12 TFLOPS",
                memory: "16GB GDDR6",
                storage: "1TB NVMe SSD"
            }
        },
        3: {
            name: "Nintendo Switch",
            price: 29990,
            images: ["images/switch.png", "images/switch_2.png", "images/switch_3.png"],
            description: "Гибридная консоль Nintendo Switch может использоваться как домашняя и портативная система, с уникальными эксклюзивами от Nintendo.",
            specs: {
                manufacturer: "Nintendo",
                year: "2017",
                cpu: "NVIDIA Custom Tegra",
                gpu: "NVIDIA Custom",
                memory: "4GB",
                storage: "32GB (расширяемая)"
            }
        },
        4: {
            name: "PlayStation 4 Pro",
            price: 34990,
            images: ["images/ps4pro.png", "images/ps4pro_2.png", "images/ps4pro_3.png"],
            description: "Улучшенная версия PS4 с поддержкой 4K и HDR, идеальный выбор для тех, кто хочет мощную консоль по более доступной цене.",
            specs: {
                manufacturer: "Sony",
                year: "2016",
                cpu: "8-ядерный AMD Jaguar, 2.1 ГГц",
                gpu: "AMD Radeon, 4.2 TFLOPS",
                memory: "8GB GDDR5",
                storage: "1TB HDD"
            }
        },
        5: {
            name: "Xbox One X",
            price: 27990,
            images: ["images/xboxonex.png", "images/xboxonex_2.png", "images/xboxonex_3.png"],
            description: "Самая мощная консоль предыдущего поколения от Microsoft с поддержкой 4K и высокой производительностью.",
            specs: {
                manufacturer: "Microsoft",
                year: "2017",
                cpu: "8-ядерный AMD Jaguar, 2.3 ГГц",
                gpu: "AMD Radeon, 6 TFLOPS",
                memory: "12GB GDDR5",
                storage: "1TB HDD"
            }
        },
        6: {
            name: "Nintendo 3DS",
            price: 14990,
            images: ["images/nintendo3ds.png", "images/nintendo3ds_2.png", "images/nintendo3ds_3.png"],
            description: "Портативная консоль с уникальной технологией 3D без очков и огромной библиотекой эксклюзивных игр.",
            specs: {
                manufacturer: "Nintendo",
                year: "2011",
                cpu: "Dual-core ARM11",
                gpu: "DMP PICA200",
                memory: "128MB FCRAM",
                storage: "Карты памяти SD (до 32GB)"
            }
        }
    };

    // Корзина
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    let promoCodes = {
        "4TECH10": 0.10,
        "GAMER20": 0.20
    };
    let discount = 0;

    // Обновление вида корзины
    function updateCartView() {
        let cartItemsElement = $('#cart-items');
        let cartTotalElement = $('#cart-total');
        let cartCountElement = $('#cart-count');
        let total = 0;
        let count = 0;

        cartItemsElement.empty();

        for (let id in cart) {
            if (cart.hasOwnProperty(id)) {
                let item = cart[id];
                let product = productsData[id];
                let itemTotal = product.price * item.quantity;
                total += itemTotal;
                count += item.quantity;

                cartItemsElement.append(`
                    <li class="cart-item">
                        <div class="cart-item-info">
                            <img src="${product.images[0]}" alt="${product.name}" class="cart-item-image">
                            <div class="cart-item-details">
                                <h4>${product.name}</h4>
                                <div class="quantity-controls">
                                    <button class="quantity-btn minus" data-id="${id}">-</button>
                                    <span class="quantity">${item.quantity}</span>
                                    <button class="quantity-btn plus" data-id="${id}">+</button>
                                </div>
                            </div>
                        </div>
                        <div class="cart-item-price">${(product.price * item.quantity).toLocaleString()} ₽</div>
                        <button class="remove-from-cart" data-id="${id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </li>
                `);
            }
        }

        if (discount > 0) {
            total = total - (total * discount);
        }

        cartTotalElement.text(total.toLocaleString() + ' ₽');
        cartCountElement.text(count);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Добавление в корзину
    $(document).on('click', '.add-to-cart', function (e) {
        e.preventDefault();
        let product = $(this).closest('.product-item');
        let id = product.data('id');

        if (cart[id]) {
            cart[id].quantity++;
        } else {
            cart[id] = {
                quantity: 1
            };
        }

        updateCartView();
        showNotification('Товар добавлен в корзину');
    });

    // Удаление из корзины
    $(document).on('click', '.remove-from-cart', function () {
        let id = $(this).data('id');
        delete cart[id];
        updateCartView();
    });

    // Изменение количества
    $(document).on('click', '.quantity-btn', function () {
        let id = $(this).data('id');
        let isPlus = $(this).hasClass('plus');

        if (isPlus) {
            cart[id].quantity++;
        } else {
            if (cart[id].quantity > 1) {
                cart[id].quantity--;
            } else {
                delete cart[id];
            }
        }

        updateCartView();
    });

    // Модальное окно корзины
    var cartModal = $('#cart-modal');
    var cartIcon = $('#cart-icon');
    var closeButton = $('.close-button');

    cartIcon.click(function (e) {
        e.preventDefault();
        updateCartView();
        cartModal.css('display', 'block');
    });

    closeButton.click(function () {
        $(this).closest('.modal').css('display', 'none');
    });

    $(window).click(function (event) {
        if ($(event.target).hasClass('modal')) {
            $('.modal').css('display', 'none');
        }
    });

    // Применение промокода
    $('#apply-promo-code').click(function () {
        let promoCode = $('#promo-code-input').val().toUpperCase();

        if (promoCodes[promoCode]) {
            discount = promoCodes[promoCode];
            updateCartView();
            showNotification('Промокод применён! Скидка ' + (discount * 100) + '%');
        } else {
            showNotification('Неверный промокод', 'error');
            discount = 0;
            updateCartView();
        }
    });

    // Фильтрация товаров
    function filterProducts() {
        let selectedType = $('#filter-type').val();
        let selectedPrice = $('#filter-price').val();
        let selectedBrand = $('#filter-brand').val();

        $('.product-item').each(function () {
            let type = $(this).data('type');
            let price = parseFloat($(this).data('price'));
            let brand = $(this).data('brand');
            let show = true;

            if (selectedType !== 'all' && type !== selectedType) {
                show = false;
            }

            if (selectedPrice !== 'all') {
                if (selectedPrice === 'low' && price > 30000) {
                    show = false;
                } else if (selectedPrice === 'medium' && (price < 30000 || price > 50000)) {
                    show = false;
                } else if (selectedPrice === 'high' && price < 50000) {
                    show = false;
                }
            }

            if (selectedBrand !== 'all' && brand !== selectedBrand) {
                show = false;
            }

            $(this).toggle(show);
        });
    }

    $('#filter-type, #filter-price, #filter-brand').change(filterProducts);
    $('#reset-filters').click(function() {
        $('#filter-type, #filter-price, #filter-brand').val('all');
        filterProducts();
    });

    // Модальное окно с деталями товара
    $('.view-details').click(function () {
        let product = $(this).closest('.product-item');
        let productId = product.data('id');
        let productData = productsData[productId];
        
        $('#product-name').text(productData.name);
        $('#product-price').text(productData.price.toLocaleString() + ' ₽');
        $('#product-description').text(productData.description);
        
        // Заполняем характеристики
        for (let spec in productData.specs) {
            $('#spec-' + spec).text(productData.specs[spec]);
        }
        
        // Заполняем изображения
        let mainImage = $('#main-product-image');
        let thumbnailContainer = $('.thumbnail-container');
        
        mainImage.attr('src', productData.images[0]);
        thumbnailContainer.empty();
        
        productData.images.forEach((image, index) => {
            thumbnailContainer.append(`
                <img class="thumbnail ${index === 0 ? 'active' : ''}" 
                     src="${image}" 
                     alt="${productData.name} фото ${index + 1}">
            `);
        });
        
        // Обработчик кликов на миниатюры
        $('.thumbnail').click(function() {
            $('.thumbnail').removeClass('active');
            $(this).addClass('active');
            mainImage.attr('src', $(this).attr('src'));
        });
        
        // Сохраняем ID товара для добавления в корзину
        $('#product-details-modal').data('product-id', productId);
        $('#product-details-modal').css('display', 'block');
    });

    // Добавление в корзину из модального окна
    $('#product-details-modal .add-to-cart').click(function () {
        let productId = $('#product-details-modal').data('product-id');

        if (cart[productId]) {
            cart[productId].quantity++;
        } else {
            cart[productId] = {
                quantity: 1
            };
        }

        updateCartView();
        $('#product-details-modal').css('display', 'none');
        showNotification('Товар добавлен в корзину');
    });

    // Валидация формы
    $('#contactForm').submit(function (e) {
        let email = $('#email').val();
        let phone = $('#phone').val();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let phoneRegex = /^(\+7|8)[\d\s()-]{10,15}$/;
        let isValid = true;

        if (!emailRegex.test(email)) {
            showNotification('Пожалуйста, введите корректный email', 'error');
            isValid = false;
        }

        if (!phoneRegex.test(phone)) {
            showNotification('Пожалуйста, введите корректный номер телефона', 'error');
            isValid = false;
        }

        if (isValid) {
            e.preventDefault();
            showNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
            $('#contactForm')[0].reset();
        } else {
            e.preventDefault();
        }
    });

    // Уведомления
    function showNotification(message, type = 'success') {
        let notification = $(`
            <div class="notification ${type}">
                ${message}
            </div>
        `);
        
        $('body').append(notification);
        
        setTimeout(() => {
            notification.fadeOut(300, () => notification.remove());
        }, 3000);
    }

    // Инициализация
    updateCartView();
});