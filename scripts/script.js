// Centralized fetch function
async function fetchProducts() {
    try {
        const response = await fetch('/product-admin/products.json'); // Use absolute path
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

// Google Maps initialization
function initMap() {
    const elements = document.querySelectorAll('.js-map');
    Array.prototype.forEach.call(elements, function (el) {
        const lat = +el.dataset.latitude;
        const lng = +el.dataset.longitude;
        const zoom = +el.dataset.zoom;
        if ((lat !== '') && (lng !== '') && (zoom > 0)) {
            var map = new google.maps.Map(el, { zoom: zoom, center: { lat: lat, lng: lng }, disableDefaultUI: true });
            var marker = new google.maps.Marker({ map: map, animation: google.maps.Animation.DROP, position: { lat: lat, lng: lng } });
        }
    });
}

// Product grid view switcher
(function () {
    var container = document.getElementById('products');
    if (container) {
        var grid = container.querySelector('.js-products-grid'),
            viewClass = 'tm-products-',
            optionSwitch = Array.prototype.slice.call(container.querySelectorAll('.js-change-view a'));
        function init() {
            optionSwitch.forEach(function (el, i) {
                el.addEventListener('click', function (ev) {
                    ev.preventDefault();
                    _switch(this);
                }, false);
            });
        }
        function _switch(opt) {
            optionSwitch.forEach(function (el) {
                grid.classList.remove(viewClass + el.getAttribute('data-view'));
            });
            grid.classList.add(viewClass + opt.getAttribute('data-view'));
        }
        init();
    }
})();

// Quantity incrementer
function increment(incrementor, target) {
    var value = parseInt(document.getElementById(target).value, 10);
    value = isNaN(value) ? 0 : value;
    if (incrementor < 0) {
        if (value > 1) { value += incrementor; }
    } else {
        value += incrementor;
    }
    document.getElementById(target).value = value;
}

// UIkit interactions
(function () { UIkit.scroll('.js-scroll-to-description', { duration: 300, offset: 58 }); })();
(function () { UIkit.util.on('.js-product-switcher', 'show', function () { UIkit.update(); }); })();
(function () {
    var addToCartButtons = document.querySelectorAll('.js-add-to-cart');
    Array.prototype.forEach.call(addToCartButtons, function (el) {
        el.onclick = function () { UIkit.offcanvas('#cart-offcanvas').show(); };
    });
})();
(function () {
    var addToButtons = document.querySelectorAll('.js-add-to');
    Array.prototype.forEach.call(addToButtons, function (el) {
        var link;
        var message = '<span class="uk-margin-small-right" uk-icon=\'check\'></span>Added to ';
        var links = { favorites: '<a href="/favorites">favorites</a>', compare: '<a href="/compare">compare</a>' };
        if (el.classList.contains('js-add-to-favorites')) { link = links.favorites; }
        if (el.classList.contains('js-add-to-compare')) { link = links.compare; }
        el.onclick = function () {
            if (!this.classList.contains('js-added-to')) { UIkit.notification({ message: message + link, pos: 'bottom-right' }); }
            this.classList.toggle('tm-action-button-active');
            this.classList.toggle('js-added-to');
        };
    });
})();

// Product card creation
function createProductCard(product) {
    if (!product || !product.title) { return ''; }

    const price = product.variations && product.variations.sizes && product.variations.sizes.length > 0
        ? `£${parseFloat(product.variations.sizes[0].price || 0).toFixed(2)}`
        : `£${parseFloat(product.price || 0).toFixed(2)}`;

    let label = '';
    let labelClass = '';
    let labelBg = '';
    if (product.newArrival) {
        label = 'New';
        labelClass = 'uk-label-success';
        labelBg = '#28a745';
    } else if (product.topSelling) {
        label = 'Top';
        labelClass = 'uk-label-warning';
        labelBg = '#ffc107';
    } else if (product.outStock) {
        label = 'Sold Out';
        labelClass = 'uk-label-danger';
        labelBg = '#dc3545';
    }

    const image = product.images && product.images.length > 0
        ? product.images[0]
        : 'https://via.placeholder.com/400x300?text=No+Image';

    // Calculate average rating
    const averageRating = product.reviews && product.reviews.length
        ? (product.reviews.reduce((sum, review) => sum + parseFloat(review.rating || 0), 0) / product.reviews.length).toFixed(1)
        : 'No Rating';

    // Category and subcategory
    const categoryText = `${product.category || ''}${product.subcategory ? ' / ' + product.subcategory : ''}`;

    return `
        <li style="min-width: 0;">
            <article class="tm-product-card uk-card">
                <div class="tm-product-card-media">
                    <div class="tm-ratio tm-ratio-4-3">
                        <a class="tm-media-box" href="product.html?id=${product.id}">
                            <div class="tm-product-card-labels">
                                ${product.topSelling ? '<span class="uk-label uk-label-warning">Top Selling</span>' : ''}
                                ${product.newArrival ? '<span class="uk-label uk-label-success">New Arrival</span>' : ''}
                                ${product.outStock ? '<span class="uk-label uk-label-danger">Out of stock</span>' : ''}
                            </div>
                            <figure class="tm-media-box-wrap">
                                <img src="${image}" alt="${product.title}" style="object-fit: cover; width: 100%; height: 100%;" />
                            </figure>
                        </a>
                    </div>
                </div>
                <div class="tm-product-card-body">
                    <div class="tm-product-card-info">
                        <div class="uk-text-meta uk-margin-xsmall-bottom">${categoryText}</div>
                        <h3 class="tm-product-card-title">
                            <a class="uk-link-heading text-bold" href="product.html?id=${product.id}">${product.title}</a>
                        </h3>
                        <ul class="uk-list uk-text-small tm-product-card-properties">
                            <li><span class="uk-text-muted">Size: </span><span>${product.specifications?.size || 'N/A'}</span></li>
                            <li><span class="uk-text-muted">Color: </span><span>${product.specifications?.color || 'N/A'}</span></li>
                            <li><span class="uk-text-muted">Material: </span><span>${product.specifications?.material || 'N/A'}</span></li>
                            <li><span class="uk-text-muted">Rating: </span><span>${averageRating}</span></li>
                        </ul>
                    </div>
                    <div class="tm-product-card-shop">
                        <div class="tm-product-card-prices">
                            ${product.oldPrice ? `<del class="uk-text-meta">£${product.oldPrice}</del>` : ''}
                            <div class="tm-product-card-price">${price}</div>
                        </div>
                        <div class="tm-product-card-add">
                            <div class="uk-text-meta tm-product-card-actions">
                                <a class="tm-product-card-action js-add-to js-add-to-favorites" title="Add to favorites">
                                    <span uk-icon="icon: heart; ratio: .95;"></span>
                                    <span class="tm-product-card-action-text">Add to favorites</span>
                                </a>
                            </div>
                            <button class="uk-button uk-button-primary tm-product-card-add-button tm-shine js-add-to-cart">
                                <span class="tm-product-card-add-button-icon" uk-icon="cart"></span>
                                <span class="tm-product-card-add-button-text">add to cart</span>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </li>
    `;
}

// Best Selling card creation
function createBestSellingCard(product) {
    if (!product || !product.title || !product.id) return '';

    const image = product.images?.[0] || 'https://via.placeholder.com/1000x563?text=No+Image';
    const productUrl = `product.html?id=${product.id}`;

    const ratingText = product.reviews?.length
        ? (product.reviews.reduce((sum, review) => sum + parseFloat(review.rating || 0), 0) / product.reviews.length).toFixed(1)
        : 'No Rating';

    const categoryText = `${product.category || ''}${product.subcategory ? ' / ' + product.subcategory : ''}`;

    return `
        <li style="padding: 10px; box-sizing: border-box; border-radius: 5px;">
            <div class="uk-inline-clip uk-transition-toggle uk-height-medium uk-width-1-1" tabindex="0" style="border-radius: 10px; overflow: hidden;">
                <a href="${productUrl}" class="tm-best-selling-media-box">
                    <img src="${image}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">
                    <div class="uk-overlay uk-overlay-primary uk-position-top-left uk-padding-small category-text">
                        ${categoryText}
                    </div>
                    <div class=" uk-position-bottom uk-text-center uk-transition-slide-bottom" style="background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent); padding: 20px;">
                        <h4 class="uk-margin-remove uk-text-bold " style="color: rgb(226, 225, 225);">${product.title}</h4>
                    </div>
                    <div class="tm-best-selling-rating-badge">
                        <span class="uk-icon" uk-icon="icon: star; ratio: 1;"></span>
                        <span>${ratingText}</span>
                    </div>
                </a>
            </div>
        </li>
    `;
}

// Featured Products
document.addEventListener('DOMContentLoaded', async () => {
    const slider = document.getElementById('product-slider');
    const container = document.querySelector('.featured-container');

    try {
        const products = await fetchProducts();
        const featuredProducts = products
            .filter(p => p && (p.newArrival || p.topSelling || (p.inStock && p.inStock > 0)))
            .slice(0, 8);

        if (featuredProducts.length === 0) {
            if (slider) {
                slider.innerHTML = '<li style="padding: 15px; text-align: center; font-size: 1rem; color: #111;">No trending products available</li>';
            }
            if (container) {
                container.innerHTML = '<div style="padding: 15px; text-align: center; font-size: 1rem; color: #111;">No trending products available</div>';
            }
            return;
        }

        featuredProducts.forEach(product => {
            const cardHtml = createProductCard(product);
            if (cardHtml) {
                if (slider) {
                    slider.innerHTML += cardHtml;
                }
                if (container) {
                    const card = document.createElement('div');
                    card.innerHTML = cardHtml;
                    container.appendChild(card.querySelector('article'));
                }
            }
        });

        if (slider) {
            UIkit.slider(slider.parentElement, {
                autoplay: true,
                autoplayInterval: 3000,
                finite: false,
                pauseOnHover: true
            });
        }
    } catch (error) {
        if (slider) {
            slider.innerHTML = `<li style="padding: 15px; text-align: center; font-size: 1rem; color: #111;">Error loading products: ${error.message}</li>`;
        }
        if (container) {
            container.innerHTML = `<div style="padding: 15px; text-align: center; font-size: 1rem; color: #111;">Error loading products: ${error.message}</div>`;
        }
    }
});

// Best Selling Slider
document.addEventListener('DOMContentLoaded', async () => {
    const slider = document.getElementById('best-selling-slider');
    if (!slider) return;

    try {
        const products = await fetchProducts();
        const bestSellingProducts = products
            .filter(p => p && (p.topSelling || p.newArrival || (p.inStock && p.inStock > 0)))
            .slice(0, 12);

        if (bestSellingProducts.length === 0) {
            slider.innerHTML = '<li style="padding: 20px; text-align: center; font-size: 1.2rem; color: #333;">No best-selling products available</li>';
            return;
        }

        bestSellingProducts.forEach(product => {
            const cardHtml = createBestSellingCard(product);
            if (cardHtml) slider.innerHTML += cardHtml;
        });

        UIkit.slider(slider.parentElement, { finite: true, sets: true });
    } catch (error) {
        slider.innerHTML = `<li style="padding: 20px; text-align: center; font-size: 1.2rem; color: #333;">Error loading products: ${error.message}</li>`;
    }
});

// Lookbook
document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('lookbook-grid');
    if (!grid) return;

    try {
        const products = await fetchProducts();
        const productsByCategory = products.reduce((acc, product) => {
            if (!acc[product.category]) acc[product.category] = product;
            return acc;
        }, {});
        const lookbookItems = Object.values(productsByCategory);

        lookbookItems.forEach(product => {
            const image = product.images?.[0] || 'https://via.placeholder.com/600';
            const title = product.category;
            const link = `category.html?cat=${encodeURIComponent(product.category)}`;

            const item = document.createElement('div');
            item.className = 'lookbook-item';
            item.innerHTML = `
                <a href="${link}" class="uk-inline-clip uk-transition-toggle" tabindex="0">
                    <img src="${image}" alt="${title}" class="uk-width-1-1 uk-height-medium uk-object-cover">
                    <div class="uk-overlay uk-overlay-primary uk-position-cover uk-flex uk-flex-center uk-flex-middle uk-transition-fade">
                        <div class="lookbook-content">
                            <h3 class="uk-text-uppercase uk-margin-remove">${title}</h3>
                            <button class="uk-button uk-button-primary uk-button-small uk-margin-small-top">Shop Now</button>
                        </div>
                    </div>
                </a>
            `;
            grid.appendChild(item);
        });
    } catch (error) {
        console.error('Lookbook load error:', error);
        grid.innerHTML = '<div style="padding: 20px; text-align: center; color: #333;">Error loading lookbook: ' + error.message + '</div>';
    }
});