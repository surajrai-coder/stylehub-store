import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Navigation & Filter States
  const [currentPage, setCurrentPage] = useState('home');
  const [adminTab, setAdminTab] = useState('products');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemSizes, setItemSizes] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Animated Lucky Wheel States
  const [showLuckySpin, setShowLuckySpin] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [spinReward, setSpinReward] = useState(null);

  // AI Stylist States
  const [aiVibe, setAiVibe] = useState('Summer Neon Street');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);

  // Auth States
  const [currentUser, setCurrentUser] = useState(null);
  const [authModal, setAuthModal] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  // Form Inputs
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');

  // Admin Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Oversized Tees');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // Checkout States
  const [customerAddress, setCustomerAddress] = useState('');
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentTab, setPaymentTab] = useState('upi');
  const [orderSummary, setOrderSummary] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);
  const [showQrCode, setShowQrCode] = useState(false);

  // Simulation Cards
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // Config
  const API_BASE_URL = "https://stylehub-store.onrender.com";
  const UPI_ID = "ksuraj07501@okaxis"; 
  const ACCOUNT_HOLDER = "Suraj Kumar";
  const ADMIN_SECRET = "Suraj6284";
  const SUPPORT_PHONE = "916284319095";
  const SUPPORT_EMAIL = "ksuraj07501@gmail.com";
  const STORE_ADDRESS = "SBLS Nagar, Jalandhar, Punjab";
  const OWNER_NAME = "Suraj Rai";

  const fetchProducts = () => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/api/products`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  };

  const fetchOrders = () => {
    axios.get(`${API_BASE_URL}/api/orders`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    const savedUser = localStorage.getItem('stylehub_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setCurrentUser(parsed);
      const savedWish = localStorage.getItem(`wishlist_${parsed.email}`);
      if (savedWish) setWishlist(JSON.parse(savedWish));
    }
  }, []);

  // LUCKY WHEEL (Only for logged in users & 1 spin per day)
  const openLuckyWheelModal = () => {
    if (!currentUser) {
      alert("⚠️ Lucky Wheel spin karne ke liye pehle Login / Sign Up karein!");
      setAuthModal('login');
      return;
    }

    const todayDate = new Date().toISOString().slice(0, 10);
    const lastSpunDate = localStorage.getItem(`last_spin_${currentUser.email}`);

    if (lastSpunDate === todayDate) {
      alert(`⚠️ Aaj ka lucky spin aap use kar chuke hain! Kal dobara aakar naya discount spin karein.`);
      return;
    }

    setSpinReward(null);
    setShowLuckySpin(true);
  };

  const triggerAnimatedSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Random rotation between 1800 deg to 3600 deg (5 to 10 full circles)
    const randomRot = 1800 + Math.floor(Math.random() * 1800);
    const newTotalRot = wheelRotation + randomRot;
    setWheelRotation(newTotalRot);

    setTimeout(() => {
      setIsSpinning(false);
      const todayDate = new Date().toISOString().slice(0, 10);
      localStorage.setItem(`last_spin_${currentUser.email}`, todayDate);

      // Apply flat ₹200 discount code
      setDiscountAmount(200);
      setAppliedCoupon('STYLE200');
      setSpinReward('🎉 Congratulations! You won Flat ₹200 OFF! Code "STYLE200" applied to your bag.');
    }, 4100);
  };

  const runAiStylist = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      let filtered = products;
      if (aiVibe === 'Summer Neon Street') {
        filtered = products.filter(p => p.category === 'Oversized Tees' || p.category === 'Cargo Pants');
      } else if (aiVibe === 'Winter Aura') {
        filtered = products.filter(p => p.category === 'Hoodies & Jackets');
      } else {
        filtered = products;
      }
      
      const randomFit = filtered.length > 0 
        ? filtered[Math.floor(Math.random() * filtered.length)] 
        : products[0] || { name: 'AI Colorblock Drop-Shoulder Tee', price: 699, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600', category: 'Oversized Tees', description: 'Curated by StyleHub AI Neural Matrix.' };
      
      setAiRecommendation(randomFit);
      setIsGeneratingAi(false);
    }, 1000);
  };

  const handleSizeSelect = (productId, size) => {
    setItemSizes({ ...itemSizes, [productId]: size });
  };

  const toggleWishlist = (product) => {
    if (!currentUser) {
      alert("Wishlist save karne ke liye pehle Login karein!");
      setAuthModal('login');
      return;
    }
    const exists = wishlist.some(item => item._id === product._id);
    let updated = exists ? wishlist.filter(item => item._id !== product._id) : [...wishlist, product];
    setWishlist(updated);
    localStorage.setItem(`wishlist_${currentUser.email}`, JSON.stringify(updated));
  };

  const addToCart = (product) => {
    if (!currentUser) {
      alert("Shopping karne ke liye pehle Login / Sign Up karein!");
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
    if (cleanCode === 'STYLE200') {
      if (rawTotalPrice < 999) {
        alert("Coupon STYLE200 is valid on minimum cart value of ₹999");
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
      alert("Invalid coupon! Try 'STYLE200' or 'FIRST50'");
    }
  };

  const removeCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon('');
    setCouponCode('');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post(`${API_BASE_URL}/api/auth/register`, {
      name: authName,
      email: authEmail.toLowerCase().trim(),
      phone: authPhone,
      password: authPassword
    })
    .then((res) => {
      alert("Account Ban Gaya! Welcome to StyleHub.");
      setCurrentUser(res.data.user);
      localStorage.setItem('stylehub_user', JSON.stringify(res.data.user));
      setAuthModal(null);
      setAuthName('');
      setAuthEmail('');
      setAuthPhone('');
      setAuthPassword('');
    })
    .catch((err) => alert(err.response?.data?.error || "Registration failed. Internet check karein."));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: authEmail.toLowerCase().trim(),
      password: authPassword
    })
    .then((res) => {
      alert("Welcome back, " + res.data.user.name + "!");
      setCurrentUser(res.data.user);
      localStorage.setItem('stylehub_user', JSON.stringify(res.data.user));
      const savedWish = localStorage.getItem(`wishlist_${res.data.user.email}`);
      if (savedWish) setWishlist(JSON.parse(savedWish));
      setAuthModal(null);
      setAuthEmail('');
      setAuthPassword('');
    })
    .catch((err) => {
      alert(err.response?.data?.error || "Account nahi mila! Kripya 'Sign Up' karke pehle account banayein.");
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('stylehub_user');
    setCart([]);
    setWishlist([]);
    alert("Logged out!");
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPin === ADMIN_SECRET) {
      setIsAdminLoggedIn(true);
      setAuthModal(null);
      setCurrentPage('admin');
      fetchOrders();
      setAdminPin('');
    } else {
      alert("Galat Admin Key!");
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name || !price || !category) {
      alert("Title, Price aur Category zaroori hai!");
      return;
    }
    const finalImage = image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800";
    axios.post(`${API_BASE_URL}/api/products`, {
      name,
      price: Number(price),
      category,
      description,
      image: finalImage,
      sizes: ["S", "M", "L", "XL", "XXL"]
    })
    .then(() => {
      alert(`Outfit successfully add ho gaya [${category}] me!`);
      setName('');
      setPrice('');
      setDescription('');
      setImage('');
      fetchProducts();
    })
    .catch((err) => {
      alert("Product add nahi ho paya. Backend MongoDB check karein.");
    });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Delete this outfit?")) {
      axios.delete(`${API_BASE_URL}/api/products/${id}`).then(() => fetchProducts());
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    axios.put(`${API_BASE_URL}/api/orders/${orderId}`, { status: newStatus }).then(() => fetchOrders());
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Delete order record?")) {
      axios.delete(`${API_BASE_URL}/api/orders/${orderId}`).then(() => fetchOrders());
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
      alert("Address daalna zaroori hai!");
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
    const message = `🛍️ *NEW ORDER PLACED!*%0A%0A*Order ID:* ${orderId}%0A*Customer:* ${orderData.customerName}%0A*Phone:* ${orderData.customerPhone}%0A*Address:* ${orderData.customerAddress}%0A%0A*Items Ordered:*%0A${itemsList}%0A%0A*Total Paid:* ₹${orderData.totalAmount}%0A*Payment Method:* ${orderData.paymentMethod}`;
    window.open(`https://wa.me/${SUPPORT_PHONE}?text=${message}`, '_blank');
  };

  const finalizeOrder = (methodUsed) => {
    setIsProcessingPay(true);
    setTimeout(() => {
      const orderData = {
        ...orderSummary,
        paymentMethod: methodUsed,
        utrNumber: `AURA-TXN-${Math.floor(100000 + Math.random() * 900000)}`
      };

      axios.post(`${API_BASE_URL}/api/orders`, orderData)
      .then((res) => {
        setIsProcessingPay(false);
        const orderId = res.data.order?._id || `ORD-${Date.now()}`;
        alert(`Payment Success! Order Placed.`);
        sendWhatsAppNotification(orderData, orderId);
        setCompletedOrder({ ...orderData, _id: orderId, createdAt: new Date() });
        setCart([]);
        setShowPaymentGateway(false);
        setCustomerAddress('');
        setCardNumber('');
        setCardExpiry('');
        setCardCvv('');
        setDiscountAmount(0);
        setAppliedCoupon('');
        fetchOrders();
      })
      .catch(() => {
        setIsProcessingPay(false);
        alert("Payment Error. Please try again.");
      });
    }, 1000);
  };

  const categoriesList = ['All', 'Oversized Tees', 'Cargo Pants', 'Hoodies & Jackets', 'Casual Shirts'];

  const categoryCards = [
    { title: 'Graphic Oversized Tees', category: 'Oversized Tees', count: '18+ Drops', tag: '🔥 POPULAR', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600' },
    { title: 'Utility Cargo Pants', category: 'Cargo Pants', count: '10+ Fits', tag: '⚡ STYLIST PICK', image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600' },
    { title: 'Winter Fleece & Jackets', category: 'Hoodies & Jackets', count: '14+ Drops', tag: '❄️ WINTER', image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600' },
    { title: 'Vibrant Casual Shirts', category: 'Casual Shirts', count: '12+ Styles', tag: '✨ COLOR EDITION', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600' }
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
      
      {/* BACKGROUND FLOATING LIGHT BLOBS */}
      <div className="bg-ambient-lights">
        <div className="glow-sphere-1"></div>
        <div className="glow-sphere-2"></div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        
        {/* RUNNING MARQUEE & FLASH COUNTDOWN */}
        <div style={{ background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)', padding: '10px 0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(236,72,153,0.3)' }}>
          <div className="marquee-track">
            <div style={{ color: '#ffffff', fontWeight: '900', fontSize: '12px', letterSpacing: '2px', display: 'inline-flex', gap: '35px', marginRight: '35px' }}>
              <span>🎁 SIGN IN & SPIN DAILY LUCKY WHEEL FOR UP TO ₹200 OFF</span>
              <span>🔥 240+ GSM COMBED COTTON OVERSIZED FITS</span>
              <span>📦 FREE PAN-INDIA EXPRESS SHIPPING</span>
              <span>⚡ USE CODE 'STYLE200' FOR FLAT ₹200 OFF</span>
            </div>
          </div>
        </div>

        {/* GLASS NAVBAR */}
        <header style={{ background: 'rgba(15, 23, 42, 0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', position: 'sticky', top: 0, zIndex: 100, padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => { setCurrentPage('home'); setSelectedCategory('All'); setSearchQuery(''); }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'linear-gradient(135deg, #f43f5e, #8b5cf6, #06b6d4)', boxShadow: '0 0 25px rgba(244, 63, 94, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '900', fontSize: '20px' }}>
              ✨
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
                <button onClick={() => setAuthModal('login')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '9px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '12px' }}>Login</button>
                <button onClick={() => setAuthModal('register')} className="vibrant-btn" style={{ padding: '9px 20px', borderRadius: '12px', fontSize: '12px' }}>Sign Up</button>
              </div>
            )}

            <div 
              onClick={() => {
                if (!currentUser) {
                  alert("Pehle Login karein!");
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

        {/* --- MAIN PAGE CONTENT --- */}
        {(currentPage === 'home' || currentPage === 'shop') && (
          <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 60px 20px' }}>
            
            {/* HERO BANNER */}
            {currentPage === 'home' && !searchQuery && (
              <section className="hyper-card" style={{ margin: '26px 0 50px 0', padding: '50px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'center' }}>
                <div>
                  <span style={{ display: 'inline-block', background: 'linear-gradient(90deg, #f43f5e, #8b5cf6)', color: '#fff', padding: '7px 20px', borderRadius: '30px', fontSize: '12px', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '18px', boxShadow: '0 4px 15px rgba(244, 63, 94, 0.4)' }}>
                    🔥 AUTUMN 2026 COLOR DROP
                  </span>

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
                    alt="Colorful Streetwear Model" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)', padding: '12px 18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#f43f5e', fontWeight: '800' }}>FEATURED COLOR DROP</div>
                      <div style={{ fontSize: '15px', fontWeight: '900', color: '#fff' }}>Neon Sunset Oversized Fit</div>
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#4ade80' }}>₹799</span>
                  </div>
                </div>
              </section>
            )}

            {/* CURATED CATEGORIES MATRIX */}
            {currentPage === 'home' && !searchQuery && (
              <section style={{ marginBottom: '60px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#f43f5e', letterSpacing: '2px', textTransform: 'uppercase' }}>COLLECTIONS MATRIX</span>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: '4px 0 0 0' }}>Explore By Category</h2>
                  </div>
                  <span onClick={() => setCurrentPage('categories')} style={{ fontSize: '14px', fontWeight: '800', color: '#f43f5e', cursor: 'pointer', background: 'rgba(244,63,94,0.1)', padding: '6px 14px', borderRadius: '10px' }}>
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
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(8,12,22,0.95) 90%)' }}></div>
                      
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

            {/* PRODUCT CATALOG GRID */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#f43f5e', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    {searchQuery ? `SEARCH RESULTS` : 'FRESH STREETWEAR DROPS'}
                  </span>
                  <h2 style={{ fontSize: '30px', fontWeight: '900', color: '#ffffff', margin: '4px 0 0 0' }}>
                    {searchQuery ? `"${searchQuery}" (${filteredProducts.length})` : selectedCategory === 'All' ? 'All Vibrant Drops' : selectedCategory}
                  </h2>
                </div>
                {(selectedCategory !== 'All' || searchQuery) && (
                  <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', padding: '9px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '13px' }}>
                    Reset Filters ✕
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setSearchQuery(''); }}
                    style={{
                      padding: '11px 24px',
                      borderRadius: '14px',
                      border: '1px solid',
                      borderColor: selectedCategory === cat ? '#f43f5e' : 'rgba(255,255,255,0.15)',
                      background: selectedCategory === cat ? 'linear-gradient(135deg, #f43f5e, #8b5cf6)' : 'rgba(255,255,255,0.06)',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: '800',
                      fontSize: '13px'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products Rendering */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '90px 20px', color: '#cbd5e1' }}>
                  <div style={{ fontSize: '40px', marginBottom: '14px' }}>✨</div>
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
                          
                          <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', color: '#38bdf8', fontSize: '11px', padding: '6px 14px', borderRadius: '10px', fontWeight: '800', border: '1px solid rgba(255,255,255,0.15)' }}>
                            {item.category || 'Streetwear'}
                          </span>

                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }} 
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px' }}
                          >
                            {isWishlisted ? '❤️' : '🤍'}
                          </button>

                          <button 
                            onClick={() => setQuickViewProduct(item)} 
                            style={{ position: 'absolute', bottom: '14px', right: '14px', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', padding: '7px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', color: '#fff', cursor: 'pointer' }}
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

        {/* FULLY ROTATING ANIMATED LUCKY WHEEL MODAL */}
        {showLuckySpin && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(16px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 }}>
            <div className="hyper-card" style={{ width: '92%', maxWidth: '440px', padding: '36px 24px', textAlign: 'center', background: '#0f172a' }}>
              
              <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', margin: '0 0 6px 0' }}>🎡 Daily Lucky Spin Wheel</h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '22px' }}>
                Signed in as <b>{currentUser?.name}</b> (1 Spin / Day)
              </p>

              {/* ROTATING WHEEL COMPONENT */}
              <div className="wheel-wrapper">
                <div className="wheel-pointer"></div>
                <div 
                  className="wheel-disc"
                  style={{ transform: `rotate(${wheelRotation}deg)` }}
                >
                  <div className="wheel-center-pin">SPIN</div>
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
                  {isSpinning ? '🎡 SPINNING THE WHEEL...' : '🎯 TAP TO SPIN NOW'}
                </button>
              )}

              <button onClick={() => setShowLuckySpin(false)} style={{ marginTop: '16px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}>Close Window ✕</button>
            </div>
          </div>
        )}

        {/* WISHLIST VIEW */}
        {currentPage === 'wishlist' && (
          <main style={{ maxWidth: '1260px', margin: '30px auto', padding: '0 20px 60px 20px' }}>
            <h2 style={{ fontSize: '30px', fontWeight: '900', color: '#fff', marginBottom: '24px' }}>Saved Wishlist ({wishlist.length})</h2>
            {wishlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '90px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', color: '#cbd5e1' }}>
                <p>Wishlist empty hai. Heart icon click karke save karein!</p>
                <button onClick={() => setCurrentPage('shop')} className="vibrant-btn" style={{ marginTop: '14px', padding: '12px 24px', borderRadius: '12px' }}>Explore Outfits</button>
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

        {/* MY ORDERS VIEW */}
        {currentPage === 'myOrders' && currentUser && (
          <main style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px 60px 20px' }}>
            <h2 style={{ fontSize: '30px', fontWeight: '900', color: '#fff', marginBottom: '24px' }}>My Orders History</h2>
            {userOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '90px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', color: '#cbd5e1' }}>
                <p>Aapne abhi tak koi order place nahi kiya hai.</p>
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
                      <div style={{ background: ord.status === 'Delivered' ? 'rgba(34, 197, 94, 0.25)' : ord.status === 'Shipped' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(234, 179, 8, 0.25)', color: ord.status === 'Delivered' ? '#4ade80' : ord.status === 'Shipped' ? '#a5b4fc' : '#facc15', border: '1px solid currentColor', padding: '6px 16px', borderRadius: '30px', fontWeight: '800', fontSize: '12px' }}>
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

        {/* CATEGORIES VIEW */}
        {currentPage === 'categories' && (
          <main style={{ maxWidth: '1260px', margin: '30px auto', padding: '0 20px 60px 20px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', marginBottom: '26px' }}>All Streetwear Collections</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '26px' }}>
              {categoryCards.map((c, i) => (
                <div key={i} onClick={() => { setSelectedCategory(c.category); setCurrentPage('shop'); }} className="hyper-card" style={{ height: '340px' }}>
                  <img src={c.image} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, transparent 30%, rgba(8,12,22,0.95) 100%)' }}></div>
                  <div style={{ position: 'absolute', bottom: '22px', left: '22px', right: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#fff', fontSize: '22px', fontWeight: '900' }}>{c.title}</div>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#fff', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>↗</div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* ADMIN DASHBOARD */}
        {currentPage === 'admin' && isAdminLoggedIn && (
          <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px 60px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '18px' }}>
              <h2 style={{ fontSize: '26px', margin: 0, fontWeight: '900', color: '#fff' }}>Admin Dashboard</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setAdminTab('orders')} style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '800', background: adminTab === 'orders' ? '#f43f5e' : 'rgba(255,255,255,0.15)', color: '#fff' }}>Orders ({orders.length})</button>
                <button onClick={() => setAdminTab('products')} style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '800', background: adminTab === 'products' ? '#f43f5e' : 'rgba(255,255,255,0.15)', color: '#fff' }}>Catalog ({products.length})</button>
                <button onClick={() => { setIsAdminLoggedIn(false); setCurrentPage('home'); }} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800' }}>Exit Admin</button>
              </div>
            </div>

            {adminTab === 'orders' ? (
              <div style={{ marginTop: '26px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'rgba(15,23,42,0.85)', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '14px' }}>Customer</th>
                      <th style={{ padding: '14px' }}>Items</th>
                      <th style={{ padding: '14px' }}>Total</th>
                      <th style={{ padding: '14px' }}>Payment</th>
                      <th style={{ padding: '14px' }}>Status</th>
                      <th style={{ padding: '14px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <td style={{ padding: '14px' }}><b>{o.customerName}</b><br/>{o.customerPhone}<br/><small style={{ color: '#cbd5e1' }}>{o.customerAddress}</small></td>
                        <td style={{ padding: '14px' }}>{o.items && o.items.map((it, idx) => (<div key={idx}>• {it.name} ({it.selectedSize})</div>))}</td>
                        <td style={{ padding: '14px', color: '#4ade80', fontWeight: '800' }}>₹{o.totalAmount}</td>
                        <td style={{ padding: '14px' }}><small style={{ color: '#38bdf8' }}>{o.paymentMethod}</small></td>
                        <td style={{ padding: '14px' }}>
                          <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)} style={{ padding: '6px', background: '#0f172a', color: '#fff', border: '1px solid #f43f5e', borderRadius: '6px' }}>
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <button onClick={() => handleDeleteOrder(o._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ marginTop: '26px' }}>
                <form onSubmit={handleAddProduct} className="hyper-card" style={{ padding: '26px', marginBottom: '26px' }}>
                  <h3 style={{ margin: '0 0 18px 0', color: '#fff' }}>Add New Outfit</h3>
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

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'rgba(15,23,42,0.85)', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '12px' }}>Image</th>
                      <th style={{ padding: '12px' }}>Name</th>
                      <th style={{ padding: '12px' }}>Category</th>
                      <th style={{ padding: '12px' }}>Price</th>
                      <th style={{ padding: '12px' }}>Action</th>
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

      {/* FOOTER */}
      <footer style={{ background: 'rgba(8, 12, 22, 0.95)', color: '#cbd5e1', padding: '60px 40px 25px 40px', borderTop: '1px solid rgba(255,255,255,0.15)', position: 'relative', zIndex: 1 }}>
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
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 12px 0' }}>Subscribe to get color drop alerts & flat ₹200 discount codes.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed to VIP drops!"); setNewsletterEmail(''); }} style={{ display: 'flex', gap: '8px' }}>
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
          <div>Crafted with ❤️ for India's Youth Fashion Culture</div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP CHAT */}
      <a 
        href={`https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent('Hi My Style Hub! Mujhe ek outfit ke baare me inquiry karni hai.')}`}
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

      {/* QUICK VIEW MODAL */}
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

      {/* AUTH MODAL */}
      {authModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 }}>
          <div className="hyper-card" style={{ width: '90%', maxWidth: '400px', padding: '34px', background: '#0f172a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#fff' }}>
                {authModal === 'login' ? 'User Login' : authModal === 'register' ? 'Join StyleHub (Sign Up)' : 'Admin Passcode'}
              </h3>
              <button onClick={() => setAuthModal(null)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            {authModal === 'register' && (
              <form onSubmit={handleRegister}>
                <input type="text" placeholder="Full Name" value={authName} onChange={(e) => setAuthName(e.target.value)} required style={{ width: '100%', padding: '12px 16px', marginBottom: '12px', boxSizing: 'border-box', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '13px' }} />
                <input type="email" placeholder="Email Address" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required style={{ width: '100%', padding: '12px 16px', marginBottom: '12px', boxSizing: 'border-box', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '13px' }} />
                <input type="tel" placeholder="Phone Number" value={authPhone} onChange={(e) => setAuthPhone(e.target.value)} required style={{ width: '100%', padding: '12px 16px', marginBottom: '12px', boxSizing: 'border-box', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '13px' }} />
                <input type="password" placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required style={{ width: '100%', padding: '12px 16px', marginBottom: '18px', boxSizing: 'border-box', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '13px' }} />
                <button type="submit" className="vibrant-btn" style={{ width: '100%', padding: '13px', borderRadius: '12px' }}>Create Account</button>
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#cbd5e1' }}>
                  Already have an account? <span onClick={() => setAuthModal('login')} style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: 'bold' }}>Login here</span>
                </div>
              </form>
            )}

            {authModal === 'login' && (
              <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email Address" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required style={{ width: '100%', padding: '12px 16px', marginBottom: '12px', boxSizing: 'border-box', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '13px' }} />
                <input type="password" placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required style={{ width: '100%', padding: '12px 16px', marginBottom: '18px', boxSizing: 'border-box', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '13px' }} />
                <button type="submit" className="vibrant-btn" style={{ width: '100%', padding: '13px', borderRadius: '12px' }}>Sign In</button>
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#cbd5e1' }}>
                  Naya account banana hai? <span onClick={() => setAuthModal('register')} style={{ color: '#f43f5e', cursor: 'pointer', fontWeight: 'bold' }}>Sign Up yahan karein</span>
                </div>
              </form>
            )}

            {authModal === 'adminLogin' && (
              <form onSubmit={handleAdminLogin}>
                <input 
                  type="password" 
                  placeholder="Enter Secret Key" 
                  value={adminPin} 
                  onChange={(e) => setAdminPin(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '12px 16px', marginBottom: '18px', boxSizing: 'border-box', borderRadius: '12px', border: '1px solid #f43f5e', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '13px' }} 
                />
                <button type="submit" className="vibrant-btn" style={{ width: '100%', padding: '13px', borderRadius: '12px' }}>Unlock Admin Panel</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CART DRAWER */}
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
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '8px' }}>PROMO CODE: (Use: STYLE200)</div>
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
                    <textarea placeholder="Delivery Address with Pincode *" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '14px', boxSizing: 'border-box', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '13px' }} rows="2" required />
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

      {/* PAYMENT GATEWAY MODAL */}
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
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>Pay to: {ACCOUNT_HOLDER}</div>
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

      {/* RECEIPT MODAL */}
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