// src/utils/api.js

/**
 * API istekleri için genel fetch fonksiyonu
 * @param {string} endpoint - API endpoint'i (/products, /categories gibi)
 * @param {Object} options - Fetch options (method, headers, body vs.)
 * @returns {Promise} API yanıtı
 */
export async function fetchAPI(endpoint, options = {}) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const url = `${apiUrl}${endpoint}`;
    
    // Varsayılan headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Eğer token varsa ekle
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
      ...options,
      headers,
    };
    
    try {
      const response = await fetch(url, config);
      
      // Token süresi dolduysa kullanıcıyı çıkış yaptır
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/giris?redirect=' + encodeURIComponent(window.location.pathname);
        }
        throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Bir hata oluştu');
      }
      
      return data;
    } catch (error) {
      console.error('API isteği başarısız:', error);
      throw error;
    }
  }
  
  /**
   * Ürünleri getiren fonksiyon
   * @param {Object} filters - Filtreler (category, q, minPrice, maxPrice vs.)
   * @param {Object} pagination - Sayfalama parametreleri (page, limit)
   * @param {string} sort - Sıralama parametresi (price_asc, name_desc vs.)
   * @returns {Promise} Ürün listesi
   */
  export async function getProducts(filters = {}, pagination = {}, sort = 'createdAt_desc') {
    const params = new URLSearchParams();
    
    // Filtreler
    if (filters.category) params.append('category', filters.category);
    if (filters.q) params.append('q', filters.q);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.isNew !== undefined) params.append('isNew', filters.isNew);
    if (filters.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured);
    
    // Sayfalama
    if (pagination.page) params.append('page', pagination.page);
    if (pagination.limit) params.append('limit', pagination.limit);
    
    // Sıralama
    params.append('sort', sort);
    
    return fetchAPI(`/products?${params.toString()}`);
  }
  
  /**
   * Kategorileri getiren fonksiyon
   * @returns {Promise} Kategori listesi
   */
  export async function getCategories() {
    return fetchAPI('/categories');
  }
  
  /**
   * Ürün detayını getiren fonksiyon
   * @param {string} id - Ürün ID'si veya slug'ı
   * @returns {Promise} Ürün detayı
   */
  export async function getProductById(id) {
    return fetchAPI(`/products/${id}`);
  }
  
  /**
   * Sepeti getiren fonksiyon
   * @returns {Promise} Sepet içeriği
   */
  export async function getCart() {
    return fetchAPI('/cart');
  }
  
  /**
   * Sepete ürün ekleyen fonksiyon
   * @param {Object} productData - Eklenecek ürün verileri
   * @returns {Promise} Güncellenmiş sepet
   */
  export async function addToCart(productData) {
    return fetchAPI('/cart/items', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }
  
  /**
   * Sepetteki ürün miktarını güncelleyen fonksiyon
   * @param {string} itemId - Sepet öğesi ID'si
   * @param {number} quantity - Yeni miktar
   * @returns {Promise} Güncellenmiş sepet
   */
  export async function updateCartItem(itemId, quantity) {
    return fetchAPI('/cart/items', {
      method: 'PUT',
      body: JSON.stringify({ itemId, quantity }),
    });
  }
  
  /**
   * Sepetten ürün silen fonksiyon
   * @param {string} itemId - Sepet öğesi ID'si
   * @returns {Promise} Güncellenmiş sepet
   */
  export async function removeCartItem(itemId) {
    return fetchAPI(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }
  
  /**
   * Sepete kampanya kodu uygulayan fonksiyon
   * @param {string} code - Kampanya kodu
   * @returns {Promise} Güncellenmiş sepet
   */
  export async function applyCoupon(code) {
    return fetchAPI('/cart/campaign', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }
  
  /**
   * Sepetten kampanya kodunu kaldıran fonksiyon
   * @returns {Promise} Güncellenmiş sepet
   */
  export async function removeCoupon() {
    return fetchAPI('/cart/campaign', {
      method: 'DELETE',
    });
  }
  
  /**
   * Kullanıcı girişi fonksiyonu
   * @param {Object} credentials - Giriş bilgileri (email, password)
   * @returns {Promise} Token ve kullanıcı bilgileri
   */
  export async function loginUser(credentials) {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Giriş başarısız');
    }
    
    // Token'ı localStorage'a kaydet
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.access_token);
    }
    
    return data;
  }
  
  /**
   * Kullanıcı kaydı fonksiyonu
   * @param {Object} userData - Kullanıcı bilgileri
   * @returns {Promise} Kayıt yanıtı
   */
  export async function registerUser(userData) {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
  
  /**
   * Kullanıcı bilgilerini getiren fonksiyon
   * @returns {Promise} Kullanıcı bilgileri
   */
  export async function getUserProfile() {
    return fetchAPI('/users/me');
  }
  
  /**
   * Sipariş oluşturan fonksiyon
   * @param {Object} orderData - Sipariş bilgileri
   * @returns {Promise} Sipariş yanıtı
   */
  export async function createOrder(orderData) {
    return fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }
  
  /**
   * Siparişleri getiren fonksiyon
   * @returns {Promise} Sipariş listesi
   */
  export async function getOrders() {
    return fetchAPI('/orders');
  }
  
  /**
   * Sipariş detayını getiren fonksiyon
   * @param {string} orderId - Sipariş ID'si
   * @returns {Promise} Sipariş detayı
   */
  export async function getOrderById(orderId) {
    return fetchAPI(`/orders/${orderId}`);
  }

  