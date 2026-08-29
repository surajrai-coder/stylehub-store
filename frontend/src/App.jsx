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
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
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
      name: "Textured Corduroy Boxy Shirt",
      price: 899,
      category: "Casual Shirts",
      description: "Breathable layering relaxed silhouette retro over-shirt.",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800",
      sizes: ["S", "M", "L", "XL", "XXL"]
    }
  ];

  // Instant pre-load for 0-second loading
  const [products, setProducts] = useState(() => {
    const local = localStorage.getItem('stylehub_local_products');
    return local ? [...defaultCatalog, ...JSON.parse(local)] : defaultCatalog;
  });

  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Zero-delay
  
  const [currentPage, setCurrentPage] = useState('home');
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

  const [currentUser, setCurrentUser] = useState(null);
  const [authModal, setAuthModal] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Oversized Tees');
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

  useEffect(() => {
    const visits = parseInt(localStorage.getItem('stylehub_site_visits') || '142', 10) + 1;
    localStorage.setItem('stylehub_site_visits', visits.toString());
    setSiteVisits(visits);

    // Silent background fetch (Zero screen blocking)
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
    const allUsers = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('account_')) {
        try {
          const u = JSON.parse(localStorage.getItem(key));
          allUsers.push(u);
        } catch (e) {}
      }
    }
    setUsersList(allUsers);
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
      localStorage.setItem('stylehub_user', JSON.stringify(credentials));
      localStorage.setItem(`account_${credentials.email}`, JSON.stringify(credentials));
      setAuthModal(null);
      fetchUsers();
      return;
    }

    const cleanEmail = credentials.email.toLowerCase().trim();
    const cleanPassword = credentials.password;

    const savedAcc = localStorage.getItem(`account_${cleanEmail}`);
    if (savedAcc) {
      const parsed = JSON.parse(savedAcc);
      if (parsed.password === cleanPassword) {
        setCurrentUser(parsed);
        localStorage.setItem('stylehub_user', JSON.stringify(parsed));
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
      localStorage.setItem('stylehub_user', JSON.stringify(res.data.user));
      setAuthModal(null);
    })
    .catch(() => {
      alert("Account credentials not found. Please register via Sign Up.");
    });
  };

  const handleRegisterDirect = (formData) => {
    const cleanEmail = formData.email.toLowerCase().trim();
    const cleanPhone = formData.phone.trim();

    const existingUser = localStorage.getItem(`account_${cleanEmail}`);
    if (existingUser) {
      alert("An account with this email address already exists! Please Sign In.");
      setAuthModal('login');
      return;
    }

    const newUser = {
      name: formData.name,
      email: cleanEmail,
      phone: cleanPhone,
      createdAt: new Date().toLocaleDateString()
    };

    setCurrentUser(newUser);
    localStorage.setItem('stylehub_user', JSON.stringify(newUser));
    localStorage.setItem(`account_${cleanEmail}`, JSON.stringify({ ...newUser, password: formData.password }));
    setAuthModal(null);
    fetchUsers();
    alert(`Account created successfully! Welcome to StyleHub, ${formData.name}.`);

    axios.post(`${API_BASE_URL}/api/auth/register`, {
      name: formData.name,
      email: cleanEmail,
      phone: cleanPhone,
      password: formData.password
    }).catch(() => {});
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('stylehub_user');
    setCart([]);
    setWishlist([]);
    alert("Signed out successfully.");
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name || !price || !category) {
      alert("Product Title, Price, and Category are required!");
      return;
    }
    const finalImage = image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800";
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

  const handleDeleteUser = (email) => {
    if (window.confirm(`Delete user account "${email}" permanently?`)) {
      localStorage.removeItem(`account_${email}`);
      if (currentUser && currentUser.email === email) {
        handleLogout();
      }
      fetchUsers();
      alert("User account removed successfully.");
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
  const pendingOrdersCount = orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length;
  const shippedOrdersCount = orders.filter(o => o.status === 'Shipped').length;
  const cancelledOrdersCount = orders.filter(o => o.status === 'Cancelled').length;

  const categoriesList = ['All', 'Oversized Tees', 'Cargo Pants', 'Hoodies & Jackets', 'Casual Shirts'];

  const categoryCards = [
    { title: 'Graphic Oversized Tees', category: 'Oversized Tees', count: '18+ Drops', tag: 'POPULAR', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600' },
    { title: 'Utility Cargo Pants', category: 'Cargo Pants', count: '10+ Fits', tag: 'STYLIST PICK', image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600' },
    { title: 'Winter Fleece & Jackets', category: 'Hoodies & Jackets', count: '14+ Drops', tag: 'WINTER', image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600' },
    { title: 'Vibrant Casual Shirts', category: 'Casual Shirts', count: '12+ Styles', tag: 'COLOR EDITION', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600' }
  ];

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
        <div style={{ background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)', padding: '10px 0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(236,72,153,0.3)' }}>
          <div className="marquee-track">
            <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '12px', letterSpacing: '2px', display: 'inline-flex', gap: '35px', marginRight: '35px' }}>
              <span>SPIN DAILY LUCKY WHEEL FOR EXCLUSIVE DISCOUNTS</span>
              <span>240+ GSM COMBED COTTON OVERSIZED STREETWEAR</span>
              <span>FREE PAN-INDIA EXPRESS SHIPPING</span>
              <span>LIMITED EDITION 2026 COLOR DROP LIVE</span>
            </div>
          </div>
        </div>

        {/* Glass Navbar */}
        <header style={{ background: 'rgba(10, 15, 30, 0.96)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255, 255, 255, 0.16)', position: 'sticky', top: 0, zIndex: 100, padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => { setCurrentPage('home'); setSelectedCategory('All'); setSearchQuery(''); }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'linear-gradient(135deg, #f43f5e, #8b5cf6, #06b6d4)', boxShadow: '0 0 25px rgba(244, 63, 94, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '900', fontSize: '20px' }}>
              ✦
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>MY STYLE <span style={{ color: '#f43f5e' }}>HUB</span></div>
              <div style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: '800', letterSpacing: '2px' }}>STREETWEAR STUDIO</div>
            </div>
          </div>

          <div style={{ flex: '1', maxWidth: '380px', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search colourful tees, cargos, prints..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); if (currentPage !== 'shop' && currentPage !== 'home') setCurrentPage('shop'); }}
              style={{ width: '100%', padding: '12px 18px 12px 42px', borderRadius: '30px', border: '1.5px solid rgba(236, 72, 153, 0.5)', fontSize: '13px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', outline: 'none', backdropFilter: 'blur(10px)' }}
            />
            <span style={{ position: 'absolute', left: '16px', top: '12px', fontSize: '14px', color: '#f43f5e' }}>🔍</span>
            {searchQuery && (
              <span onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '16px', top: '12px', fontSize: '12px', cursor: 'pointer', color: '#cbd5e1', fontWeight: 'bold' }}>✕</span>
            )}
          </div>

          <nav style={{ display: 'flex', gap: '20px', fontSize: '14px', fontWeight: '800', color: '#e2e8f0', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer', color: currentPage === 'home' ? '#f43f5e' : 'inherit' }} onClick={() => { setCurrentPage('home'); setSelectedCategory('All'); }}>Home</span>
            <span style={{ cursor: 'pointer', color: currentPage === 'shop' ? '#f43f5e' : 'inherit' }} onClick={() => { setCurrentPage('shop'); setSelectedCategory('All'); }}>Shop All</span>
            <span style={{ cursor: 'pointer', color: currentPage === 'categories' ? '#f43f5e' : 'inherit' }} onClick={() => setCurrentPage('categories')}>Collections</span>
            
            <button 
              onClick={openLuckyWheelModal}
              style={{ background: 'linear-gradient(135deg, #facc15, #f59e0b)', color: '#0f172a', border: 'none', padding: '7px 16px', borderRadius: '20px', fontWeight: '900', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 4px 15px rgba(245,158,11,0.4)' }}
            >
              🎡 Daily Lucky Wheel
            </button>

            {currentUser && (
              <span style={{ cursor: 'pointer', color: currentPage === 'myOrders' ? '#f43f5e' : 'inherit' }} onClick={() => setCurrentPage('myOrders')}>Orders ({userOrders.length})</span>
            )}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              onClick={() => setCurrentPage('wishlist')} 
              style={{ cursor: 'pointer', position: 'relative', width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}
            >
              ❤️
              {wishlist.length > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#f43f5e', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {wishlist.length}
                </span>
              )}
            </div>

            <button 
              onClick={() => {
                if (isAdminLoggedIn) setCurrentPage('admin');
                else setAuthModal('adminLogin');
              }}
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '9px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '12px', color: '#fff' }}
            >
              🔒 Admin
            </button>

            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(236, 72, 153, 0.25)', border: '1px solid rgba(236, 72, 153, 0.5)', padding: '6px 14px', borderRadius: '20px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#fbcfe8' }}>👤 {currentUser.name.split(' ')[0]}</span>
                <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '10px', cursor: 'pointer', fontSize: '10px', fontWeight: '800' }}>Exit</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setAuthModal('login')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '9px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '12px' }}>Sign In</button>
                <button onClick={() => setAuthModal('register')} className="vibrant-btn" style={{ padding: '9px 20px', borderRadius: '12px', fontSize: '12px' }}>Sign Up</button>
              </div>
            )}

            <div 
              onClick={() => {
                if (!currentUser) {
                  alert("Please Sign In or Create an Account first.");
                  setAuthModal('login');
                } else {
                  setIsCartOpen(true);
                }
              }}
              style={{ position: 'relative', cursor: 'pointer', background: 'linear-gradient(135deg, #f43f5e, #8b5cf6)', color: '#fff', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(244, 63, 94, 0.5)' }}
            >
              🛍️
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#facc15', color: '#0f172a', borderRadius: '50%', width: '20px', height: '20px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>
                {cart.length}
              </span>
            </div>
          </div>
        </header>

        {/* Storefront Home & Catalog Content */}
        {(currentPage === 'home' || currentPage === 'shop') && (
          <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 60px 20px' }}>
            
            {currentPage === 'home' && !searchQuery && (
              <section className="hyper-card" style={{ margin: '26px 0 50px 0', padding: '50px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'center', background: 'rgba(12, 18, 34, 0.92)' }}>
                <div>
                  <div className="opening-intro-badge" style={{ marginBottom: '18px' }}>
                    <span style={{ fontSize: '14px' }}>🔥</span>
                    <span style={{ color: '#fff', fontWeight: '900', fontSize: '12px', letterSpacing: '1px' }}>AUTUMN 2026 COLOR DROP LIVE</span>
                  </div>

                  <h1 style={{ fontSize: '50px', fontWeight: '900', margin: '0 0 16px 0', letterSpacing: '-1.2px', lineHeight: '1.1', color: '#ffffff' }}>
                    UNLEASH YOUR <br/>
                    <span style={{ background: 'linear-gradient(90deg, #f43f5e, #fb923c, #facc15, #38bdf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      COLOR AURA FIT
                    </span>
                  </h1>

                  <p style={{ fontSize: '16px', color: '#cbd5e1', margin: '0 0 30px 0', lineHeight: '1.7', fontWeight: '500', maxWidth: '500px' }}>
                    Heavyweight 240+ GSM pure combed cotton in saturated vivid colorways, tactical multi-pocket cargos, and pastel drop shoulders.
                  </p>

                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => setCurrentPage('shop')} 
                      className="vibrant-btn"
                      style={{ padding: '15px 36px', borderRadius: '16px', fontSize: '15px' }}
                    >
                      Shop All Fits →
                    </button>
                    <button 
                      onClick={() => { setSelectedCategory('Cargo Pants'); setCurrentPage('shop'); }} 
                      style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', padding: '15px 28px', borderRadius: '16px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
                    >
                      Tactical Cargos 👖
                    </button>
                  </div>
                </div>

                <div style={{ position: 'relative', height: '380px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.2)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800" 
                    alt="Streetwear Model" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', background: 'rgba(10, 15, 30, 0.95)', backdropFilter: 'blur(12px)', padding: '12px 18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#f43f5e', fontWeight: '800' }}>FEATURED COLOR DROP</div>
                      <div style={{ fontSize: '15px', fontWeight: '900', color: '#fff' }}>Neon Sunset Oversized Fit</div>
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#4ade80' }}>₹799</span>
                  </div>
                </div>
              </section>
            )}

            {/* Curated Categories */}
            {currentPage === 'home' && !searchQuery && (
              <section style={{ marginBottom: '60px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                  <div>
                    <span className="section-tagline-vivid">COLLECTIONS MATRIX</span>
                    <h2 className="section-headline-glow" style={{ margin: '4px 0 0 0' }}>Explore By Category</h2>
                  </div>
                  <span onClick={() => setCurrentPage('categories')} style={{ fontSize: '14px', fontWeight: '800', color: '#f43f5e', cursor: 'pointer', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', padding: '8px 16px', borderRadius: '12px' }}>
                    View All Collections →
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                  {categoryCards.map((c, i) => (
                    <div 
                      key={i} 
                      onClick={() => { setSelectedCategory(c.category); setCurrentPage('shop'); }}
                      className="hyper-card"
                      style={{ height: '340px' }}
                    >
                      <img src={c.image} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(6,10,22,0.96) 90%)' }}></div>
                      
                      <div style={{ position: 'absolute', top: '16px', left: '16px', fontWeight: '800', fontSize: '11px', color: '#fff', background: 'linear-gradient(135deg, #f43f5e, #8b5cf6)', padding: '6px 14px', borderRadius: '10px' }}>
                        {c.tag}
                      </div>

                      <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: '#ffffff', fontSize: '21px', fontWeight: '900' }}>{c.title}</div>
                          <div style={{ color: '#38bdf8', fontSize: '13px', fontWeight: '800', marginTop: '2px' }}>{c.count}</div>
                        </div>
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#fff', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span className="section-tagline-vivid">
                    {searchQuery ? `SEARCH RESULTS` : 'FRESH STREETWEAR DROPS'}
                  </span>
                  <h2 className="section-headline-glow" style={{ margin: '4px 0 0 0' }}>
                    {searchQuery ? `"${searchQuery}" (${filteredProducts.length})` : selectedCategory === 'All' ? 'All Vibrant Drops' : selectedCategory}
                  </h2>
                </div>
                {(selectedCategory !== 'All' || searchQuery) && (
                  <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff', padding: '9px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '13px' }}>
                    Reset Filters ✕
                  </button>
                )}
              </div>

              {/* Filter Pills */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setSearchQuery(''); }}
                    className={`filter-pill-btn ${selectedCategory === cat ? 'active' : 'inactive'}`}
                  >
                    {cat === 'All' ? '✨ All Fits' : cat === 'Oversized Tees' ? '👕 Oversized Tees' : cat === 'Cargo Pants' ? '👖 Cargo Pants' : cat === 'Hoodies & Jackets' ? '🧥 Hoodies & Jackets' : '👔 Casual Shirts'}
                  </button>
                ))}
              </div>

              {/* Products Rendering */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '90px 20px', color: '#cbd5e1' }}>
                  <div style={{ fontSize: '40px', marginBottom: '14px' }}>✦</div>
                  <p style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>Loading Colorful Drops...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '90px 20px', background: 'rgba(255,255,255,0.04)', borderRadius: '28px', border: '1px dashed rgba(255,255,255,0.2)', color: '#cbd5e1' }}>
                  <div style={{ fontSize: '42px', marginBottom: '12px' }}>👕</div>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#fff' }}>No outfits found in this category.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                  {filteredProducts.map((item) => {
                    const currentSize = itemSizes[item._id] || 'L';
                    const originalPrice = Math.round(item.price * 1.6);
                    const isWishlisted = wishlist.some(w => w._id === item._id);

                    return (
                      <div key={item._id} className="hyper-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        
                        <div style={{ position: 'relative', overflow: 'hidden', height: '340px' }}>
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          
                          <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(10, 15, 30, 0.95)', backdropFilter: 'blur(8px)', color: '#38bdf8', fontSize: '11px', padding: '6px 14px', borderRadius: '10px', fontWeight: '800', border: '1px solid rgba(255,255,255,0.15)' }}>
                            {item.category || 'Streetwear'}
                          </span>

                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }} 
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(10, 15, 30, 0.95)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px' }}
                          >
                            {isWishlisted ? '❤️' : '🤍'}
                          </button>

                          <button 
                            onClick={() => setQuickViewProduct(item)} 
                            style={{ position: 'absolute', bottom: '14px', right: '14px', background: 'rgba(10, 15, 30, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', padding: '7px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', color: '#fff', cursor: 'pointer' }}
                          >
                            👁️ Quick View
                          </button>
                        </div>

                        <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                          <div>
                            <h4 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800', color: '#fff' }}>{item.name}</h4>
                            
                            <div style={{ fontSize: '11px', color: '#f43f5e', fontWeight: '800', marginBottom: '10px' }}>
                              ✦ 240+ GSM Pure Combed Cotton • Vivid Colorway
                            </div>

                            <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0 0 16px 0', lineHeight: '1.6' }}>{item.description || 'Premium drop-shoulder colorful silhouette.'}</p>
                            
                            <div style={{ marginBottom: '16px' }}>
                              <span style={{ fontSize: '11px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase' }}>Select Size:</span>
                              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                                  <button
                                    key={sz}
                                    onClick={() => handleSizeSelect(item._id, sz)}
                                    style={{
                                      width: '36px',
                                      height: '36px',
                                      borderRadius: '10px',
                                      border: currentSize === sz ? '2px solid #f43f5e' : '1px solid rgba(255,255,255,0.15)',
                                      background: currentSize === sz ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255,255,255,0.06)',
                                      color: '#fff',
                                      fontSize: '12px',
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

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                            <div>
                              <div style={{ fontSize: '22px', fontWeight: '900', color: '#4ade80' }}>₹{item.price}</div>
                              <div style={{ fontSize: '12px', color: '#cbd5e1', textDecoration: 'line-through', fontWeight: '700' }}>₹{originalPrice}</div>
                            </div>
                            
                            <button 
                              onClick={() => addToCart(item)}
                              className="vibrant-btn"
                              style={{ padding: '12px 22px', borderRadius: '12px', fontSize: '13px' }}
                            >
                              Add to Bag 🛍️
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
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 }}>
            <div className="hyper-card" style={{ width: '92%', maxWidth: '440px', padding: '36px 20px', textAlign: 'center', background: '#0a0f1d' }}>
              
              <h3 className="section-headline-glow" style={{ fontSize: '24px', margin: '0 0 4px 0' }}>🎡 Daily Lucky Spin Wheel</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '22px' }}>
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
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#4ade80', padding: '14px', borderRadius: '14px', fontSize: '13px', fontWeight: 'bold', marginBottom: '16px' }}>
                  {spinReward}
                </div>
              ) : (
                <button 
                  onClick={triggerAnimatedSpin} 
                  disabled={isSpinning}
                  className="vibrant-btn" 
                  style={{ width: '100%', padding: '15px', borderRadius: '14px', fontSize: '15px', letterSpacing: '1px' }}
                >
                  {isSpinning ? '🎡 SPINNING WHEEL...' : '🎯 TAP TO SPIN NOW'}
                </button>
              )}

              <button onClick={() => setShowLuckySpin(false)} style={{ marginTop: '16px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}>Close Window ✕</button>
            </div>
          </div>
        )}

        {/* Wishlist View */}
        {currentPage === 'wishlist' && (
          <main style={{ maxWidth: '1260px', margin: '30px auto', padding: '0 20px 60px 20px' }}>
            <h2 className="section-headline-glow" style={{ marginBottom: '24px' }}>Saved Wishlist ({wishlist.length})</h2>
            {wishlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '90px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', color: '#cbd5e1' }}>
                <p>Your wishlist is currently empty.</p>
                <button onClick={() => setCurrentPage('shop')} className="vibrant-btn" style={{ marginTop: '14px', padding: '12px 24px', borderRadius: '12px' }}>Explore Catalog</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '26px' }}>
                {wishlist.map((item) => (
                  <div key={item._id} className="hyper-card" style={{ padding: '18px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '16px' }} />
                    <h4 style={{ margin: '12px 0 4px 0', fontSize: '17px', fontWeight: '800', color: '#fff' }}>{item.name}</h4>
                    <div style={{ fontSize: '19px', fontWeight: '900', color: '#4ade80', marginBottom: '12px' }}>₹{item.price}</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => addToCart(item)} className="vibrant-btn" style={{ flex: 1, padding: '10px', borderRadius: '10px' }}>Move to Bag 🛍️</button>
                      <button onClick={() => toggleWishlist(item)} style={{ padding: '10px 16px', background: 'rgba(239, 68, 68, 0.25)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        )}

        {/* My Orders View */}
        {currentPage === 'myOrders' && currentUser && (
          <main style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px 60px 20px' }}>
            <h2 className="section-headline-glow" style={{ marginBottom: '24px' }}>My Orders History</h2>
            {userOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '90px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', color: '#cbd5e1' }}>
                <p>No orders placed yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {userOrders.map((ord) => (
                  <div key={ord._id} className="hyper-card" style={{ padding: '26px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Order ID: <b style={{ color: '#fff' }}>{ord._id}</b></div>
                        <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Date: {new Date(ord.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ background: ord.status === 'Delivered' ? 'rgba(34, 197, 94, 0.25)' : ord.status === 'Cancelled' ? 'rgba(239, 68, 68, 0.25)' : ord.status === 'Shipped' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(234, 179, 8, 0.25)', color: ord.status === 'Delivered' ? '#4ade80' : ord.status === 'Cancelled' ? '#ef4444' : ord.status === 'Shipped' ? '#a5b4fc' : '#facc15', border: '1px solid currentColor', padding: '6px 16px', borderRadius: '30px', fontWeight: '800', fontSize: '12px' }}>
                        ● Status: {ord.status || 'Processing'}
                      </div>
                    </div>

                    <div>
                      {ord.items && ord.items.map((it, idx) => (
                        <div key={idx} style={{ fontSize: '14px', margin: '6px 0', color: '#e2e8f0' }}>• {it.name} (Size: <b style={{ color: '#f43f5e' }}>{it.selectedSize}</b>) - ₹{it.price}</div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px' }}>
                      <div style={{ fontSize: '17px', fontWeight: '900', color: '#fff' }}>Total Paid: <span style={{ color: '#4ade80' }}>₹{ord.totalAmount}</span></div>
                      <button onClick={() => setCompletedOrder(ord)} style={{ padding: '9px 16px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
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
          <main style={{ maxWidth: '1260px', margin: '30px auto', padding: '0 20px 60px 20px' }}>
            <h2 className="section-headline-glow" style={{ marginBottom: '26px' }}>All Streetwear Collections</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '26px' }}>
              {categoryCards.map((c, i) => (
                <div key={i} onClick={() => { setSelectedCategory(c.category); setCurrentPage('shop'); }} className="hyper-card" style={{ height: '340px' }}>
                  <img src={c.image} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, transparent 30%, rgba(6,10,22,0.96) 100%)' }}></div>
                  <div style={{ position: 'absolute', bottom: '22px', left: '22px', right: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#fff', fontSize: '22px', fontWeight: '900' }}>{c.title}</div>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#fff', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>↗</div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* Master Admin Panel */}
        {currentPage === 'admin' && isAdminLoggedIn && (
          <div style={{ maxWidth: '1280px', margin: '30px auto', padding: '0 20px 60px 20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.18)', paddingBottom: '22px', flexWrap: 'wrap', gap: '16px', background: 'rgba(10, 16, 32, 0.96)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div>
                <h2 className="section-headline-glow" style={{ fontSize: '32px', margin: 0, color: '#ffffff' }}>
                  ⚡ Master Control Dashboard
                </h2>
                <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: '700', marginTop: '4px' }}>
                  Realtime Store Control, Orders, Users & Live Analytics
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => setAdminTab('analytics')} style={{ padding: '10px 18px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '800', background: adminTab === 'analytics' ? 'linear-gradient(135deg, #f43f5e, #8b5cf6)' : 'rgba(255,255,255,0.15)', color: '#fff' }}>📊 Analytics</button>
                <button onClick={() => setAdminTab('orders')} style={{ padding: '10px 18px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '800', background: adminTab === 'orders' ? 'linear-gradient(135deg, #f43f5e, #8b5cf6)' : 'rgba(255,255,255,0.15)', color: '#fff' }}>📦 Orders ({orders.length})</button>
                <button onClick={() => setAdminTab('users')} style={{ padding: '10px 18px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '800', background: adminTab === 'users' ? 'linear-gradient(135deg, #f43f5e, #8b5cf6)' : 'rgba(255,255,255,0.15)', color: '#fff' }}>👥 Users ({usersList.length})</button>
                <button onClick={() => setAdminTab('products')} style={{ padding: '10px 18px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '800', background: adminTab === 'products' ? 'linear-gradient(135deg, #f43f5e, #8b5cf6)' : 'rgba(255,255,255,0.15)', color: '#fff' }}>👕 Catalog ({products.length})</button>
                <button onClick={() => { setIsAdminLoggedIn(false); setCurrentPage('home'); }} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800' }}>Exit Admin</button>
              </div>
            </div>

            {/* TAB 1: ANALYTICS */}
            {adminTab === 'analytics' && (
              <div style={{ marginTop: '26px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                  <div className="hyper-card" style={{ padding: '26px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#cbd5e1', letterSpacing: '1px' }}>TOTAL REVENUE</div>
                    <div style={{ fontSize: '36px', fontWeight: '900', color: '#4ade80', marginTop: '6px' }}>₹{totalRevenue}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Confirmed Sales</div>
                  </div>

                  <div className="hyper-card" style={{ padding: '26px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#cbd5e1', letterSpacing: '1px' }}>TOTAL SITE VISITS</div>
                    <div style={{ fontSize: '36px', fontWeight: '900', color: '#38bdf8', marginTop: '6px' }}>{siteVisits}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Traffic Hits</div>
                  </div>

                  <div className="hyper-card" style={{ padding: '26px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#cbd5e1', letterSpacing: '1px' }}>REGISTERED USERS</div>
                    <div style={{ fontSize: '36px', fontWeight: '900', color: '#facc15', marginTop: '6px' }}>{usersList.length}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Signed Up Members</div>
                  </div>

                  <div className="hyper-card" style={{ padding: '26px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#cbd5e1', letterSpacing: '1px' }}>TOTAL ORDERS PLACED</div>
                    <div style={{ fontSize: '36px', fontWeight: '900', color: '#ec4899', marginTop: '6px' }}>{totalOrdersCount}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{pendingOrdersCount} Pending / {shippedOrdersCount} Shipped</div>
                  </div>

                  <div className="hyper-card" style={{ padding: '26px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#cbd5e1', letterSpacing: '1px' }}>CANCELLED ORDERS</div>
                    <div style={{ fontSize: '36px', fontWeight: '900', color: '#ef4444', marginTop: '6px' }}>{cancelledOrdersCount}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Revoked Orders</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: USERS */}
            {adminTab === 'users' && (
              <div style={{ marginTop: '26px' }}>
                <h3 className="section-headline-glow" style={{ fontSize: '24px', margin: '0 0 16px 0' }}>Registered User Accounts ({usersList.length})</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'rgba(10, 16, 32, 0.96)', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '14px', color: '#fff' }}>Full Name</th>
                      <th style={{ padding: '14px', color: '#fff' }}>Email Address</th>
                      <th style={{ padding: '14px', color: '#fff' }}>Phone Number</th>
                      <th style={{ padding: '14px', color: '#fff' }}>Joined Date</th>
                      <th style={{ padding: '14px', color: '#fff' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#cbd5e1' }}>No users registered yet.</td>
                      </tr>
                    ) : (
                      usersList.map((u, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                          <td style={{ padding: '14px', fontWeight: 'bold', color: '#fff' }}>{u.name}</td>
                          <td style={{ padding: '14px', color: '#38bdf8' }}>{u.email}</td>
                          <td style={{ padding: '14px', color: '#cbd5e1' }}>{u.phone || 'N/A'}</td>
                          <td style={{ padding: '14px', color: '#94a3b8' }}>{u.createdAt || 'Active'}</td>
                          <td style={{ padding: '14px' }}>
                            <button onClick={() => handleDeleteUser(u.email)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Remove User</button>
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
              <div style={{ marginTop: '26px' }}>
                <h3 className="section-headline-glow" style={{ fontSize: '24px', margin: '0 0 16px 0' }}>Customer Orders ({orders.length})</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'rgba(10, 16, 32, 0.96)', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '14px', color: '#fff' }}>Customer</th>
                      <th style={{ padding: '14px', color: '#fff' }}>Items</th>
                      <th style={{ padding: '14px', color: '#fff' }}>Total Amount</th>
                      <th style={{ padding: '14px', color: '#fff' }}>Payment Method</th>
                      <th style={{ padding: '14px', color: '#fff' }}>Order Status</th>
                      <th style={{ padding: '14px', color: '#fff' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <td style={{ padding: '14px' }}><b style={{ color: '#fff' }}>{o.customerName}</b><br/><span style={{ color: '#38bdf8' }}>{o.customerPhone}</span><br/><small style={{ color: '#cbd5e1' }}>{o.customerAddress}</small></td>
                        <td style={{ padding: '14px', color: '#cbd5e1' }}>{o.items && o.items.map((it, idx) => (<div key={idx}>• {it.name} ({it.selectedSize})</div>))}</td>
                        <td style={{ padding: '14px', color: '#4ade80', fontWeight: '900', fontSize: '16px' }}>₹{o.totalAmount}</td>
                        <td style={{ padding: '14px' }}><small style={{ color: '#facc15', fontWeight: 'bold' }}>{o.paymentMethod}</small></td>
                        <td style={{ padding: '14px' }}>
                          <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)} style={{ padding: '8px', background: '#0f172a', color: '#fff', border: '1px solid #f43f5e', borderRadius: '8px', fontWeight: 'bold' }}>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <button onClick={() => handleDeleteOrder(o._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 4: PRODUCT CATALOG */}
            {adminTab === 'products' && (
              <div style={{ marginTop: '26px' }}>
                <form onSubmit={handleAddProduct} className="hyper-card" style={{ padding: '26px', marginBottom: '26px' }}>
                  <h3 className="section-headline-glow" style={{ fontSize: '24px', margin: '0 0 18px 0' }}>Add New Outfit</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <input type="text" placeholder="Title *" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff' }} />
                    <input type="number" placeholder="Price (₹) *" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff' }} />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #f43f5e', background: 'rgba(0,0,0,0.4)', color: '#fff' }}>
                      <option value="Oversized Tees">Oversized Tees</option>
                      <option value="Cargo Pants">Cargo Pants</option>
                      <option value="Hoodies & Jackets">Hoodies & Jackets</option>
                      <option value="Casual Shirts">Casual Shirts</option>
                    </select>
                    <input type="url" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff' }} />
                    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ gridColumn: 'span 2', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff' }} />
                  </div>
                  <button type="submit" className="vibrant-btn" style={{ marginTop: '16px', padding: '12px 26px', borderRadius: '10px' }}>+ Save Outfit</button>
                </form>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'rgba(10, 16, 32, 0.96)', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '12px', color: '#fff' }}>Image</th>
                      <th style={{ padding: '12px', color: '#fff' }}>Name</th>
                      <th style={{ padding: '12px', color: '#fff' }}>Category</th>
                      <th style={{ padding: '12px', color: '#fff' }}>Price</th>
                      <th style={{ padding: '12px', color: '#fff' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <td style={{ padding: '10px' }}><img src={p.image} alt={p.name} style={{ width: '45px', height: '55px', objectFit: 'cover', borderRadius: '8px' }} /></td>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: '#fff' }}>{p.name}</td>
                        <td style={{ padding: '10px', color: '#f43f5e', fontWeight: 'bold' }}>{p.category}</td>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: '#4ade80' }}>₹{p.price}</td>
                        <td style={{ padding: '10px' }}><button onClick={() => handleDeleteProduct(p._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: 'rgba(8, 12, 22, 0.98)', color: '#cbd5e1', padding: '60px 40px 25px 40px', borderTop: '1px solid rgba(255,255,255,0.15)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', paddingBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '900', marginBottom: '14px', color: '#fff' }}>
              MY STYLE <span style={{ color: '#f43f5e' }}>HUB</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
              Vibrant D2C luxury streetwear founded by <b>{OWNER_NAME}</b>. Crafted with pure combed heavyweight cottons and energetic color palettes.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', marginBottom: '14px' }}>Collections</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => { setSelectedCategory('Oversized Tees'); setCurrentPage('shop'); }}>Oversized T-Shirts</span>
              <span style={{ cursor: 'pointer' }} onClick={() => { setSelectedCategory('Cargo Pants'); setCurrentPage('shop'); }}>Tactical Cargo Pants</span>
              <span style={{ cursor: 'pointer' }} onClick={() => { setSelectedCategory('Hoodies & Jackets'); setCurrentPage('shop'); }}>Heavy Outerwear</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', marginBottom: '14px' }}>Support & Store</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div>📍 {STORE_ADDRESS}</div>
              <div>📞 +91 6284319095</div>
              <div>✉️ {SUPPORT_EMAIL}</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', marginBottom: '14px' }}>VIP Drop Alerts</div>
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

        <div style={{ maxWidth: '1280px', margin: '20px auto 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#94a3b8', flexWrap: 'wrap', gap: '10px' }}>
          <div>© 2026 My Style Hub Studio. Founder: <b>{OWNER_NAME}</b></div>
          <div>Crafted for Modern Streetwear Culture</div>
        </div>
      </footer>

      {/* WhatsApp Trigger */}
      <a 
        href={`https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent('Hi My Style Hub! I would like to inquire about an outfit.')}`}
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '26px',
          right: '26px',
          background: '#22c55e',
          color: '#fff',
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          boxShadow: '0 0 25px rgba(34, 197, 94, 0.6)',
          zIndex: 999,
          textDecoration: 'none'
        }}
      >
        💬
      </a>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 }}>
          <div className="hyper-card" style={{ width: '90%', maxWidth: '780px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative', background: '#0f172a' }}>
            <button onClick={() => setQuickViewProduct(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', zIndex: 10 }}>✕</button>
            
            <div style={{ height: '400px' }}>
              <img src={quickViewProduct.image} alt={quickViewProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ padding: '34px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#f43f5e', textTransform: 'uppercase' }}>{quickViewProduct.category}</span>
                <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#fff', margin: '6px 0 10px 0' }}>{quickViewProduct.name}</h3>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#4ade80', marginBottom: '14px' }}>₹{quickViewProduct.price}</div>
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.7', margin: '0 0 18px 0' }}>{quickViewProduct.description}</p>
                
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase' }}>Select Size:</span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => handleSizeSelect(quickViewProduct._id, sz)}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
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
                style={{ width: '100%', padding: '14px', borderRadius: '12px', marginTop: '20px' }}
              >
                Add to Bag 🛍️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNIVERSAL LAMP AUTH MODAL */}
      {authModal && (
        <LampLogin 
          mode={authModal === 'adminLogin' ? 'admin' : authModal}
          onClose={() => setAuthModal(null)}
          onLoginSuccess={handleLoginDirect}
          onRegisterSuccess={handleRegisterDirect}
          onAdminSuccess={(enteredPin) => {
            if (enteredPin === ADMIN_SECRET) {
              setIsAdminLoggedIn(true);
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
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'flex-end', zIndex: 1000 }}>
          <div style={{ background: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.15)', width: '100%', maxWidth: '420px', height: '100%', padding: '30px', boxSizing: 'border-box', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '16px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#fff' }}>Shopping Bag ({cart.length})</h2>
                <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '20px', cursor: 'pointer' }}>✖</button>
              </div>

              {cart.length === 0 ? (
                <p style={{ color: '#cbd5e1', marginTop: '50px', textAlign: 'center' }}>Your shopping bag is empty.</p>
              ) : (
                <div style={{ marginTop: '20px' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px' }}>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '14px', color: '#fff' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Size: <b style={{ color: '#f43f5e' }}>{item.selectedSize}</b></div>
                        <div style={{ color: '#4ade80', fontWeight: '900', fontSize: '15px' }}>₹{item.price}</div>
                      </div>
                      <button onClick={() => removeFromCart(idx)} style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '11px', fontWeight: '800' }}>Remove</button>
                    </div>
                  ))}

                  <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '14px', border: '1px dashed rgba(255,255,255,0.2)', marginTop: '18px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '8px' }}>PROMO CODE: (Use: STYLE200 or Spin Code)</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        placeholder="Coupon code" 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value)} 
                        disabled={appliedCoupon !== ''}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '12px', textTransform: 'uppercase' }} 
                      />
                      {appliedCoupon ? (
                        <button onClick={removeCoupon} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Remove</button>
                      ) : (
                        <button onClick={applyCoupon} className="vibrant-btn" style={{ padding: '0 14px', borderRadius: '8px', fontSize: '12px' }}>Apply</button>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: '18px', fontSize: '13px', lineHeight: '1.9' }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '19px', fontWeight: '900', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '8px' }}>
                      <span>Payable:</span>
                      <span style={{ color: '#4ade80' }}>₹{finalPayablePrice}</span>
                    </div>
                  </div>

                  <form onSubmit={initiatePaymentGateway} style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '16px' }}>
                    <div style={{ fontSize: '12px', marginBottom: '8px', color: '#cbd5e1' }}>
                      Customer: <b style={{ color: '#fff' }}>{currentUser.name}</b> ({currentUser.phone})
                    </div>
                    <textarea placeholder="Delivery Address with Postal Pincode *" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '14px', boxSizing: 'border-box', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '13px' }} rows="2" required />
                    <button type="submit" className="vibrant-btn" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '14px' }}>
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
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 }}>
          <div className="hyper-card" style={{ width: '92%', maxWidth: '640px', borderRadius: '26px', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#0f172a' }}>
            
            <div style={{ background: 'linear-gradient(90deg, #f43f5e, #8b5cf6)', color: '#fff', padding: '20px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#fbcfe8', fontWeight: '800', letterSpacing: '1px' }}>SECURE GATEWAY CHECKOUT</div>
                <div style={{ fontSize: '18px', fontWeight: '900' }}>My Style Hub Gateway</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#e2e8f0' }}>Total Payable</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff' }}>₹{orderSummary.totalAmount}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: '370px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '18px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={() => setPaymentTab('upi')} 
                  style={{ width: '100%', padding: '13px 14px', borderRadius: '12px', border: 'none', background: paymentTab === 'upi' ? '#f43f5e' : 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: '800', fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}
                >
                  📱 UPI / QR Code
                </button>
                <button 
                  onClick={() => setPaymentTab('card')} 
                  style={{ width: '100%', padding: '13px 14px', borderRadius: '12px', border: 'none', background: paymentTab === 'card' ? '#f43f5e' : 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: '800', fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}
                >
                  💳 Debit / Credit Card
                </button>
                <button 
                  onClick={() => setPaymentTab('netbanking')} 
                  style={{ width: '100%', padding: '13px 14px', borderRadius: '12px', border: 'none', background: paymentTab === 'netbanking' ? '#f43f5e' : 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: '800', fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}
                >
                  🏦 Net Banking
                </button>
              </div>

              <div style={{ padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                
                {paymentTab === 'upi' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>Beneficiary: {ACCOUNT_HOLDER}</div>
                    <div style={{ fontSize: '12px', color: '#f43f5e', marginBottom: '18px' }}>UPI ID: <b>{UPI_ID}</b></div>

                    {!showQrCode ? (
                      <button 
                        onClick={() => setShowQrCode(true)}
                        style={{ background: 'rgba(244, 63, 94, 0.2)', border: '1px solid #f43f5e', color: '#fff', padding: '12px 22px', borderRadius: '12px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', margin: '15px 0' }}
                      >
                        📷 Show QR Code
                      </button>
                    ) : (
                      <div style={{ background: '#fff', border: '2px dashed #cbd5e1', padding: '12px', borderRadius: '16px', display: 'inline-block', marginBottom: '12px' }}>
                        <img src={qrCodeUrl} alt="UPI QR Code" style={{ width: '150px', height: '150px', display: 'block', margin: '0 auto' }} />
                        <div style={{ fontSize: '10px', color: '#0f172a', marginTop: '6px', fontWeight: 'bold' }}>Scan with GPay / PhonePe / Paytm</div>
                      </div>
                    )}

                    <button 
                      onClick={() => finalizeOrder('UPI Verified')} 
                      disabled={isProcessingPay}
                      className="vibrant-btn"
                      style={{ width: '100%', marginTop: '12px', padding: '13px', borderRadius: '12px', fontSize: '14px' }}
                    >
                      {isProcessingPay ? 'Verifying...' : `Pay ₹${orderSummary.totalAmount} & Confirm ✓`}
                    </button>
                  </div>
                )}

                {paymentTab === 'card' && (
                  <form onSubmit={(e) => { e.preventDefault(); finalizeOrder('Card Verified'); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>Card Details</div>
                    <input type="text" placeholder="Card Number (16 Digits)" maxLength="16" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))} required style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff', boxSizing: 'border-box' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <input type="text" placeholder="MM/YY" maxLength="5" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} required style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff', boxSizing: 'border-box' }} />
                      <input type="password" placeholder="CVV" maxLength="3" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))} required style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff', boxSizing: 'border-box' }} />
                    </div>
                    <button type="submit" disabled={isProcessingPay} className="vibrant-btn" style={{ width: '100%', marginTop: '12px', padding: '13px', borderRadius: '12px' }}>
                      {isProcessingPay ? 'Processing...' : `Pay ₹${orderSummary.totalAmount}`}
                    </button>
                  </form>
                )}

                {paymentTab === 'netbanking' && (
                  <form onSubmit={(e) => { e.preventDefault(); finalizeOrder(`NetBanking (${selectedBank})`); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>Select Bank</div>
                    <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #f43f5e', background: 'rgba(0,0,0,0.4)', color: '#fff', fontWeight: '700' }}>
                      <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                      <option value="UCO Bank">UCO Bank</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                    </select>
                    <button type="submit" disabled={isProcessingPay} className="vibrant-btn" style={{ width: '100%', marginTop: '14px', padding: '13px', borderRadius: '12px' }}>
                      {isProcessingPay ? `Connecting to Bank...` : `Pay ₹${orderSummary.totalAmount}`}
                    </button>
                  </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <button onClick={() => setShowPaymentGateway(false)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {completedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300 }}>
          <div style={{ background: '#fff', color: '#0f172a', width: '90%', maxWidth: '500px', padding: '32px', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#f43f5e' }}>MY STYLE HUB</h2>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Order Invoice / Payment Receipt</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Owner: {OWNER_NAME} | {STORE_ADDRESS}</div>
            </div>

            <div style={{ fontSize: '13px', lineHeight: '1.8', marginBottom: '16px' }}>
              <div><b>Customer:</b> {completedOrder.customerName} ({completedOrder.customerPhone})</div>
              <div><b>Delivery Address:</b> {completedOrder.customerAddress}</div>
              <div><b>Payment Method:</b> {completedOrder.paymentMethod}</div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '12px 0', marginBottom: '16px' }}>
              {completedOrder.items && completedOrder.items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '4px 0' }}>
                  <span>{it.name} (Size: {it.selectedSize})</span>
                  <b>₹{it.price}</b>
                </div>
              ))}
              {completedOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#16a34a', fontWeight: 'bold', marginTop: '6px' }}>
                  <span>Coupon Discount</span>
                  <span>-₹{completedOrder.discount}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '19px', fontWeight: '900', marginBottom: '22px' }}>
              <span>Total Paid:</span>
              <span style={{ color: '#16a34a' }}>₹{completedOrder.totalAmount}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => window.print()} style={{ flex: 1, padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>🖨️ Print Receipt</button>
              <button onClick={() => setCompletedOrder(null)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;