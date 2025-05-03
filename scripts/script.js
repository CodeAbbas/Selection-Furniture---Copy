
function initMap() { var elements = document.querySelectorAll('.js-map'); Array.prototype.forEach.call(elements, function (el) { var lat = +el.dataset.latitude, lng = +el.dataset.longitude, zoom = +el.dataset.zoom; if ((lat !== '') && (lng !== '') && (zoom > 0)) { var map = new google.maps.Map(el, { zoom: zoom, center: { lat: lat, lng: lng }, disableDefaultUI: true }); var marker = new google.maps.Marker({ map: map, animation: google.maps.Animation.DROP, position: { lat: lat, lng: lng } }); } }); }
(function () {
    var container = document.getElementById('products'); if (container) {
        var grid = container.querySelector('.js-products-grid'), viewClass = 'tm-products-', optionSwitch = Array.prototype.slice.call(container.querySelectorAll('.js-change-view a')); function init() { optionSwitch.forEach(function (el, i) { el.addEventListener('click', function (ev) { ev.preventDefault(); _switch(this); }, false); }); }
        function _switch(opt) { optionSwitch.forEach(function (el) { grid.classList.remove(viewClass + el.getAttribute('data-view')); }); grid.classList.add(viewClass + opt.getAttribute('data-view')); }
        init();
    }
})(); function increment(incrementor, target) {
    var value = parseInt(document.getElementById(target).value, 10); value = isNaN(value) ? 0 : value; if (incrementor < 0) { if (value > 1) { value += incrementor; } } else { value += incrementor; }
    document.getElementById(target).value = value;
}
(function () { UIkit.scroll('.js-scroll-to-description', { duration: 300, offset: 58 }); })(); (function () { UIkit.util.on('.js-product-switcher', 'show', function () { UIkit.update(); }); })(); (function () { var addToCartButtons = document.querySelectorAll('.js-add-to-cart'); Array.prototype.forEach.call(addToCartButtons, function (el) { el.onclick = function () { UIkit.offcanvas('#cart-offcanvas').show(); }; }); })(); (function () {
    var addToButtons = document.querySelectorAll('.js-add-to'); Array.prototype.forEach.call(addToButtons, function (el) {
        var link; var message = '<span class="uk-margin-small-right" uk-icon=\'check\'></span>Added to '; var links = { favorites: '<a href="/favorites">favorites</a>', compare: '<a href="/compare">compare</a>', }; if (el.classList.contains('js-add-to-favorites')) { link = links.favorites; }; if (el.classList.contains('js-add-to-compare')) { link = links.compare; }
        el.onclick = function () {
            if (!this.classList.contains('js-added-to')) { UIkit.notification({ message: message + link, pos: 'bottom-right' }); }
            this.classList.toggle('tm-action-button-active'); this.classList.toggle('js-added-to');
        };
    });
})();

// Function to create product card HTML
function createProductCard(product) {
    // Validate product data
    if (!product || !product.title) {
        return '';
    }

    // Get price from first variation or fallback
    const price = product.variations && product.variations.sizes && product.variations.sizes.length > 0 
        ? `$${parseFloat(product.variations.sizes[0].price || 0).toFixed(2)}`
        : 'Contact for Price';

    // Determine label
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

    // Get first image or fallback
    const image = product.images && product.images.length > 0 
        ? product.images[0]
        : 'https://via.placeholder.com/400x300?text=No+Image';

    return `
        <li style="min-width: 0;">
            <div class="tm-product-card uk-card" >
                <div class="uk-card-media-top uk-position-relative">
                    <img src="${product.images[0]}" alt="${product.title}" style="height: 240px; object-fit: cover; width: 100%;">
                    <div class="uk-position-top-left uk-label-container">
                        ${product.topSelling ? '<span class="uk-label uk-label-warning">Top Selling</span>' : ''}
                        ${product.newArrival ? '<span class="uk-label uk-label-success">New Arrival</span>' : ''}
                        ${product.outStock ? '<span class="uk-label uk-label-danger">Out of Stock</span>' : ''}
                    </div>
                </div>
                <h3 class="tm-product-card-title" style="padding: 0.625rem 0 0 0.625rem;">
                    <a class="uk-link-heading text-bold" style="font-size: 1.2rem; " href="product.html?id=${product.id}">${product.title}</a>
                </h3>
                <div class="tm-product-card-shop" style="padding: 0 0 1rem 0.625rem;">
                    <div class="tm-product-card-prices">
                        ${product.oldPrice ? `<del class="uk-text-meta">£${product.oldPrice}</del>` : ''}
                        <div class="tm-product-card-price">£${product.variations?.sizes?.[0]?.price || product.price}</div>
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
        </li>
    `;
}


