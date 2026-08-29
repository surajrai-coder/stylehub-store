import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import './lamplogin.css';
import LampLogin from './lamplogin';

function App() {
  const defaultCatalog = [
    {
      _id: "def_1",
      name: "Graphic Skull Oversized Tee",
      price: 699,
      category: "Oversized Tees",
      description: "240 GSM heavy combed cotton in drop-shoulder relaxed silhouette.",
      image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
      _id: "def_2",
      name: "Tactical Utility Combat Cargo",
      price: 1199,
      category: "Cargo Pants",
      description: "Heavy twill multi-pocket tactical baggy streetwear cargo.",
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
      _id: "def_3",
      name: "Cyber Neon Heavyweight Hoodie",
      price: 1399,
      category: "Hoodies & Jackets",
      description: "380 GSM brushed thermal fleece streetwear pullover.",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800",
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
      _id: "def_4",
      name: "Royal Velvet Italian Tuxedo Suit",
      price: 2499,
      category: "Coat & Pants",
      description: "Tailored slim-fit luxury tuxedo blazer and matching trousers.",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
      sizes: ["S", "M", "L", "XL", "XXL"]
    }
  ];

  const [products, setProducts] = useState(() => {
    const local = localStorage.getItem('stylehub_local_products');
    return local ? [...defaultCatalog, ...JSON.parse(local)] : defaultCatalog;
  });

  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('stylehub_admin_logged') === 'true' ? 'admin' : 'home');
  const [adminTab, setAdminTab] = useState('analytics');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemSizes, setItemSizes] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [siteVisits, setSiteVisits] = useState(1);

  const wheelSlices = [
    { label: "₹200 OFF", bg: "#f43f5e", discount: 200 },
    { label: "₹50 OFF", bg: "#8b5cf6", discount: 50 },
    { label: "₹150 OFF", bg: "#10b981", discount: 150 },
    { label: "₹300 VIP", bg: "#3b82f6", discount: 300 },
    { label: "₹100 OFF", bg: "#f59e0b", discount: 100 },
    { label: "₹75 OFF", bg: "#ec4899", discount: 75 },
    { label: "₹250 OFF", bg: "#06b6d4", discount: 250 },
    { label: "₹120 OFF", bg: "#6366f1", discount: 120 }
  ];

  const [showLuckySpin, setShowLuckySpin] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [spinReward, setSpinReward] = useState(null);

  // User & Auth States
  const [currentUser, setCurrentUser] = useState(null);
  const [authModal, setAuthModal] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => localStorage.getItem('stylehub_admin_logged') === 'true');

  // Profile Edit Toggle & Form States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Coat & Pants');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const [customerAddress, setCustomerAddress] = useState('');
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentTab, setPaymentTab] = useState('upi');
  const [orderSummary, setOrderSummary] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);
  const [showQrCode, setShowQrCode] = useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  const API_BASE_URL = "https://stylehub-store.onrender.com";
  const UPI_ID = "ksuraj07501@okaxis"; 
  const ACCOUNT_HOLDER = "Suraj Kumar";
  const ADMIN_SECRET = "Suraj6284";
  const SUPPORT_PHONE = "916284319095";
  const SUPPORT_EMAIL = "ksuraj07501@gmail.com";
  const STORE_ADDRESS = "SBLS Nagar, Jalandhar, Punjab";
  const OWNER_NAME = "Suraj Rai";

  const categoryCards = [
    { 
      title: 'Men Designer Suits & Blazers', 
      category: 'Coat & Pants', 
      count: '15+ Suits', 
      tag: 'PREMIUM FIT', 
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700' 
    },
    { 
      title: 'Men Heavy Oversized Tees', 
      category: 'Oversized Tees', 
      count: '24+ Drops', 
      tag: 'BESTSELLER', 
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700' 
    },
    { 
      title: 'Tactical Men Cargos', 
      category: 'Cargo Pants', 
      count: '12+ Fits', 
      tag: 'STREET MATRIX', 
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700' 
    },
    { 
      title: 'Men Winter Pullover & Hoodies', 
      category: 'Hoodies & Jackets', 
      count: '18+ Styles', 
      tag: 'WINTER DROP', 
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=700' 
    }
  ];

  useEffect(() => {
    const checkSessionExpiry = () => {
      const loginTime = localStorage.getItem('stylehub_login_time');
      const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
      if (loginTime && (Date.now() - parseInt(loginTime, 10) > TWO_HOURS_MS)) {
        handleLogout();
        alert("Your session expired after 2 hours. Please sign in again.");
      }
    };

    checkSessionExpiry();
    const interval = setInterval(checkSessionExpiry, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const visits = parseInt(localStorage.getItem('stylehub_site_visits') || '142', 10) + 1;
    localStorage.setItem('stylehub_site_visits', visits.toString());
    setSiteVisits(visits);

    axios.get(`${API_BASE_URL}/api/products`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
        }
      })
      .catch(() => {});

    fetchOrders();
    fetchUsers();

    const savedUser = localStorage.getItem('stylehub_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setCurrentUser(parsed);
      setProfileName(parsed.name || '');
      setProfilePhone(parsed.phone || '');
      setProfileAddress(parsed.address || '');
      setProfileAvatar(parsed.avatar || '');
      if (parsed.address) setCustomerAddress(parsed.address);

      const savedWish = localStorage.getItem(`wishlist_${parsed.email}`);
      if (savedWish) setWishlist(JSON.parse(savedWish));
    }
  }, []);

  const fetchOrders = () => {
    axios.get(`${API_BASE_URL}/api/orders`)
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        const localOrders = JSON.parse(localStorage.getItem('stylehub_local_orders') || '[]');
        setOrders(localOrders);
      });
  };

  const fetchUsers = () => {
    const sessions = JSON.parse(localStorage.getItem('stylehub_user_sessions') || '[]');
    setUsersList(sessions);
  };

  const recordUserLoginInAdmin = (userData) => {
    const sessions = JSON.parse(localStorage.getItem('stylehub_user_sessions') || '[]');
    const existingIndex = sessions.findIndex(u => u.email === userData.email);

    const now = new Date();
    const recordObj = {
      name: userData.name || 'Customer',
      email: userData.email,
      phone: userData.phone || 'N/A',
      avatar: userData.avatar || '',
      lastLogin: `${now.toLocaleDateString()} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: 'Online Now'
    };

    if (existingIndex > -1) {
      sessions[existingIndex] = { ...sessions[existingIndex], ...recordObj };
    } else {
      sessions.unshift(recordObj);
    }

    localStorage.setItem('stylehub_user_sessions', JSON.stringify(sessions));
    setUsersList(sessions);
  };

  const openLuckyWheelModal = () => {
    if (!currentUser) {
      alert("Please Sign In or Create an Account to spin the Lucky Wheel!");
      setAuthModal('login');
      return;
    }

    const todayDate = new Date().toISOString().slice(0, 10);
    const lastSpunDate = localStorage.getItem(`last_spin_${currentUser.email}`);

    if (lastSpunDate === todayDate) {
      alert("You have already used your lucky spin for today! Come back tomorrow for a new prize.");
      return;
    }

    setSpinReward(null);
    setShowLuckySpin(true);
  };

  const triggerAnimatedSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const randomIndex = Math.floor(Math.random() * wheelSlices.length);
    const sliceAngle = 360 / 8;
    const landingOffset = 360 - (randomIndex * sliceAngle) - (sliceAngle / 2);
    const fullRounds = 360 * 7;
    const newTotalRot = wheelRotation + fullRounds + landingOffset;
    setWheelRotation(newTotalRot);

    setTimeout(() => {
      setIsSpinning(false);
      const todayDate = new Date().toISOString().slice(0, 10);
      localStorage.setItem(`last_spin_${currentUser.email}`, todayDate);

      const won = wheelSlices[randomIndex];
      const userPrefix = (currentUser.name.replace(/[^a-zA-Z]/g, '').slice(0, 3) || 'FIT').toUpperCase();
      const uniqueCode = `STYLE-${userPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      localStorage.setItem(`user_coupon_${currentUser.email}`, JSON.stringify({
        code: uniqueCode,
        discount: won.discount,
        ownerEmail: currentUser.email
      }));

      setDiscountAmount(won.discount);
      setAppliedCoupon(uniqueCode);
      setSpinReward(`🎉 CONGRATULATIONS! You won ${won.label}! Exclusive coupon "${uniqueCode}" has been auto-applied.`);
    }, 4600);
  };

  const handleSizeSelect = (productId, size) => {
    setItemSizes({ ...itemSizes, [productId]: size });
  };

  const toggleWishlist = (product) => {
    if (!currentUser) {
      alert("Please Sign In first to save items to your wishlist!");
      setAuthModal('login');
      return;
    }
    const exists = wishlist.some(item => item._id === product._id);
    const updated = exists ? wishlist.filter(item => item._id !== product._id) : [...wishlist, product];
    setWishlist(updated);
    localStorage.setItem(`wishlist_${currentUser.email}`, JSON.stringify(updated));
  };

  const addToCart = (product) => {
    if (!currentUser) {
      alert("Please Sign In or Create an Account to start shopping!");
      setAuthModal('login');
      return;
    }
    const chosenSize = itemSizes[product._id] || 'L';
    setCart([...cart, { ...product, selectedSize: chosenSize }]);
    setIsCartOpen(true);
    if (quickViewProduct) setQuickViewProduct(null);
  };

  const applyCoupon = () => {
    const cleanCode = couponCode.trim().toUpperCase();
    if (!currentUser) {
      alert("Please Sign In to redeem coupons.");
      return;
    }

    const savedUserCoupon = localStorage.getItem(`user_coupon_${currentUser.email}`);
    if (savedUserCoupon) {
      const parsed = JSON.parse(savedUserCoupon);
      if (parsed.code === cleanCode) {
        setDiscountAmount(parsed.discount);
        setAppliedCoupon(parsed.code);
        alert(`Success! Exclusive discount of ₹${parsed.discount} applied.`);
        return;
      }
    }

    if (cleanCode === 'STYLE200') {
      if (rawTotalPrice < 999) {
        alert("Coupon STYLE200 requires a minimum order value of ₹999.");
        return;
      }
      setDiscountAmount(200);
      setAppliedCoupon('STYLE200');
      alert("Success! Flat ₹200 discount applied.");
    } else if (cleanCode === 'FIRST50') {
      setDiscountAmount(50);
      setAppliedCoupon('FIRST50');
      alert("Success! ₹50 discount applied.");
    } else {
      alert("Invalid coupon code. Spin the Lucky Wheel to get your personal code.");
    }
  };

  const removeCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon('');
    setCouponCode('');
  };

  const handleLoginDirect = (credentials) => {
    if (credentials.isGoogle) {
      setCurrentUser(credentials);
      setProfileName(credentials.name);
      setProfilePhone(credentials.phone);
      localStorage.setItem('stylehub_user', JSON.stringify(credentials));
      localStorage.setItem('stylehub_login_time', Date.now().toString());
      recordUserLoginInAdmin(credentials);
      setAuthModal(null);
      return;
    }

    const cleanEmail = credentials.email.toLowerCase().trim();
    const cleanPassword = credentials.password;

    const savedAcc = localStorage.getItem(`account_${cleanEmail}`);
    if (savedAcc) {
      const parsed = JSON.parse(savedAcc);
      if (parsed.password === cleanPassword) {
        setCurrentUser(parsed);
        setProfileName(parsed.name || '');
        setProfilePhone(parsed.phone || '');
        setProfileAddress(parsed.address || '');
        setProfileAvatar(parsed.avatar || '');
        localStorage.setItem('stylehub_user', JSON.stringify(parsed));
        localStorage.setItem('stylehub_login_time', Date.now().toString());
        recordUserLoginInAdmin(parsed);
        setAuthModal(null);
        alert(`Welcome back, ${parsed.name}!`);
        return;
      }
    }

    axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: cleanEmail,
      password: cleanPassword
    })
    .then((res) => {
      alert(`Welcome back, ${res.data.user.name}!`);
      setCurrentUser(res.data.user);
      setProfileName(res.data.user.name || '');
      setProfilePhone(res.data.user.phone || '');
      localStorage.setItem('stylehub_user', JSON.stringify(res.data.user));
      localStorage.setItem('stylehub_login_time', Date.now().toString());
      recordUserLoginInAdmin(res.data.user);
      setAuthModal(null);
    })
    .catch(() => {
      const newUser = { name: cleanEmail.split('@')[0], email: cleanEmail, phone: 'N/A' };
      setCurrentUser(newUser);
      setProfileName(newUser.name);
      localStorage.setItem('stylehub_user', JSON.stringify(newUser));
      localStorage.setItem('stylehub_login_time', Date.now().toString());
      recordUserLoginInAdmin(newUser);
      setAuthModal(null);
    });
  };

  const handleRegisterDirect = (formData) => {
    const cleanEmail = formData.email.toLowerCase().trim();
    const cleanPhone = formData.phone.trim();

    const newUser = {
      name: formData.name,
      email: cleanEmail,
      phone: cleanPhone,
      createdAt: new Date().toLocaleDateString()
    };

    setCurrentUser(newUser);
    setProfileName(newUser.name);
    setProfilePhone(newUser.phone);
    localStorage.setItem('stylehub_user', JSON.stringify(newUser));
    localStorage.setItem('stylehub_login_time', Date.now().toString());
    localStorage.setItem(`account_${cleanEmail}`, JSON.stringify({ ...newUser, password: formData.password }));
    recordUserLoginInAdmin(newUser);
    setAuthModal(null);
    alert(`Account created successfully! Welcome to StyleHub, ${formData.name}.`);

    axios.post(`${API_BASE_URL}/api/auth/register`, {
      name: formData.name,
      email: cleanEmail,
      phone: cleanPhone,
      password: formData.password
    }).catch(() => {});
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      name: profileName,
      phone: profilePhone,
      address: profileAddress,
      avatar: profileAvatar
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('stylehub_user', JSON.stringify(updatedUser));
    localStorage.setItem(`account_${currentUser.email}`, JSON.stringify(updatedUser));
    if (profileAddress) setCustomerAddress(profileAddress);
    recordUserLoginInAdmin(updatedUser);
    setIsEditingProfile(false);
    alert("Profile changes saved successfully!");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('stylehub_user');
    localStorage.removeItem('stylehub_login_time');
    setCart([]);
    setWishlist([]);
    setCurrentPage('home');
    alert("Logged out successfully.");
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('stylehub_admin_logged');
    setCurrentPage('home');
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name || !price || !category) {
      alert("Product Title, Price, and Category are required!");
      return;
    }
    const finalImage = image || "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800";
    const newProductObj = {
      _id: `prod_${Date.now()}`,
      name,
      price: Number(price),
      category,
      description,
      image: finalImage,
      sizes: ["S", "M", "L", "XL", "XXL"]
    };

    const localAdded = JSON.parse(localStorage.getItem('stylehub_local_products') || '[]');
    localAdded.push(newProductObj);
    localStorage.setItem('stylehub_local_products', JSON.stringify(localAdded));
    setProducts([...defaultCatalog, ...localAdded]);
    alert("Outfit successfully added to catalog!");
    setName('');
    setPrice('');
    setDescription('');
    setImage('');

    axios.post(`${API_BASE_URL}/api/products`, newProductObj).catch(() => {});
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this outfit?")) {
      const localAdded = JSON.parse(localStorage.getItem('stylehub_local_products') || '[]');
      const updated = localAdded.filter(p => p._id !== id);
      localStorage.setItem('stylehub_local_products', JSON.stringify(updated));
      setProducts([...defaultCatalog, ...updated]);
      axios.delete(`${API_BASE_URL}/api/products/${id}`).catch(() => {});
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    const localOrders = JSON.parse(localStorage.getItem('stylehub_local_orders') || '[]');
    const updated = localOrders.map(o => o._id === orderId ? { ...o, status: newStatus } : o);
    localStorage.setItem('stylehub_local_orders', JSON.stringify(updated));
    fetchOrders();
    axios.put(`${API_BASE_URL}/api/orders/${orderId}`, { status: newStatus }).catch(() => {});
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Delete this order record permanently?")) {
      const localOrders = JSON.parse(localStorage.getItem('stylehub_local_orders') || '[]');
      const updated = localOrders.filter(o => o._id !== orderId);
      localStorage.setItem('stylehub_local_orders', JSON.stringify(updated));
      fetchOrders();
      axios.delete(`${API_BASE_URL}/api/orders/${orderId}`).catch(() => {});
    }
  };

  const handleDeleteUserSession = (email) => {
    if (window.confirm(`Remove user session "${email}" permanently?`)) {
      const sessions = JSON.parse(localStorage.getItem('stylehub_user_sessions') || '[]');
      const updated = sessions.filter(u => u.email !== email);
      localStorage.setItem('stylehub_user_sessions', JSON.stringify(updated));
      localStorage.removeItem(`account_${email}`);
      if (currentUser && currentUser.email === email) {
        handleLogout();
      }
      setUsersList(updated);
    }
  };

  const removeFromCart = (index) => setCart(cart.filter((_, i) => i !== index));
  
  const rawTotalPrice = cart.reduce((total, item) => total + item.price, 0);
  const finalPayablePrice = Math.max(0, rawTotalPrice - discountAmount);

  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(ACCOUNT_HOLDER)}&am=${finalPayablePrice}&cu=INR&tn=${encodeURIComponent('StyleHub Order')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl)}`;

  const initiatePaymentGateway = (e) => {
    e.preventDefault();
    if (!customerAddress) {
      alert("Delivery address with postal pincode is required.");
      return;
    }
    setOrderSummary({
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      customerEmail: currentUser.email,
      customerAddress,
      items: cart,
      rawAmount: rawTotalPrice,
      discount: discountAmount,
      totalAmount: finalPayablePrice
    });
    setShowQrCode(false);
    setIsCartOpen(false);
    setShowPaymentGateway(true);
  };

  const sendWhatsAppNotification = (orderData, orderId) => {
    const itemsList = orderData.items.map(it => `• ${it.name} (Size: ${it.selectedSize}) - ₹${it.price}`).join('%0A');
    const message = `🛍️ *NEW ORDER CONFIRMED!*%0A%0A*Order ID:* ${orderId}%0A*Customer Name:* ${orderData.customerName}%0A*Phone:* ${orderData.customerPhone}%0A*Delivery Address:* ${orderData.customerAddress}%0A%0A*Items Ordered:*%0A${itemsList}%0A%0A*Total Paid:* ₹${orderData.totalAmount}%0A*Payment Method:* ${orderData.paymentMethod}`;
    window.open(`https://wa.me/${SUPPORT_PHONE}?text=${message}`, '_blank');
  };

  const finalizeOrder = (methodUsed) => {
    setIsProcessingPay(true);
    setTimeout(() => {
      const orderId = `ORD-${Date.now()}`;
      const orderData = {
        ...orderSummary,
        _id: orderId,
        paymentMethod: methodUsed,
        utrNumber: `AURA-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'Processing',
        createdAt: new Date()
      };

      setIsProcessingPay(false);
      const localOrders = JSON.parse(localStorage.getItem('stylehub_local_orders') || '[]');
      localOrders.unshift(orderData);
      localStorage.setItem('stylehub_local_orders', JSON.stringify(localOrders));

      alert("Payment Confirmed! Your order has been placed.");
      sendWhatsAppNotification(orderData, orderId);
      setCompletedOrder(orderData);
      setCart([]);
      setShowPaymentGateway(false);
      setCustomerAddress('');
      setDiscountAmount(0);
      setAppliedCoupon('');
      fetchOrders();

      axios.post(`${API_BASE_URL}/api/orders`, orderData).catch(() => {});
    }, 800);
  };

  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  const categoriesList = ['All', 'Coat & Pants', 'Oversized Tees', 'Cargo Pants', 'Hoodies & Jackets'];

  const userOrders = currentUser 
    ? orders.filter(o => o.customerPhone === currentUser.phone || o.customerEmail === currentUser.email)
    : [];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || (p.category && p.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase());
    const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', background: '#050811' }}>
      
      <div className="bg-ambient-lights">
        <div className="glow-sphere-1"></div>
        <div className="glow-sphere-2"></div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Top Marquee */}
        <div style={{ background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)', padding: '8px 0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(236,72,153,0.3)' }}>
          <div className="marquee-track">
            <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '11px', letterSpacing: '2px', display: 'inline-flex', gap: '30px', marginRight: '30px' }}>
              <span>SPIN DAILY LUCKY WHEEL FOR EXCLUSIVE DISCOUNTS</span>
              <span>MEN LUXURY SUITS & 240+ GSM COMBED COTTON OVERSIZED STREETWEAR</span>
              <span>FREE PAN-INDIA EXPRESS SHIPPING</span>
              <span>LIMITED EDITION 2026 ROYAL DROP LIVE</span>
            </div>
          </div>
        </div>

        {/* Header with Royal Golden "SH STYLE HUB" Logo */}
        <header style={{ background: 'rgba(10, 15, 30, 0.96)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255, 255, 255, 0.16)', position: 'sticky', top: 0, zIndex: 100, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Logo Brand Image */}
          <div className="header-brand-box" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => { setCurrentPage('home'); setSelectedCategory('All'); setSearchQuery(''); }}>
            <div className="brand-logo-emblem">
              <img src="/logo.png" alt="Style Hub Logo" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200'; }} />
            </div>
            <div>
              <div className="header-brand-title" style={{ fontSize: '20px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>
                MY STYLE <span style={{ color: '#f43f5e' }}>HUB</span>
              </div>
              <div style={{ fontSize: '9px', color: '#cbd5e1', fontWeight: '800', letterSpacing: '2px' }}>
                LUXURY MEN & STREETWEAR STUDIO
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="header-search-box" style={{ flex: '1', maxWidth: '340px', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search suits, tees, cargos, prints..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); if (currentPage !== 'shop' && currentPage !== 'home') setCurrentPage('shop'); }}
              style={{ width: '100%', padding: '11px 16px 11px 38px', borderRadius: '30px', border: '1.5px solid rgba(236, 72, 153, 0.5)', fontSize: '13px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', outline: 'none', backdropFilter: 'blur(10px)' }}
            />
            <span style={{ position: 'absolute', left: '14px', top: '11px', fontSize: '13px', color: '#f43f5e' }}>🔍</span>
            {searchQuery && (
              <span onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '14px', top: '11px', fontSize: '11px', cursor: 'pointer', color: '#cbd5e1', fontWeight: 'bold' }}>✕</span>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="desktop-navbar-nav" style={{ display: 'flex', gap: '18px', fontSize: '13px', fontWeight: '800', color: '#e2e8f0', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer', color: currentPage === 'home' ? '#f43f5e' : 'inherit' }} onClick={() => { setCurrentPage('home'); setSelectedCategory('All'); }}>Home</span>
            <span style={{ cursor: 'pointer', color: currentPage === 'shop' ? '#f43f5e' : 'inherit' }} onClick={() => { setCurrentPage('shop'); setSelectedCategory('All'); }}>Shop All</span>
            <span style={{ cursor: 'pointer', color: currentPage === 'categories' ? '#f43f5e' : 'inherit' }} onClick={() => setCurrentPage('categories')}>Collections</span>
            
            <button 
              onClick={openLuckyWheelModal}
              style={{ background: 'linear-gradient(135deg, #facc15, #f59e0b)', color: '#0f172a', border: 'none', padding: '7px 14px', borderRadius: '20px', fontWeight: '900', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 4px 15px rgba(245,158,11,0.4)' }}
            >
              🎡 Daily Lucky Wheel
            </button>

            {currentUser && (
              <>
                <span style={{ cursor: 'pointer', color: currentPage === 'myOrders' ? '#f43f5e' : 'inherit' }} onClick={() => setCurrentPage('myOrders')}>Orders ({userOrders.length})</span>
                <span style={{ cursor: 'pointer', color: currentPage === 'profile' ? '#f43f5e' : 'inherit' }} onClick={() => { setCurrentPage('profile'); setIsEditingProfile(false); }}>My Profile</span>
              </>
            )}
          </nav>

          {/* Desktop Auth & Actions */}
          <div className="desktop-auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              onClick={() => setCurrentPage('wishlist')} 
              style={{ cursor: 'pointer', position: 'relative', width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
            >
              ❤️
              {wishlist.length > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#f43f5e', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {wishlist.length}
                </span>
              )}
            </div>

            <button 
              onClick={() => {
                if (isAdminLoggedIn) {
                  setCurrentPage('admin');
                } else {
                  setAuthModal('adminLogin');
                }
              }}
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '11px', color: '#fff' }}
            >
              🔒 Admin
            </button>

            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(236, 72, 153, 0.25)', border: '1px solid rgba(236, 72, 153, 0.5)', padding: '4px 12px', borderRadius: '24px' }}>
                <div onClick={() => { setCurrentPage('profile'); setIsEditingProfile(false); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Profile" style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '14px' }}>👤</span>
                  )}
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#fbcfe8' }}>{currentUser.name.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer', fontSize: '10px', fontWeight: '800' }}>Logout</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setAuthModal('login')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '11px' }}>Sign In</button>
                <button onClick={() => setAuthModal('register')} className="vibrant-btn" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '11px' }}>Sign Up</button>
              </div>
            )}
          </div>

          {/* Quick Cart Trigger */}
          <div 
            onClick={() => {
              if (!currentUser) {
                alert("Please Sign In first.");
                setAuthModal('login');
              } else {
                setIsCartOpen(true);
              }
            }}
            style={{ position: 'relative', cursor: 'pointer', background: 'linear-gradient(135deg, #f43f5e, #8b5cf6)', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(244, 63, 94, 0.5)' }}
          >
            🛍️
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#facc15', color: '#0f172a', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>
              {cart.length}
            </span>
          </div>
        </header>

        {/* --- MY ACCOUNT PROFILE (ORIGINAL HEADING + EDIT/SAVE/CANCEL CONTROLS) --- */}
        {currentPage === 'profile' && currentUser && (
          <main style={{ maxWidth: '720px', margin: '30px auto', padding: '0 16px 80px 16px' }}>
            <div className="hyper-card" style={{ padding: '34px 26px', background: 'rgba(15, 23, 42, 0.95)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 className="section-headline-glow" style={{ fontSize: '26px', margin: 0 }}>My Account Profile</h2>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: '4px 0 0 0' }}>Manage your personal details, saved address, and avatar</p>
                </div>
                <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '12px' }}>
                  🚪 Logout
                </button>
              </div>

              {!isEditingProfile ? (
                /* Profile Normal View */
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
                    <div style={{ width: '74px', height: '74px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #f43f5e', background: '#0a0f1d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '30px' }}>👤</span>
                      )}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', margin: 0 }}>{currentUser.name}</h3>
                      <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '4px' }}>{currentUser.email}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Phone Number:</span>
                      <div style={{ color: '#fff', fontWeight: '700', marginTop: '2px' }}>{currentUser.phone || 'Not Provided'}</div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Saved Delivery Address:</span>
                      <div style={{ color: '#fff', fontWeight: '700', marginTop: '2px' }}>{currentUser.address || 'No address saved yet.'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button onClick={() => setIsEditingProfile(true)} className="vibrant-btn" style={{ flex: 1, padding: '13px', borderRadius: '12px', fontSize: '14px' }}>
                      ✏️ Edit Your Details
                    </button>
                    <button onClick={() => setCurrentPage('home')} style={{ padding: '13px 20px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '12px', cursor: 'pointer', fontWeight: '800' }}>
                      Back to Store
                    </button>
                  </div>
                </div>
              ) : (
                /* Profile Edit Mode with Save & Cancel */
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  
                  {/* Photo Upload */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ position: 'relative', width: '74px', height: '74px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #f43f5e', background: '#0a0f1d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {profileAvatar ? (
                        <img src={profileAvatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '30px' }}>👤</span>
                      )}
                    </div>
                    <div>
                      <label style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f43f5e, #8b5cf6)', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>
                        📸 Upload Profile Photo
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                      </label>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>Recommended: Square PNG or JPG (Max 2MB)</div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Full Name</label>
                    <input 
                      type="text" 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)} 
                      required 
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.18)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '13px' }} 
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Registered Email (Locked)</label>
                    <input 
                      type="email" 
                      value={currentUser.email} 
                      disabled 
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#94a3b8', fontSize: '13px', cursor: 'not-allowed' }} 
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Phone Number</label>
                    <input 
                      type="tel" 
                      value={profilePhone} 
                      onChange={(e) => setProfilePhone(e.target.value)} 
                      required 
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.18)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '13px' }} 
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Saved Delivery Address</label>
                    <textarea 
                      rows="3" 
                      value={profileAddress} 
                      placeholder="Enter complete shipping address with Postal Pincode..."
                      onChange={(e) => setProfileAddress(e.target.value)} 
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.18)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '13px' }} 
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" className="vibrant-btn" style={{ flex: 1, padding: '13px', borderRadius: '12px', fontSize: '14px' }}>
                      💾 Save Profile Changes
                    </button>
                    <button type="button" onClick={() => setIsEditingProfile(false)} style={{ padding: '13px 20px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '12px', cursor: 'pointer', fontWeight: '800' }}>
                      Cancel
                    </button>
                  </div>

                </form>
              )}

            </div>
          </main>
        )}

        {/* Storefront Home & Catalog Content */}
        {(currentPage === 'home' || currentPage === 'shop') && (
          <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 60px 20px' }}>
            
            {/* Hero Section with Moving Color "ROYAL TUXEDO FIT" */}
            {currentPage === 'home' && !searchQuery && (
              <section className="hyper-card hero-banner-grid" style={{ margin: '26px 0 50px 0', padding: '40px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'center', background: 'rgba(12, 18, 34, 0.92)' }}>
                <div>
                  <div style={{ background: 'rgba(244,63,94,0.18)', border: '1px solid rgba(244,63,94,0.4)', padding: '6px 16px', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '13px' }}>🔥</span>
                    <span style={{ color: '#fff', fontWeight: '900', fontSize: '11px', letterSpacing: '1px' }}>ROYAL MEN SUITS & AUTUMN DROP LIVE</span>
                  </div>

                  <h1 style={{ fontSize: '46px', fontWeight: '900', margin: '0 0 14px 0', letterSpacing: '-1.2px', lineHeight: '1.1', color: '#ffffff' }}>
                    UNLEASH YOUR <br/>
                    <span className="animated-tuxedo-fit">
                      ROYAL TUXEDO FIT
                    </span>
                  </h1>

                  <p style={{ fontSize: '15px', color: '#cbd5e1', margin: '0 0 24px 0', lineHeight: '1.6', fontWeight: '500', maxWidth: '480px' }}>
                    Italian tailored blazers, luxury two-piece tuxedo suits, heavy 240+ GSM combed cotton streetwear, and tactical multi-pocket cargos.
                  </p>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => { setSelectedCategory('Coat & Pants'); setCurrentPage('shop'); }} 
                      className="vibrant-btn"
                      style={{ padding: '13px 28px', borderRadius: '14px', fontSize: '14px' }}
                    >
                      Explore Suits & Coats 👔 →
                    </button>
                    <button 
                      onClick={() => { setSelectedCategory('Oversized Tees'); setCurrentPage('shop'); }} 
                      style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', padding: '13px 22px', borderRadius: '14px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
                    >
                      Streetwear Drops 👕
                    </button>
                  </div>
                </div>

                {/* Animated Floating Suit Showcase */}
                <div className="hero-suit-floating-box">
                  <img 
                    src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800" 
                    alt="Men Luxury Coat Pant Suit" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', bottom: '14px', left: '14px', right: '14px', background: 'rgba(10, 15, 30, 0.95)', backdropFilter: 'blur(12px)', padding: '10px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#f43f5e', fontWeight: '800' }}>FEATURED ROYAL FIT</div>
                      <div style={{ fontSize: '14px', fontWeight: '900', color: '#fff' }}>Velvet Italian Tuxedo Suit</div>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: '900', color: '#4ade80' }}>₹2,499</span>
                  </div>
                </div>
              </section>
            )}

            {/* Curated Categories */}
            {currentPage === 'home' && !searchQuery && (
              <section style={{ marginBottom: '50px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
                  <div>
                    <span className="section-tagline-vivid">COLLECTIONS MATRIX</span>
                    <h2 className="section-headline-glow" style={{ margin: '4px 0 0 0' }}>Explore By Category</h2>
                  </div>
                  <span onClick={() => setCurrentPage('categories')} style={{ fontSize: '13px', fontWeight: '800', color: '#f43f5e', cursor: 'pointer', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', padding: '6px 14px', borderRadius: '10px' }}>
                    View All →
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  {categoryCards.map((c, i) => (
                    <div 
                      key={i} 
                      onClick={() => { setSelectedCategory(c.category); setCurrentPage('shop'); }}
                      className="hyper-card"
                      style={{ height: '300px' }}
                    >
                      <img src={c.image} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(6,10,22,0.96) 90%)' }}></div>
                      
                      <div style={{ position: 'absolute', top: '14px', left: '14px', fontWeight: '800', fontSize: '10px', color: '#fff', background: 'linear-gradient(135deg, #f43f5e, #8b5cf6)', padding: '5px 12px', borderRadius: '8px' }}>
                        {c.tag}
                      </div>

                      <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: '#ffffff', fontSize: '17px', fontWeight: '900' }}>{c.title}</div>
                          <div style={{ color: '#38bdf8', fontSize: '12px', fontWeight: '800', marginTop: '2px' }}>{c.count}</div>
                        </div>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px' }}>
                          ↗
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Catalog Grid */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span className="section-tagline-vivid">
                    {searchQuery ? `SEARCH RESULTS` : 'FRESH STREETWEAR & SUITS'}
                  </span>
                  <h2 className="section-headline-glow" style={{ margin: '4px 0 0 0' }}>
                    {searchQuery ? `"${searchQuery}" (${filteredProducts.length})` : selectedCategory === 'All' ? 'All Vibrant Drops' : selectedCategory}
                  </h2>
                </div>
                {(selectedCategory !== 'All' || searchQuery) && (
                  <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '12px' }}>
                    Reset Filters ✕
                  </button>
                )}
              </div>

              {/* Filter Pills */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setSearchQuery(''); }}
                    className={`filter-pill-btn ${selectedCategory === cat ? 'active' : 'inactive'}`}
                  >
                    {cat === 'All' ? '✨ All' : cat === 'Coat & Pants' ? '👔 Suits & Coats' : cat === 'Oversized Tees' ? '👕 Oversized Tees' : cat === 'Cargo Pants' ? '👖 Cargos' : '🧥 Outerwear'}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#cbd5e1' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>✦</div>
                  <p style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>Loading Colorful Drops...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.04)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.2)', color: '#cbd5e1' }}>
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>👕</div>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#fff' }}>No outfits found in this category.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                  {filteredProducts.map((item) => {
                    const currentSize = itemSizes[item._id] || 'L';
                    const originalPrice = Math.round(item.price * 1.6);
                    const isWishlisted = wishlist.some(w => w._id === item._id);

                    return (
                      <div key={item._id} className="hyper-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        
                        <div style={{ position: 'relative', overflow: 'hidden', height: '300px' }}>
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          
                          <span style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(10, 15, 30, 0.95)', backdropFilter: 'blur(8px)', color: '#38bdf8', fontSize: '10px', padding: '5px 12px', borderRadius: '8px', fontWeight: '800', border: '1px solid rgba(255,255,255,0.15)' }}>
                            {item.category || 'Men Fits'}
                          </span>

                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }} 
                            style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(10, 15, 30, 0.95)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px' }}
                          >
                            {isWishlisted ? '❤️' : '🤍'}
                          </button>

                          <button 
                            onClick={() => setQuickViewProduct(item)} 
                            style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(10, 15, 30, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '800', color: '#fff', cursor: 'pointer' }}
                          >
                            👁️ View
                          </button>
                        </div>

                        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                          <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '800', color: '#fff' }}>{item.name}</h4>
                            
                            <div style={{ fontSize: '10px', color: '#f43f5e', fontWeight: '800', marginBottom: '8px' }}>
                              ✦ Premium Fabric & Tailored Construction
                            </div>

                            <p style={{ color: '#cbd5e1', fontSize: '12px', margin: '0 0 12px 0', lineHeight: '1.5' }}>{item.description || 'Luxury silhouette outfit for men.'}</p>
                            
                            <div style={{ marginBottom: '14px' }}>
                              <span style={{ fontSize: '10px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase' }}>Size:</span>
                              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                                  <button
                                    key={sz}
                                    onClick={() => handleSizeSelect(item._id, sz)}
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '8px',
                                      border: currentSize === sz ? '2px solid #f43f5e' : '1px solid rgba(255,255,255,0.15)',
                                      background: currentSize === sz ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255,255,255,0.06)',
                                      color: '#fff',
                                      fontSize: '11px',
                                      fontWeight: '800',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {sz}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px' }}>
                            <div>
                              <div style={{ fontSize: '19px', fontWeight: '900', color: '#4ade80' }}>₹{item.price}</div>
                              <div style={{ fontSize: '11px', color: '#cbd5e1', textDecoration: 'line-through', fontWeight: '700' }}>₹{originalPrice}</div>
                            </div>
                            
                            <button 
                              onClick={() => addToCart(item)}
                              className="vibrant-btn"
                              style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '12px' }}
                            >
                              Add 🛍️
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

          </main>
        )}

        {/* Casino Lucky Wheel Modal */}
        {showLuckySpin && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200, padding: '16px' }}>
            <div className="hyper-card" style={{ width: '100%', maxWidth: '420px', padding: '30px 16px', textAlign: 'center', background: '#0a0f1d' }}>
              
              <h3 className="section-headline-glow" style={{ fontSize: '22px', margin: '0 0 4px 0' }}>🎡 Daily Lucky Spin Wheel</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '18px' }}>
                Signed in as <b style={{ color: '#38bdf8' }}>{currentUser?.name}</b> (1 Spin / Day)
              </p>

              <div className="wheel-outer-container">
                <div className="wheel-top-pointer"></div>
                
                <div className="wheel-golden-rim">
                  <svg 
                    viewBox="0 0 300 300" 
                    className="wheel-svg-disc"
                    style={{ transform: `rotate(${wheelRotation}deg)` }}
                  >
                    {wheelSlices.map((slice, i) => {
                      const angle = 360 / 8;
                      const startAngle = i * angle;
                      const endAngle = startAngle + angle;
                      const startRad = (startAngle - 90) * Math.PI / 180;
                      const endRad = (endAngle - 90) * Math.PI / 180;
                      const x1 = 150 + 150 * Math.cos(startRad);
                      const y1 = 150 + 150 * Math.sin(startRad);
                      const x2 = 150 + 150 * Math.cos(endRad);
                      const y2 = 150 + 150 * Math.sin(endRad);
                      const textAngle = startAngle + angle / 2;

                      return (
                        <g key={i}>
                          <path 
                            d={`M150,150 L${x1},${y1} A150,150 0 0,1 ${x2},${y2} Z`} 
                            fill={slice.bg} 
                            stroke="#ffffff" 
                            strokeWidth="2"
                          />
                          <text 
                            x="150" 
                            y="48" 
                            fill="#ffffff" 
                            fontSize="13" 
                            fontWeight="900" 
                            letterSpacing="0.5"
                            textAnchor="middle" 
                            transform={`rotate(${textAngle}, 150, 150)`}
                            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                          >
                            {slice.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div 
                  className="wheel-center-button"
                  onClick={!isSpinning && !spinReward ? triggerAnimatedSpin : undefined}
                >
                  {isSpinning ? '...' : 'SPIN'}
                </div>
              </div>

              {spinReward ? (
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#4ade80', padding: '12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', marginBottom: '14px' }}>
                  {spinReward}
                </div>
              ) : (
                <button 
                  onClick={triggerAnimatedSpin} 
                  disabled={isSpinning}
                  className="vibrant-btn" 
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '14px', letterSpacing: '1px' }}
                >
                  {isSpinning ? '🎡 SPINNING...' : '🎯 TAP TO SPIN'}
                </button>
              )}

              <button onClick={() => setShowLuckySpin(false)} style={{ marginTop: '14px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Close ✕</button>
            </div>
          </div>
        )}

        {/* Wishlist View */}
        {currentPage === 'wishlist' && (
          <main style={{ maxWidth: '1260px', margin: '20px auto', padding: '0 16px 60px 16px' }}>
            <h2 className="section-headline-glow" style={{ marginBottom: '20px' }}>Saved Wishlist ({wishlist.length})</h2>
            {wishlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', color: '#cbd5e1' }}>
                <p>Your wishlist is currently empty.</p>
                <button onClick={() => setCurrentPage('shop')} className="vibrant-btn" style={{ marginTop: '12px', padding: '10px 20px', borderRadius: '10px' }}>Explore Catalog</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {wishlist.map((item) => (
                  <div key={item._id} className="hyper-card" style={{ padding: '16px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '14px' }} />
                    <h4 style={{ margin: '10px 0 4px 0', fontSize: '15px', fontWeight: '800', color: '#fff' }}>{item.name}</h4>
                    <div style={{ fontSize: '17px', fontWeight: '900', color: '#4ade80', marginBottom: '10px' }}>₹{item.price}</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => addToCart(item)} className="vibrant-btn" style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '12px' }}>Move to Bag 🛍️</button>
                      <button onClick={() => toggleWishlist(item)} style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.25)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        )}

        {/* My Orders View */}
        {currentPage === 'myOrders' && currentUser && (
          <main style={{ maxWidth: '860px', margin: '20px auto', padding: '0 16px 60px 16px' }}>
            <h2 className="section-headline-glow" style={{ marginBottom: '20px' }}>My Orders History</h2>
            {userOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', color: '#cbd5e1' }}>
                <p>No orders placed yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {userOrders.map((ord) => (
                  <div key={ord._id} className="hyper-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Order ID: <b style={{ color: '#fff' }}>{ord._id}</b></div>
                        <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Date: {new Date(ord.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ background: ord.status === 'Delivered' ? 'rgba(34, 197, 94, 0.25)' : ord.status === 'Cancelled' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(234, 179, 8, 0.25)', color: ord.status === 'Delivered' ? '#4ade80' : ord.status === 'Cancelled' ? '#ef4444' : '#facc15', border: '1px solid currentColor', padding: '4px 12px', borderRadius: '20px', fontWeight: '800', fontSize: '11px' }}>
                        ● {ord.status || 'Processing'}
                      </div>
                    </div>

                    <div>
                      {ord.items && ord.items.map((it, idx) => (
                        <div key={idx} style={{ fontSize: '13px', margin: '4px 0', color: '#e2e8f0' }}>• {it.name} ({it.selectedSize}) - ₹{it.price}</div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                      <div style={{ fontSize: '15px', fontWeight: '900', color: '#fff' }}>Paid: <span style={{ color: '#4ade80' }}>₹{ord.totalAmount}</span></div>
                      <button onClick={() => setCompletedOrder(ord)} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
                        🧾 Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        )}

        {/* Collections View */}
        {currentPage === 'categories' && (
          <main style={{ maxWidth: '1260px', margin: '20px auto', padding: '0 16px 60px 16px' }}>
            <h2 className="section-headline-glow" style={{ marginBottom: '20px' }}>All Streetwear & Suit Collections</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {categoryCards.map((c, i) => (
                <div key={i} onClick={() => { setSelectedCategory(c.category); setCurrentPage('shop'); }} className="hyper-card" style={{ height: '300px' }}>
                  <img src={c.image} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, transparent 30%, rgba(6,10,22,0.96) 100%)' }}></div>
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#fff', fontSize: '18px', fontWeight: '900' }}>{c.title}</div>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>↗</div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* Master Admin Dashboard */}
        {currentPage === 'admin' && isAdminLoggedIn && (
          <div style={{ maxWidth: '1280px', margin: '20px auto', padding: '0 16px 60px 16px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.18)', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px', background: 'rgba(10, 16, 32, 0.96)', padding: '18px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div>
                <h2 className="section-headline-glow" style={{ fontSize: '26px', margin: 0, color: '#ffffff' }}>
                  ⚡ Master Control Dashboard
                </h2>
                <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '700', marginTop: '4px' }}>
                  Realtime Store Control & Analytics
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => setAdminTab('analytics')} style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '800', background: adminTab === 'analytics' ? 'linear-gradient(135deg, #f43f5e, #8b5cf6)' : 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '12px' }}>📊 Analytics</button>
                <button onClick={() => setAdminTab('orders')} style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '800', background: adminTab === 'orders' ? 'linear-gradient(135deg, #f43f5e, #8b5cf6)' : 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '12px' }}>📦 Orders ({orders.length})</button>
                <button onClick={() => setAdminTab('users')} style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '800', background: adminTab === 'users' ? 'linear-gradient(135deg, #f43f5e, #8b5cf6)' : 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '12px' }}>👥 User Sessions ({usersList.length})</button>
                <button onClick={() => setAdminTab('products')} style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '800', background: adminTab === 'products' ? 'linear-gradient(135deg, #f43f5e, #8b5cf6)' : 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '12px' }}>👕 Catalog ({products.length})</button>
                <button onClick={handleAdminLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '12px' }}>Exit Admin</button>
              </div>
            </div>

            {/* TAB 1: ANALYTICS */}
            {adminTab === 'analytics' && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                  <div className="hyper-card" style={{ padding: '18px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#cbd5e1' }}>REVENUE</div>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: '#4ade80', marginTop: '4px' }}>₹{totalRevenue}</div>
                  </div>

                  <div className="hyper-card" style={{ padding: '18px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#cbd5e1' }}>SITE VISITS</div>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: '#38bdf8', marginTop: '4px' }}>{siteVisits}</div>
                  </div>

                  <div className="hyper-card" style={{ padding: '18px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#cbd5e1' }}>ACTIVE SESSIONS</div>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: '#facc15', marginTop: '4px' }}>{usersList.length}</div>
                  </div>

                  <div className="hyper-card" style={{ padding: '18px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#cbd5e1' }}>ORDERS</div>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: '#ec4899', marginTop: '4px' }}>{totalOrdersCount}</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LIVE USER LOGIN RECORDS */}
            {adminTab === 'users' && (
              <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                <h3 className="section-headline-glow" style={{ fontSize: '20px', margin: '0 0 12px 0' }}>Live Logged-In User Sessions ({usersList.length})</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'rgba(10, 16, 32, 0.96)', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '10px', color: '#fff' }}>User</th>
                      <th style={{ padding: '10px', color: '#fff' }}>Email Address</th>
                      <th style={{ padding: '10px', color: '#fff' }}>Phone</th>
                      <th style={{ padding: '10px', color: '#fff' }}>Last Active Time</th>
                      <th style={{ padding: '10px', color: '#fff' }}>Status</th>
                      <th style={{ padding: '10px', color: '#fff' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#cbd5e1' }}>No active user logins recorded yet.</td>
                      </tr>
                    ) : (
                      usersList.map((u, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                          <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {u.avatar ? (
                              <img src={u.avatar} alt="Avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                              <span>👤</span>
                            )}
                            <b style={{ color: '#fff' }}>{u.name}</b>
                          </td>
                          <td style={{ padding: '10px', color: '#38bdf8' }}>{u.email}</td>
                          <td style={{ padding: '10px', color: '#cbd5e1' }}>{u.phone || 'N/A'}</td>
                          <td style={{ padding: '10px', color: '#facc15', fontSize: '12px' }}>{u.lastLogin || 'Just Now'}</td>
                          <td style={{ padding: '10px' }}>
                            <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                              ● {u.status || 'Active'}
                            </span>
                          </td>
                          <td style={{ padding: '10px' }}>
                            <button onClick={() => handleDeleteUserSession(u.email)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 3: ORDERS */}
            {adminTab === 'orders' && (
              <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                <h3 className="section-headline-glow" style={{ fontSize: '20px', margin: '0 0 12px 0' }}>Customer Orders ({orders.length})</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'rgba(10, 16, 32, 0.96)', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '10px' }}>Customer</th>
                      <th style={{ padding: '10px' }}>Items</th>
                      <th style={{ padding: '10px' }}>Total</th>
                      <th style={{ padding: '10px' }}>Status</th>
                      <th style={{ padding: '10px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <td style={{ padding: '10px' }}><b>{o.customerName}</b><br/>{o.customerPhone}</td>
                        <td style={{ padding: '10px' }}>{o.items && o.items.map((it, idx) => (<div key={idx}>• {it.name}</div>))}</td>
                        <td style={{ padding: '10px', color: '#4ade80', fontWeight: 'bold' }}>₹{o.totalAmount}</td>
                        <td style={{ padding: '10px' }}>
                          <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)} style={{ padding: '6px', background: '#0f172a', color: '#fff', border: '1px solid #f43f5e', borderRadius: '6px' }}>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <button onClick={() => handleDeleteOrder(o._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 4: PRODUCTS */}
            {adminTab === 'products' && (
              <div style={{ marginTop: '20px' }}>
                <form onSubmit={handleAddProduct} className="hyper-card" style={{ padding: '20px', marginBottom: '20px' }}>
                  <h3 className="section-headline-glow" style={{ fontSize: '20px', margin: '0 0 14px 0' }}>Add New Outfit</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <input type="text" placeholder="Title *" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff' }} />
                    <input type="number" placeholder="Price (₹) *" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff' }} />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #f43f5e', background: 'rgba(0,0,0,0.4)', color: '#fff' }}>
                      <option value="Coat & Pants">Coat & Pants</option>
                      <option value="Oversized Tees">Oversized Tees</option>
                      <option value="Cargo Pants">Cargo Pants</option>
                      <option value="Hoodies & Jackets">Hoodies & Jackets</option>
                    </select>
                    <input type="url" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff' }} />
                  </div>
                  <button type="submit" className="vibrant-btn" style={{ marginTop: '14px', padding: '10px 20px', borderRadius: '8px' }}>+ Save</button>
                </form>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'rgba(10, 16, 32, 0.96)', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', minWidth: '500px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '10px' }}>Image</th>
                        <th style={{ padding: '10px' }}>Name</th>
                        <th style={{ padding: '10px' }}>Price</th>
                        <th style={{ padding: '10px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                          <td style={{ padding: '8px' }}><img src={p.image} alt={p.name} style={{ width: '40px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} /></td>
                          <td style={{ padding: '8px', fontWeight: 'bold' }}>{p.name}</td>
                          <td style={{ padding: '8px', color: '#4ade80' }}>₹{p.price}</td>
                          <td style={{ padding: '8px' }}><button onClick={() => handleDeleteProduct(p._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full 4-Column Footer with Royal Brand Logo Image */}
      <footer style={{ background: 'rgba(8, 12, 22, 0.98)', color: '#cbd5e1', padding: '50px 40px 30px 40px', borderTop: '1px solid rgba(255,255,255,0.15)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '35px', paddingBottom: '35px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div className="brand-logo-emblem" style={{ width: '38px', height: '38px' }}>
                <img src="/logo.png" alt="Style Hub Logo" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200'; }} />
              </div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff' }}>
                MY STYLE <span style={{ color: '#f43f5e' }}>HUB</span>
              </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
              Vibrant D2C luxury streetwear founded by <b>{OWNER_NAME}</b>. Crafted with pure combed heavyweight cottons and energetic color palettes.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>Collections</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <span style={{ cursor: 'pointer', color: '#cbd5e1' }} onClick={() => { setSelectedCategory('Coat & Pants'); setCurrentPage('shop'); }}>Designer Suits & Coats</span>
              <span style={{ cursor: 'pointer', color: '#cbd5e1' }} onClick={() => { setSelectedCategory('Oversized Tees'); setCurrentPage('shop'); }}>Oversized T-Shirts</span>
              <span style={{ cursor: 'pointer', color: '#cbd5e1' }} onClick={() => { setSelectedCategory('Cargo Pants'); setCurrentPage('shop'); }}>Tactical Cargo Pants</span>
              <span style={{ cursor: 'pointer', color: '#cbd5e1' }} onClick={() => { setSelectedCategory('Hoodies & Jackets'); setCurrentPage('shop'); }}>Heavy Outerwear</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>Support & Store</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div>📍 {STORE_ADDRESS}</div>
              <div>📞 +91 6284319095</div>
              <div>✉️ {SUPPORT_EMAIL}</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>VIP Drop Alerts</div>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 12px 0' }}>Subscribe to get color drop alerts & exclusive personalized discounts.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed to VIP drop alerts!"); setNewsletterEmail(''); }} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                placeholder="Your email address" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '13px', outline: 'none' }}
              />
              <button type="submit" className="vibrant-btn" style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '13px' }}>Join</button>
            </form>
          </div>

        </div>

        <div style={{ maxWidth: '1280px', margin: '18px auto 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#94a3b8', flexWrap: 'wrap', gap: '10px' }}>
          <div>© 2026 My Style Hub Studio. Founder: <b>{OWNER_NAME}</b></div>
          <div>Crafted for Modern Streetwear Culture</div>
        </div>
      </footer>

      {/* Mobile App Bottom Navigation Bar */}
      <nav className="mobile-bottom-navbar">
        <button 
          className={`mobile-nav-item ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => { setCurrentPage('home'); setSelectedCategory('All'); }}
        >
          <span className="icon">🏠</span>
          <span>Home</span>
        </button>

        <button 
          className={`mobile-nav-item ${currentPage === 'shop' ? 'active' : ''}`}
          onClick={() => { setCurrentPage('shop'); setSelectedCategory('All'); }}
        >
          <span className="icon">🛍️</span>
          <span>Shop</span>
        </button>

        <button 
          className="mobile-nav-item"
          onClick={openLuckyWheelModal}
          style={{ color: '#facc15' }}
        >
          <span className="icon">🎡</span>
          <span>Wheel</span>
        </button>

        <button 
          className={`mobile-nav-item ${currentPage === 'wishlist' ? 'active' : ''}`}
          onClick={() => setCurrentPage('wishlist')}
        >
          <span className="icon">❤️</span>
          <span>Wishlist</span>
        </button>

        <button 
          className={`mobile-nav-item ${currentPage === 'profile' ? 'active' : ''}`}
          onClick={() => {
            if (currentUser) {
              setCurrentPage('profile');
              setIsEditingProfile(false);
            } else {
              setAuthModal('login');
            }
          }}
        >
          <span className="icon">👤</span>
          <span>{currentUser ? 'Profile' : 'Sign In'}</span>
        </button>
      </nav>

      {/* Floating WhatsApp Support Trigger */}
      <a 
        href={`https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent('Hi My Style Hub! I would like to inquire about an outfit.')}`}
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '76px',
          right: '20px',
          background: '#22c55e',
          color: '#fff',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.6)',
          zIndex: 999,
          textDecoration: 'none'
        }}
      >
        💬
      </a>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200, padding: '16px' }}>
          <div className="hyper-card" style={{ width: '100%', maxWidth: '700px', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', position: 'relative', background: '#0f172a' }}>
            <button onClick={() => setQuickViewProduct(null)} style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', zIndex: 10 }}>✕</button>
            
            <div style={{ height: '300px' }}>
              <img src={quickViewProduct.image} alt={quickViewProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#f43f5e', textTransform: 'uppercase' }}>{quickViewProduct.category}</span>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', margin: '4px 0 8px 0' }}>{quickViewProduct.name}</h3>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#4ade80', marginBottom: '10px' }}>₹{quickViewProduct.price}</div>
                <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5', margin: '0 0 14px 0' }}>{quickViewProduct.description}</p>
                
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase' }}>Size:</span>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => handleSizeSelect(quickViewProduct._id, sz)}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '6px',
                        border: (itemSizes[quickViewProduct._id] || 'L') === sz ? '2px solid #f43f5e' : '1px solid rgba(255,255,255,0.2)',
                        background: (itemSizes[quickViewProduct._id] || 'L') === sz ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        fontWeight: '800',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => addToCart(quickViewProduct)} 
                className="vibrant-btn" 
                style={{ width: '100%', padding: '12px', borderRadius: '10px', marginTop: '16px' }}
              >
                Add to Bag 🛍️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Lamp Auth Modal */}
      {authModal && (
        <LampLogin 
          mode={authModal === 'adminLogin' ? 'admin' : authModal}
          onClose={() => setAuthModal(null)}
          onLoginSuccess={handleLoginDirect}
          onRegisterSuccess={handleRegisterDirect}
          onAdminSuccess={(enteredPin) => {
            if (enteredPin === ADMIN_SECRET) {
              setIsAdminLoggedIn(true);
              localStorage.setItem('stylehub_admin_logged', 'true');
              setAuthModal(null);
              setCurrentPage('admin');
              fetchOrders();
              fetchUsers();
            } else {
              alert("Invalid Admin Passcode!");
            }
          }}
        />
      )}

      {/* Cart Drawer */}
      {isCartOpen && currentUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'flex-end', zIndex: 1200 }}>
          <div style={{ background: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.15)', width: '100%', maxWidth: '400px', height: '100%', padding: '24px', boxSizing: 'border-box', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '14px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#fff' }}>Shopping Bag ({cart.length})</h2>
                <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '18px', cursor: 'pointer' }}>✖</button>
              </div>

              {cart.length === 0 ? (
                <p style={{ color: '#cbd5e1', marginTop: '40px', textAlign: 'center' }}>Your shopping bag is empty.</p>
              ) : (
                <div style={{ marginTop: '16px' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '13px', color: '#fff' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Size: <b style={{ color: '#f43f5e' }}>{item.selectedSize}</b></div>
                        <div style={{ color: '#4ade80', fontWeight: '900', fontSize: '14px' }}>₹{item.price}</div>
                      </div>
                      <button onClick={() => removeFromCart(idx)} style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '10px', fontWeight: '800' }}>Remove</button>
                    </div>
                  ))}

                  <div style={{ background: 'rgba(255,255,255,0.08)', padding: '12px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)', marginTop: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '6px' }}>PROMO CODE: (Use: STYLE200 or Spin Code)</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input 
                        type="text" 
                        placeholder="Coupon code" 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value)} 
                        disabled={appliedCoupon !== ''}
                        style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '11px', textTransform: 'uppercase' }} 
                      />
                      {appliedCoupon ? (
                        <button onClick={removeCoupon} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '0 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Remove</button>
                      ) : (
                        <button onClick={applyCoupon} className="vibrant-btn" style={{ padding: '0 12px', borderRadius: '6px', fontSize: '11px' }}>Apply</button>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', fontSize: '12px', lineHeight: '1.8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                      <span>Subtotal:</span>
                      <span>₹{rawTotalPrice}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80', fontWeight: 'bold' }}>
                        <span>Discount ({appliedCoupon}):</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: '900', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '6px' }}>
                      <span>Payable:</span>
                      <span style={{ color: '#4ade80' }}>₹{finalPayablePrice}</span>
                    </div>
                  </div>

                  <form onSubmit={initiatePaymentGateway} style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '14px' }}>
                    <textarea placeholder="Delivery Address with Postal Pincode *" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '12px', boxSizing: 'border-box', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '12px' }} rows="2" required />
                    <button type="submit" className="vibrant-btn" style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '13px' }}>
                      Proceed to Pay ₹{finalPayablePrice} ⚡
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      {showPaymentGateway && orderSummary && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300, padding: '16px' }}>
          <div className="hyper-card" style={{ width: '100%', maxWidth: '600px', borderRadius: '22px', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#0f172a' }}>
            
            <div style={{ background: 'linear-gradient(90deg, #f43f5e, #8b5cf6)', color: '#fff', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#fbcfe8', fontWeight: '800' }}>CHECKOUT</div>
                <div style={{ fontSize: '16px', fontWeight: '900' }}>My Style Hub Gateway</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#e2e8f0' }}>Payable</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#fff' }}>₹{orderSummary.totalAmount}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', minHeight: '320px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  onClick={() => setPaymentTab('upi')} 
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: paymentTab === 'upi' ? '#f43f5e' : 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: '800', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}
                >
                  📱 UPI / QR
                </button>
                <button 
                  onClick={() => setPaymentTab('card')} 
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: paymentTab === 'card' ? '#f43f5e' : 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: '800', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}
                >
                  💳 Card
                </button>
                <button 
                  onClick={() => setPaymentTab('netbanking')} 
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: paymentTab === 'netbanking' ? '#f43f5e' : 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: '800', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}
                >
                  🏦 Net Banking
                </button>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                
                {paymentTab === 'upi' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>Beneficiary: {ACCOUNT_HOLDER}</div>
                    <div style={{ fontSize: '11px', color: '#f43f5e', marginBottom: '14px' }}>UPI ID: <b>{UPI_ID}</b></div>

                    {!showQrCode ? (
                      <button 
                        onClick={() => setShowQrCode(true)}
                        style={{ background: 'rgba(244, 63, 94, 0.2)', border: '1px solid #f43f5e', color: '#fff', padding: '10px 18px', borderRadius: '10px', fontWeight: '800', fontSize: '12px', cursor: 'pointer', margin: '10px 0' }}
                      >
                        📷 Show QR Code
                      </button>
                    ) : (
                      <div style={{ background: '#fff', border: '2px dashed #cbd5e1', padding: '10px', borderRadius: '14px', display: 'inline-block', marginBottom: '10px' }}>
                        <img src={qrCodeUrl} alt="UPI QR Code" style={{ width: '130px', height: '130px', display: 'block', margin: '0 auto' }} />
                        <div style={{ fontSize: '9px', color: '#0f172a', marginTop: '4px', fontWeight: 'bold' }}>Scan with GPay / PhonePe / Paytm</div>
                      </div>
                    )}

                    <button 
                      onClick={() => finalizeOrder('UPI Verified')} 
                      disabled={isProcessingPay}
                      className="vibrant-btn"
                      style={{ width: '100%', marginTop: '10px', padding: '12px', borderRadius: '10px', fontSize: '13px' }}
                    >
                      {isProcessingPay ? 'Verifying...' : `Pay ₹${orderSummary.totalAmount} ✓`}
                    </button>
                  </div>
                )}

                {paymentTab === 'card' && (
                  <form onSubmit={(e) => { e.preventDefault(); finalizeOrder('Card Verified'); }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" placeholder="Card Number (16 Digits)" maxLength="16" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input type="text" placeholder="MM/YY" maxLength="5" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff' }} />
                      <input type="password" placeholder="CVV" maxLength="3" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff' }} />
                    </div>
                    <button type="submit" disabled={isProcessingPay} className="vibrant-btn" style={{ width: '100%', marginTop: '10px', padding: '12px', borderRadius: '10px' }}>
                      {isProcessingPay ? 'Processing...' : `Pay ₹${orderSummary.totalAmount}`}
                    </button>
                  </form>
                )}

                {paymentTab === 'netbanking' && (
                  <form onSubmit={(e) => { e.preventDefault(); finalizeOrder(`NetBanking (${selectedBank})`); }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #f43f5e', background: 'rgba(0,0,0,0.4)', color: '#fff', fontWeight: '700' }}>
                      <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                      <option value="UCO Bank">UCO Bank</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                    </select>
                    <button type="submit" disabled={isProcessingPay} className="vibrant-btn" style={{ width: '100%', marginTop: '14px', padding: '12px', borderRadius: '10px' }}>
                      {isProcessingPay ? `Connecting...` : `Pay ₹${orderSummary.totalAmount}`}
                    </button>
                  </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <button onClick={() => setShowPaymentGateway(false)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '700', fontSize: '11px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {completedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1400, padding: '16px' }}>
          <div style={{ background: '#fff', color: '#0f172a', width: '100%', maxWidth: '440px', padding: '26px', borderRadius: '20px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '12px', marginBottom: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f43f5e' }}>MY STYLE HUB</h2>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Order Invoice / Payment Receipt</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Owner: {OWNER_NAME} | {STORE_ADDRESS}</div>
            </div>

            <div style={{ fontSize: '12px', lineHeight: '1.7', marginBottom: '12px' }}>
              <div><b>Customer:</b> {completedOrder.customerName} ({completedOrder.customerPhone})</div>
              <div><b>Address:</b> {completedOrder.customerAddress}</div>
              <div><b>Method:</b> {completedOrder.paymentMethod}</div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '10px 0', marginBottom: '12px' }}>
              {completedOrder.items && completedOrder.items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', margin: '3px 0' }}>
                  <span>{it.name} ({it.selectedSize})</span>
                  <b>₹{it.price}</b>
                </div>
              ))}
              {completedOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#16a34a', fontWeight: 'bold', marginTop: '4px' }}>
                  <span>Coupon Discount</span>
                  <span>-₹{completedOrder.discount}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: '900', marginBottom: '18px' }}>
              <span>Total Paid:</span>
              <span style={{ color: '#16a34a' }}>₹{completedOrder.totalAmount}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => window.print()} style={{ flex: 1, padding: '10px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>🖨️ Print</button>
              <button onClick={() => setCompletedOrder(null)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;