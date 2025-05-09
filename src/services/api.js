import axios from 'axios';

// API temel URL'ini tanımla
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// İstek gönderilmeden önce token ekle (interceptor)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Kullanıcı işlemleri
export const userService = {
  // Kullanıcı profil bilgilerini getir
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Kullanıcı profil bilgilerini güncelle
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/user/profile', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Şifre değiştir
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/user/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Çıkış yap
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      localStorage.removeItem('token');
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      throw error;
    }
  }
};

// Sipariş işlemleri
export const orderService = {
  // Kullanıcının siparişlerini getir
  getOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Sipariş detaylarını getir
  getOrderDetails: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Favori ürünler işlemleri
export const favoriteService = {
  // Favorileri getir
  getFavorites: async () => {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Favorilere ekle
  addToFavorites: async (productId) => {
    try {
      const response = await api.post('/favorites', { productId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Favorilerden çıkar
  removeFromFavorites: async (favoriteId) => {
    try {
      const response = await api.delete(`/favorites/${favoriteId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Adres işlemleri
export const addressService = {
  // Adresleri getir
  getAddresses: async () => {
    try {
      const response = await api.get('/addresses');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Adres ekle
  addAddress: async (addressData) => {
    try {
      const response = await api.post('/addresses', addressData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Adres güncelle
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Adres sil
  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Varsayılan adres yap
  setDefaultAddress: async (addressId, type) => {
    try {
      const response = await api.put(`/addresses/${addressId}/default`, { type });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Sepet işlemleri
export const cartService = {
  // Sepete ürün ekle
  addToCart: async (productData) => {
    try {
      const response = await api.post('/cart', productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api; 