//

// Fetch products and populate slider
document.addEventListener('DOMContentLoaded', () => {
    fetch('../product-admin/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            const slider = document.getElementById('product-slider');
            if (!slider) {
                console.error('Slider element not found');
                return;
            }

            // Filter for featured products and limit to 8
            const featuredProducts = products
                .filter(p => p && (p.newArrival || p.topSelling || (p.inStock && p.inStock > 0)))
                .slice(0, 8);

            if (featuredProducts.length === 0) {
                slider.innerHTML = '<li style="padding: 15px; text-align: center; font-size: 1rem; color: #111;">No trending products available</li>';
                return;
            }

            // Generate product cards
            featuredProducts.forEach(product => {
                const cardHtml = createProductCard(product);
                if (cardHtml) {
                    slider.innerHTML += cardHtml;
                }
            });

            // Initialize UIkit slider after content is loaded
            try {
                UIkit.slider(slider.parentElement, {
                    autoplay: true,
                    autoplayInterval: 3000,
                    finite: false,
                    pauseOnHover: true
                });
            } catch (e) {
                console.error('UIkit slider initialization failed:', e);
                slider.innerHTML = '<li style="padding: 15px; text-align: center; font-size: 1rem; color: #111;">Error initializing slider</li>';
            }
        })
        .catch(error => {
            console.error('Error loading products:', error);
            const slider = document.getElementById('product-slider');
            if (slider) {
                slider.innerHTML = '<li style="padding: 15px; text-align: center; font-size: 1rem; color: #111;">Error loading products: ' + error.message + '</li>';
            }
        });
});


// Best Selling Slider
function createBestSellingCard(product) {
    if (!product || !product.title || !product.id) return '';

    const image = product.images?.[0] || 'https://via.placeholder.com/1000x563?text=No+Image';
    const productUrl = `product.html?id=${product.id}`;

    const ratingText = product.reviews?.length
        ? (
            product.reviews.reduce((sum, review) => sum + parseFloat(review.rating || 0), 0) /
            product.reviews.length
        ).toFixed(1)
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

// best selling v1


// Fetch products and populate slider
document.addEventListener('DOMContentLoaded', () => {
    fetch('../product-admin/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            const slider = document.getElementById('best-selling-slider');
            if (!slider) {
                console.error('Best selling slider element not found');
                return;
            }

            // Filter for best-selling products and limit to 12
            const bestSellingProducts = products
                .filter(p => p && (p.topSelling || p.newArrival || (p.inStock && p.inStock > 0)))
                .slice(0, 12);

            if (bestSellingProducts.length === 0) {
                slider.innerHTML = '<li style="padding: 20px; text-align: center; font-size: 1.2rem; color: #333;">No best-selling products available</li>';
                return;
            }

            // Generate product cards
            bestSellingProducts.forEach(product => {
                const cardHtml = createBestSellingCard(product);
                if (cardHtml) {
                    slider.innerHTML += cardHtml;
                }
            });

            // Initialize UIkit slider after content is loaded
            try {
                UIkit.slider(slider.parentElement, {
                    finite: true,
                    sets: true
                });
            } catch (e) {
                console.error('UIkit slider initialization failed for best-selling slider:', e);
                slider.innerHTML = '<li style="padding: 20px; text-align: center; font-size: 1.2rem; color: #333;">Error initializing slider</li>';
            }
        })
        .catch(error => {
            console.error('Error loading products for best-selling slider:', error);
            const slider = document.getElementById('best-selling-slider');
            if (slider) {
                slider.innerHTML = '<li style="padding: 20px; text-align: center; font-size: 1.2rem; color: #333;">Error loading products: ' + error.message + '</li>';
            }
        });
});


// Lookbook
document.addEventListener('DOMContentLoaded', () => {
    fetch('product-admin/products.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(products => {
        const grid = document.getElementById('lookbook-grid');
        if (!grid) return;
  
        // Get one product per category
        const productsByCategory = products.reduce((acc, product) => {
          if (!acc[product.category]) {
            acc[product.category] = product;
          }
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
      })
      .catch(err => console.error('Lookbook load error:', err));
  });