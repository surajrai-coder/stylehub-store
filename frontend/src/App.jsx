import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Navigation & Filter States
  const [currentPage, setCurrentPage] = useState('home');
  const [adminTab, setAdminTab] = useState('products');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemSizes, setItemSizes] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Auth States
  const [currentUser, setCurrentUser] = useState(null);
  const [authModal, setAuthModal] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Coupon Engine States
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

  // Checkout & Payment Modal States
  const [customerAddress, setCustomerAddress] = useState('');
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentTab, setPaymentTab] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [orderSummary, setOrderSummary] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);
  const [showQrCode, setShowQrCode] = useState(false); // Controlled QR view state

  // Card / Net Banking Simulation Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('UCO Bank');
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // Verified Business Details
  const STORE_NAME = "My Style Hub";
  const UPI_ID = "ksuraj07501@okaxis"; 
  const ACCOUNT_HOLDER = "Suraj Kumar";
  const ADMIN_SECRET = "Suraj6284";
  const SUPPORT_PHONE = "916284319095";
  const SUPPORT_EMAIL = "ksuraj07501@gmail.com";
  const STORE_ADDRESS = "SBLS Nagar, Jalandhar, Punjab";
  const OWNER_NAME = "Suraj Rai";

  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  const fetchOrders = () => {
    axios.get('http://localhost:5000/api/orders')
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
    let updated;
    if (exists) {
      updated = wishlist.filter(item => item._id !== product._id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    localStorage.setItem(`wishlist_${currentUser.email}`, JSON.stringify(updated));
  };

  const addToCart = (product) => {
    if (!currentUser) {
      alert("Shopping karne ke liye pehle Login / Account create karein!");
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
      alert("Invalid coupon code! Try 'STYLE200' or 'FIRST50'");
    }
  };

  const removeCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon('');
    setCouponCode('');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/auth/register', {
      name: authName,
      email: authEmail,
      phone: authPhone,
      password: authPassword
    })
    .then((res) => {
      alert("Account Created Successfully!");
      setCurrentUser(res.data.user);
      localStorage.setItem('stylehub_user', JSON.stringify(res.data.user));
      setAuthModal(null);
      setAuthName('');
      setAuthEmail('');
      setAuthPhone('');
      setAuthPassword('');
    })
    .catch((err) => alert(err.response?.data?.error || "Registration failed."));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/auth/login', {
      email: authEmail,
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
    .catch((err) => alert(err.response?.data?.error || "Invalid Credentials"));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('stylehub_user');
    setCart([]);
    setWishlist([]);
    alert("Logged out successfully!");
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
      alert("Galat Admin Passcode!");
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name || !price || !category) {
      alert("Title, Price aur Category select karna zaroori hai!");
      return;
    }
    axios.post('http://localhost:5000/api/products', {
      name,
      price: Number(price),
      category: category,
      description,
      image,
      sizes: ["S", "M", "L", "XL", "XXL"]
    })
    .then(() => {
      alert(`Product successfully [${category}] category me add ho gaya!`);
      setName('');
      setPrice('');
      setDescription('');
      setImage('');
      fetchProducts();
    })
    .catch(() => alert("Failed to add product."));
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Delete this outfit?")) {
      axios.delete(`http://localhost:5000/api/products/${id}`)
        .then(() => fetchProducts());
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: newStatus })
      .then(() => fetchOrders());
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Delete order?")) {
      axios.delete(`http://localhost:5000/api/orders/${orderId}`).then(() => fetchOrders());
    }
  };

  const removeFromCart = (index) => setCart(cart.filter((_, i) => i !== index));
  
  const rawTotalPrice = cart.reduce((total, item) => total + item.price, 0);
  const finalPayablePrice = Math.max(0, rawTotalPrice - discountAmount);

  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(ACCOUNT_HOLDER)}&am=${finalPayablePrice}&cu=INR&tn=${encodeURIComponent('MyStyleHub Order')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl)}`;

  const initiatePaymentGateway = (e) => {
    e.preventDefault();
    if (!customerAddress) {
      alert("Delivery address daalna zaroori hai!");
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
    setShowQrCode(false); // Reset QR toggle on modal open
    setIsCartOpen(false);
    setShowPaymentGateway(true);
  };

  // Immediate Order Placement upon payment confirmation
  const finalizeOrder = (methodUsed) => {
    setIsProcessingPay(true);
    setTimeout(() => {
      const orderData = {
        ...orderSummary,
        paymentMethod: methodUsed,
        utrNumber: `ONLINE-TXN-${Math.floor(100000 + Math.random() * 900000)}`
      };

      axios.post('http://localhost:5000/api/orders', orderData)
      .then((res) => {
        setIsProcessingPay(false);
        alert(`Payment Successful! Order Placed Successfully.`);
        setCompletedOrder({ ...orderData, _id: res.data.order?._id || `ORD-${Date.now()}`, createdAt: new Date() });
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
        alert("Order processing failed. Please try again.");
      });
    }, 1000);
  };

  const handleCardPayment = (e) => {
    e.preventDefault();
    if (cardNumber.length < 16 || cardCvv.length < 3) {
      alert("Kripya valid card details enter karein!");
      return;
    }
    finalizeOrder('Card (Debit/Credit)');
  };

  const handleNetBankingPayment = (e) => {
    e.preventDefault();
    finalizeOrder(`NetBanking (${selectedBank})`);
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      alert("Thank you for subscribing! Check your email for exclusive VIP drop alerts.");
      setNewsletterEmail('');
    }
  };

  const categoriesList = ['All', 'Oversized Tees', 'Cargo Pants', 'Hoodies & Jackets', 'Casual Shirts'];

  const categoryCards = [
    { title: 'Oversized Tees', category: 'Oversized Tees', count: '12+ Fits', tag: '🔥 TRENDING', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600' },
    { title: 'Cargo Pants', category: 'Cargo Pants', count: '8+ Styles', tag: '⚡ TOP CHOICE', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600' },
    { title: 'Jackets & Hoodies', category: 'Hoodies & Jackets', count: '15+ Drops', tag: '❄️ WINTER', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600' },
    { title: 'Casual Shirts', category: 'Casual Shirts', count: '10+ Patterns', tag: '✨ PREMIUM', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600' }
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#f8fafc' }}>
      
      <div>
        {/* RUNNING MARQUEE BANNER */}
        <div className="marquee-container">
          <div className="marquee-track">
            <div className="marquee-item">🔥 AUTUMN 2026 STREETWEAR DROP LIVE</div>
            <div className="marquee-item">⚡ USE CODE 'STYLE200' FOR FLAT ₹200 OFF</div>
            <div className="marquee-item">✨ 100% PURE 240+ GSM COTTON</div>
            <div className="marquee-item">📦 FREE SHIPPING ON PREPAID ORDERS</div>
            <div className="marquee-item">🔥 AUTUMN 2026 STREETWEAR DROP LIVE</div>
            <div className="marquee-item">⚡ USE CODE 'STYLE200' FOR FLAT ₹200 OFF</div>
            <div className="marquee-item">✨ 100% PURE 240+ GSM COTTON</div>
            <div className="marquee-item">📦 FREE SHIPPING ON PREPAID ORDERS</div>
          </div>
        </div>

        {/* GLASSMORPHIC NAVBAR */}
        <header style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100, padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)', flexWrap: 'wrap', gap: '14px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => { setCurrentPage('home'); setSelectedCategory('All'); setSearchQuery(''); }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 6px 16px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '900', fontSize: '15px' }}>
              SH
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.6px', lineHeight: '1.1' }}>MY STYLE <span style={{ color: '#2563eb' }}>HUB</span></div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Men & Boys Studio</div>
            </div>
          </div>

          <div style={{ flex: '1', maxWidth: '320px', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search cargos, tees, hoodies..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); if (currentPage !== 'shop' && currentPage !== 'home') setCurrentPage('shop'); }}
              style={{ width: '100%', padding: '10px 16px 10px 38px', borderRadius: '25px', border: '1.5px solid #cbd5e1', fontSize: '13px', background: '#f8fafc', outline: 'none' }}
            />
            <span style={{ position: 'absolute', left: '14px', top: '9px', fontSize: '14px', color: '#94a3b8' }}>🔍</span>
            {searchQuery && (
              <span onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '14px', top: '9px', fontSize: '12px', cursor: 'pointer', color: '#94a3b8', fontWeight: 'bold' }}>✕</span>
            )}
          </div>

          <nav style={{ display: 'flex', gap: '22px', fontSize: '14px', fontWeight: '800', color: '#475569' }}>
            <span style={{ cursor: 'pointer', color: currentPage === 'home' ? '#2563eb' : 'inherit' }} onClick={() => { setCurrentPage('home'); setSelectedCategory('All'); }}>Home</span>
            <span style={{ cursor: 'pointer', color: currentPage === 'shop' ? '#2563eb' : 'inherit' }} onClick={() => { setCurrentPage('shop'); setSelectedCategory('All'); }}>Shop</span>
            <span style={{ cursor: 'pointer', color: currentPage === 'categories' ? '#2563eb' : 'inherit' }} onClick={() => setCurrentPage('categories')}>Categories</span>
            {currentUser && (
              <span style={{ cursor: 'pointer', color: currentPage === 'myOrders' ? '#2563eb' : 'inherit' }} onClick={() => setCurrentPage('myOrders')}>My Orders ({userOrders.length})</span>
            )}
            <span style={{ cursor: 'pointer', color: currentPage === 'about' ? '#2563eb' : 'inherit' }} onClick={() => setCurrentPage('about')}>About</span>
            <span style={{ cursor: 'pointer', color: currentPage === 'contact' ? '#2563eb' : 'inherit' }} onClick={() => setCurrentPage('contact')}>Contact</span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            <div 
              onClick={() => setCurrentPage('wishlist')} 
              style={{ cursor: 'pointer', position: 'relative', width: '38px', height: '38px', borderRadius: '10px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
              title="View Wishlist"
            >
              ❤️
              {wishlist.length > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ec4899', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {wishlist.length}
                </span>
              )}
            </div>

            <button 
              onClick={() => {
                if (isAdminLoggedIn) setCurrentPage('admin');
                else setAuthModal('adminLogin');
              }}
              style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '12px', color: '#334155' }}
            >
              🔒 Admin
            </button>

            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '4px 12px', borderRadius: '20px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#1e40af' }}>👤 {currentUser.name.split(' ')[0]}</span>
                <button onClick={handleLogout} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '3px 6px', borderRadius: '10px', cursor: 'pointer', fontSize: '10px', fontWeight: '800' }}>Logout</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setAuthModal('login')} style={{ background: '#fff', border: '1.5px solid #cbd5e1', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '12px' }}>Login</button>
                <button onClick={() => setAuthModal('register')} className="shimmer-btn" style={{ color: '#fff', border: 'none', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '12px' }}>Sign Up</button>
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
              style={{ position: 'relative', cursor: 'pointer', background: '#0f172a', color: '#fff', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              🛒
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: '#fff', borderRadius: '50%', width: '19px', height: '19px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', border: '2px solid #fff' }}>
                {cart.length}
              </span>
            </div>
          </div>
        </header>

        {/* --- MAIN PAGE ROUTING --- */}
        {(currentPage === 'home' || currentPage === 'shop') && (
          <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px 60px 20px' }}>
            
            {currentPage === 'home' && !searchQuery && (
              <section className="live-hero-bg" style={{ margin: '26px 0 50px 0', borderRadius: '28px', overflow: 'hidden', color: '#fff', padding: '55px 45px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'center', boxShadow: '0 25px 50px -10px rgba(37,99,235,0.35)', position: 'relative' }}>
                <div>
                  <span className="pulse-badge" style={{ display: 'inline-block', background: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.5)', padding: '7px 18px', borderRadius: '30px', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '18px', color: '#38bdf8' }}>
                    ✦ EXCLUSIVE 2026 DROP LIVE
                  </span>

                  <h1 style={{ fontSize: '46px', fontWeight: '900', margin: '0 0 14px 0', letterSpacing: '-1.2px', lineHeight: '1.15' }}>
                    REDEFINE YOUR <span style={{ background: 'linear-gradient(90deg, #38bdf8, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>STREETWEAR</span>
                  </h1>

                  <p style={{ fontSize: '15px', color: '#cbd5e1', margin: '0 0 28px 0', lineHeight: '1.6', fontWeight: '500', maxWidth: '480px' }}>
                    Heavyweight 240+ GSM pure cotton oversized tees, tactical utility cargo pants & premium relaxed fit jackets.
                  </p>

                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => setCurrentPage('shop')} 
                      style={{ background: '#fff', color: '#0f172a', border: 'none', padding: '13px 30px', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(255,255,255,0.3)' }}
                    >
                      Shop All Drops →
                    </button>
                    <button 
                      onClick={() => { setSelectedCategory('Cargo Pants'); setCurrentPage('shop'); }} 
                      style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '13px 26px', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
                    >
                      Explore Cargos 👖
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '24px', marginTop: '35px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>✨ 100% Pure Cotton</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>⚡ Multi-Payment Gateway</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>📦 Pan-India Shipping</div>
                  </div>
                </div>

                <div className="floating-model" style={{ position: 'relative', height: '370px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.2)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800" 
                    alt="Streetwear Look" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', padding: '10px 18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>FEATURED FIT</div>
                    <div style={{ fontSize: '14px', fontWeight: '900', color: '#fff' }}>Acid Wash + Baggy Cargo</div>
                  </div>
                </div>
              </section>
            )}

            {(currentPage === 'home' && !searchQuery) && (
              <section style={{ marginBottom: '55px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '22px' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Curated Selections</span>
                    <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: '4px 0 0 0', letterSpacing: '-0.5px' }}>Shop by Categories</h2>
                  </div>
                  <span onClick={() => setCurrentPage('categories')} style={{ fontSize: '14px', fontWeight: '800', color: '#2563eb', cursor: 'pointer' }}>
                    View All Categories →
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '22px' }}>
                  {categoryCards.map((c, i) => (
                    <div 
                      key={i} 
                      onClick={() => { setSelectedCategory(c.category); setCurrentPage('shop'); }}
                      className="interactive-card"
                      style={{
                        position: 'relative',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        height: '290px',
                        cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                        border: selectedCategory === c.category ? '3px solid #2563eb' : '1px solid #e2e8f0'
                      }}
                    >
                      <img src={c.image} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 30%, rgba(15,23,42,0.85) 100%)' }}></div>
                      
                      <div style={{ position: 'absolute', top: '16px', left: '16px', fontWeight: '800', fontSize: '11px', color: '#0f172a', background: 'rgba(255,255,255,0.92)', padding: '5px 12px', borderRadius: '8px' }}>
                        {c.tag}
                      </div>

                      <div style={{ position: 'absolute', bottom: '18px', left: '18px', right: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: '#fff', fontSize: '19px', fontWeight: '900' }}>{c.title}</div>
                          <div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '700' }}>{c.count}</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px' }}>
                          ↗
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PRODUCT CATALOG */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                    {searchQuery ? `Searching for "${searchQuery}"` : 'Featured Releases'}
                  </span>
                  <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: '4px 0 0 0', letterSpacing: '-0.5px' }}>
                    {searchQuery ? `Search Results (${filteredProducts.length})` : selectedCategory === 'All' ? 'Best Sellers & New Drops' : `${selectedCategory}`}
                  </h2>
                </div>
                {(selectedCategory !== 'All' || searchQuery) && (
                  <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} style={{ background: '#fff', border: '1.5px solid #cbd5e1', color: '#0f172a', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '13px' }}>
                    Reset Filters ✕
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setSearchQuery(''); }}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '12px',
                      border: '1.5px solid',
                      borderColor: selectedCategory === cat ? '#2563eb' : '#cbd5e1',
                      background: selectedCategory === cat ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#fff',
                      color: selectedCategory === cat ? '#fff' : '#475569',
                      cursor: 'pointer',
                      fontWeight: '800',
                      fontSize: '13px',
                      boxShadow: selectedCategory === cat ? '0 6px 16px rgba(37,99,235,0.3)' : '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '24px', border: '2px dashed #cbd5e1', color: '#64748b' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>👕</div>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Koi outfit nahi mila!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '28px' }}>
                  {filteredProducts.map((item) => {
                    const currentSize = itemSizes[item._id] || 'L';
                    const originalPrice = Math.round(item.price * 1.6);
                    const isWishlisted = wishlist.some(w => w._id === item._id);

                    return (
                      <div key={item._id} className="interactive-card" style={{ background: '#fff', borderRadius: '22px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 24px -6px rgba(0,0,0,0.06)' }}>
                        
                        <div style={{ position: 'relative', overflow: 'hidden', height: '320px', background: '#f1f5f9' }}>
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          
                          <span style={{ position: 'absolute', top: '14px', left: '14px', background: '#0f172a', color: '#fff', fontSize: '11px', padding: '5px 12px', borderRadius: '8px', fontWeight: '800' }}>
                            {item.category || 'Streetwear'}
                          </span>

                          <button 
                            onClick={() => toggleWishlist(item)} 
                            style={{ position: 'absolute', top: '14px', right: '14px', background: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', fontSize: '16px' }}
                          >
                            {isWishlisted ? '❤️' : '🤍'}
                          </button>

                          <button 
                            onClick={() => setQuickViewProduct(item)} 
                            style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(255,255,255,0.92)', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', color: '#0f172a', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                          >
                            👁️ Quick View
                          </button>
                        </div>

                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                          <div>
                            <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>{item.name}</h4>
                            
                            <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '800', marginBottom: '8px' }}>
                              🔥 Only 3 left in stock! • 14 bought today
                            </div>

                            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 14px 0', lineHeight: '1.5' }}>{item.description || '240 GSM Pure Cotton drop-shoulder fit.'}</p>
                            
                            <div style={{ marginBottom: '14px' }}>
                              <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Select Size:</span>
                              <div style={{ display: 'flex', gap: '7px', marginTop: '8px' }}>
                                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                                  <button
                                    key={sz}
                                    onClick={() => handleSizeSelect(item._id, sz)}
                                    style={{
                                      width: '34px',
                                      height: '34px',
                                      borderRadius: '8px',
                                      border: currentSize === sz ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                      background: currentSize === sz ? '#eff6ff' : '#fff',
                                      color: currentSize === sz ? '#2563eb' : '#334155',
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

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                            <div>
                              <div style={{ fontSize: '21px', fontWeight: '900', color: '#0f172a' }}>₹{item.price}</div>
                              <div style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through', fontWeight: '700' }}>₹{originalPrice}</div>
                            </div>
                            
                            <button 
                              onClick={() => addToCart(item)}
                              className="shimmer-btn"
                              style={{ color: '#fff', border: 'none', padding: '11px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '13px', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
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

        {/* WISHLIST VIEW */}
        {currentPage === 'wishlist' && (
          <main style={{ maxWidth: '1240px', margin: '30px auto', padding: '0 20px 60px 20px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '20px' }}>Your Saved Wishlist ({wishlist.length})</h2>
            {wishlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '20px', color: '#64748b' }}>
                <p>Aapka wishlist khali hai. Heart icon click karke outfits save karein!</p>
                <button onClick={() => setCurrentPage('shop')} style={{ marginTop: '10px', padding: '10px 20px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Explore Outfits</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                {wishlist.map((item) => (
                  <div key={item._id} style={{ background: '#fff', borderRadius: '18px', overflow: 'hidden', border: '1px solid #e2e8f0', padding: '16px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '12px' }} />
                    <h4 style={{ margin: '10px 0 4px 0', fontSize: '16px', fontWeight: '800' }}>{item.name}</h4>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: '#2563eb', marginBottom: '10px' }}>₹{item.price}</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => addToCart(item)} style={{ flex: 1, padding: '9px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Move to Bag 🛍️</button>
                      <button onClick={() => toggleWishlist(item)} style={{ padding: '9px 14px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
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
            <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '20px' }}>My Orders History</h2>
            {userOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '20px', color: '#64748b' }}>
                <p>Aapne abhi tak koi order place nahi kiya hai.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {userOrders.map((ord) => (
                  <div key={ord._id} style={{ background: '#fff', padding: '24px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Order ID: <b>{ord._id}</b></div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Date: {new Date(ord.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ background: ord.status === 'Delivered' ? '#dcfce7' : ord.status === 'Shipped' ? '#e0e7ff' : '#fef3c7', color: ord.status === 'Delivered' ? '#15803d' : ord.status === 'Shipped' ? '#4338ca' : '#b45309', padding: '6px 14px', borderRadius: '20px', fontWeight: '800', fontSize: '12px' }}>
                        ● Status: {ord.status || 'Processing'}
                      </div>
                    </div>

                    <div>
                      {ord.items && ord.items.map((it, idx) => (
                        <div key={idx} style={{ fontSize: '14px', margin: '4px 0' }}>• {it.name} (Size: <b>{it.selectedSize}</b>) - ₹{it.price}</div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                      <div style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>Total Paid: ₹{ord.totalAmount}</div>
                      <button onClick={() => setCompletedOrder(ord)} style={{ padding: '8px 14px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                        🧾 View Receipt
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
          <main style={{ maxWidth: '1240px', margin: '30px auto', padding: '0 20px 60px 20px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', marginBottom: '24px' }}>All Streetwear Collections</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '26px' }}>
              {categoryCards.map((c, i) => (
                <div key={i} onClick={() => { setSelectedCategory(c.category); setCurrentPage('shop'); }} className="interactive-card" style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '300px', cursor: 'pointer' }}>
                  <img src={c.image} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 30%, rgba(15,23,42,0.85) 100%)' }}></div>
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#fff', fontSize: '20px', fontWeight: '900' }}>{c.title}</div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>↗</div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* ABOUT VIEW */}
        {currentPage === 'about' && (
          <div style={{ maxWidth: '800px', margin: '40px auto', padding: '36px', background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '30px', fontWeight: '900', color: '#0f172a' }}>About My Style Hub</h2>
            <p style={{ color: '#475569', lineHeight: '1.8' }}>Welcome to <b>My Style Hub</b> – an exclusive modern streetwear destination founded by <b>{OWNER_NAME}</b>. We specialize in heavyweight oversized tees, utility cargos, and premium outerwear.</p>
          </div>
        )}

        {/* CONTACT VIEW */}
        {currentPage === 'contact' && (
          <div style={{ maxWidth: '650px', margin: '40px auto', padding: '36px', background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '900' }}>Customer Support</h2>
            <div style={{ fontSize: '15px', lineHeight: '2.4', color: '#334155', marginTop: '16px' }}>
              <div>👤 <b>Founder & Owner:</b> {OWNER_NAME}</div>
              <div>📍 <b>Address:</b> {STORE_ADDRESS}</div>
              <div>📞 <b>Phone / WhatsApp:</b> +91 6284319095</div>
              <div>✉️ <b>Email:</b> {SUPPORT_EMAIL}</div>
            </div>
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {currentPage === 'admin' && isAdminLoggedIn && (
          <div style={{ maxWidth: '1150px', margin: '30px auto', padding: '0 20px 60px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '24px', margin: 0, fontWeight: '900' }}>Admin Dashboard</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setAdminTab('orders')} style={{ padding: '9px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '800', background: adminTab === 'orders' ? '#2563eb' : '#e2e8f0', color: adminTab === 'orders' ? '#fff' : '#334155' }}>Orders ({orders.length})</button>
                <button onClick={() => setAdminTab('products')} style={{ padding: '9px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '800', background: adminTab === 'products' ? '#2563eb' : '#e2e8f0', color: adminTab === 'products' ? '#fff' : '#334155' }}>Catalog ({products.length})</button>
                <button onClick={() => { setIsAdminLoggedIn(false); setCurrentPage('home'); }} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '9px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800' }}>Exit Admin</button>
              </div>
            </div>

            {adminTab === 'orders' ? (
              <div style={{ marginTop: '24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '12px' }}>Customer</th>
                      <th style={{ padding: '12px' }}>Items</th>
                      <th style={{ padding: '12px' }}>Total</th>
                      <th style={{ padding: '12px' }}>Payment Method</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px' }}><b>{o.customerName}</b><br/>{o.customerPhone}<br/><small>{o.customerAddress}</small></td>
                        <td style={{ padding: '12px' }}>{o.items && o.items.map((it, idx) => (<div key={idx}>• {it.name} (Size: {it.selectedSize})</div>))}</td>
                        <td style={{ padding: '12px', color: '#16a34a', fontWeight: '800' }}>₹{o.totalAmount}</td>
                        <td style={{ padding: '12px' }}><small><b>{o.paymentMethod}</b></small></td>
                        <td style={{ padding: '12px' }}>
                          <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)} style={{ padding: '4px' }}>
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => handleDeleteOrder(o._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ marginTop: '24px' }}>
                <form onSubmit={handleAddProduct} style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0' }}>Add New Product</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <input type="text" placeholder="Title *" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    <input type="number" placeholder="Price (₹) *" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '2px solid #2563eb' }}>
                      <option value="Oversized Tees">Oversized Tees</option>
                      <option value="Cargo Pants">Cargo Pants</option>
                      <option value="Hoodies & Jackets">Hoodies & Jackets</option>
                      <option value="Casual Shirts">Casual Shirts</option>
                    </select>
                    <input type="url" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ gridColumn: 'span 2', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <button type="submit" className="shimmer-btn" style={{ marginTop: '14px', padding: '10px 22px', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>+ Save Outfit</button>
                </form>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '10px' }}>Image</th>
                      <th style={{ padding: '10px' }}>Name</th>
                      <th style={{ padding: '10px' }}>Category</th>
                      <th style={{ padding: '10px' }}>Price</th>
                      <th style={{ padding: '10px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px' }}><img src={p.image} alt={p.name} style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} /></td>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>{p.name}</td>
                        <td style={{ padding: '8px', color: '#2563eb', fontWeight: 'bold' }}>{p.category}</td>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>₹{p.price}</td>
                        <td style={{ padding: '8px' }}><button onClick={() => handleDeleteProduct(p._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button></td>
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
      <footer style={{ background: '#09090b', color: '#f4f4f5', padding: '60px 40px 25px 40px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', paddingBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '14px' }}>
              MY STYLE <span style={{ color: '#38bdf8' }}>HUB</span>
            </div>
            <p style={{ color: '#a1a1aa', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
              Premium D2C streetwear crafted for boys and men. Heavyweight breathable fabrics, drop shoulder silhouettes, and everyday utility.
            </p>
            <div style={{ marginTop: '14px', fontSize: '13px', color: '#38bdf8', fontWeight: '800' }}>
              ✦ Owner: <span style={{ color: '#fff' }}>{OWNER_NAME}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '14px' }}>Shop Drops</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#a1a1aa' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => { setSelectedCategory('Oversized Tees'); setCurrentPage('shop'); }}>Oversized T-Shirts</span>
              <span style={{ cursor: 'pointer' }} onClick={() => { setSelectedCategory('Cargo Pants'); setCurrentPage('shop'); }}>Tactical Cargo Pants</span>
              <span style={{ cursor: 'pointer' }} onClick={() => { setSelectedCategory('Hoodies & Jackets'); setCurrentPage('shop'); }}>Winter Hoodies</span>
              <span style={{ cursor: 'pointer' }} onClick={() => { setSelectedCategory('Casual Shirts'); setCurrentPage('shop'); }}>Casual Over-Shirts</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '14px' }}>Support & Store</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#a1a1aa' }}>
              <div>📍 {STORE_ADDRESS}</div>
              <div>📞 +91 6284319095</div>
              <div>✉️ {SUPPORT_EMAIL}</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '14px' }}>VIP Drop Alerts</div>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '0 0 12px 0' }}>Subscribe to get exclusive discount codes & early access to drops.</p>
            <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                placeholder="Your email address" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #3f3f46', background: '#18181b', color: '#fff', fontSize: '13px', outline: 'none' }}
              />
              <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>Join</button>
            </form>
          </div>
        </div>

        <div style={{ maxWidth: '1240px', margin: '20px auto 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#71717a', flexWrap: 'wrap', gap: '10px' }}>
          <div>© 2026 My Style Hub Studio. Founder & Owner: <b>{OWNER_NAME}</b></div>
          <div>Made with ❤️ for Indian Streetwear Culture</div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP CHAT */}
      <a 
        href={`https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent('Hi My Style Hub! Mujhe ek outfit ke baare me inquiry karni hai.')}`}
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#22c55e',
          color: '#fff',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          boxShadow: '0 10px 25px rgba(34,197,94,0.4)',
          zIndex: 999,
          textDecoration: 'none'
        }}
      >
        💬
      </a>

      {/* INVOICE RECEIPT MODAL */}
      {completedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300 }}>
          <div style={{ background: '#fff', width: '90%', maxWidth: '500px', padding: '30px', borderRadius: '20px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>MY STYLE HUB</h2>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Order Invoice / Payment Receipt</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Owner: {OWNER_NAME} | {STORE_ADDRESS}</div>
            </div>

            <div style={{ fontSize: '13px', lineHeight: '1.8', marginBottom: '16px' }}>
              <div><b>Customer:</b> {completedOrder.customerName} ({completedOrder.customerPhone})</div>
              <div><b>Delivery Address:</b> {completedOrder.customerAddress}</div>
              <div><b>Payment Method:</b> {completedOrder.paymentMethod}</div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '10px 0', marginBottom: '16px' }}>
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

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '900', marginBottom: '20px' }}>
              <span>Total Paid:</span>
              <span style={{ color: '#2563eb' }}>₹{completedOrder.totalAmount}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => window.print()} style={{ flex: 1, padding: '11px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>🖨️ Print Receipt</button>
              <button onClick={() => setCompletedOrder(null)} style={{ flex: 1, padding: '11px', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 }}>
          <div style={{ background: '#fff', width: '90%', maxWidth: '750px', borderRadius: '24px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', position: 'relative' }}>
            <button onClick={() => setQuickViewProduct(null)} style={{ position: 'absolute', top: '14px', right: '14px', background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', zIndex: 10 }}>✕</button>
            
            <div style={{ height: '380px', background: '#f8fafc' }}>
              <img src={quickViewProduct.image} alt={quickViewProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase' }}>{quickViewProduct.category}</span>
                <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: '4px 0 8px 0' }}>{quickViewProduct.name}</h3>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', marginBottom: '12px' }}>₹{quickViewProduct.price}</div>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: '0 0 16px 0' }}>{quickViewProduct.description}</p>
                
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Select Size:</span>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => handleSizeSelect(quickViewProduct._id, sz)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: (itemSizes[quickViewProduct._id] || 'L') === sz ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        background: (itemSizes[quickViewProduct._id] || 'L') === sz ? '#eff6ff' : '#fff',
                        color: (itemSizes[quickViewProduct._id] || 'L') === sz ? '#2563eb' : '#334155',
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
                className="shimmer-btn" 
                style={{ width: '100%', padding: '12px', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', marginTop: '16px' }}
              >
                Add to Bag 🛍️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {authModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 }}>
          <div style={{ background: '#fff', width: '90%', maxWidth: '380px', padding: '30px', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '19px', fontWeight: '900' }}>
                {authModal === 'login' ? 'User Login' : authModal === 'register' ? 'Create Account' : 'Admin Login'}
              </h3>
              <button onClick={() => setAuthModal(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            {authModal === 'register' && (
              <form onSubmit={handleRegister}>
                <input type="text" placeholder="Full Name" value={authName} onChange={(e) => setAuthName(e.target.value)} required style={{ width: '100%', padding: '11px 14px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px' }} />
                <input type="email" placeholder="Email Address" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required style={{ width: '100%', padding: '11px 14px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px' }} />
                <input type="tel" placeholder="Phone Number" value={authPhone} onChange={(e) => setAuthPhone(e.target.value)} required style={{ width: '100%', padding: '11px 14px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px' }} />
                <input type="password" placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required style={{ width: '100%', padding: '11px 14px', marginBottom: '16px', boxSizing: 'border-box', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px' }} />
                <button type="submit" className="shimmer-btn" style={{ width: '100%', padding: '12px', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800' }}>Create Account</button>
              </form>
            )}

            {authModal === 'login' && (
              <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email Address" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required style={{ width: '100%', padding: '11px 14px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px' }} />
                <input type="password" placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required style={{ width: '100%', padding: '11px 14px', marginBottom: '16px', boxSizing: 'border-box', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px' }} />
                <button type="submit" className="shimmer-btn" style={{ width: '100%', padding: '12px', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800' }}>Login & Continue</button>
              </form>
            )}

            {authModal === 'adminLogin' && (
              <form onSubmit={handleAdminLogin}>
                <input 
                  type="password" 
                  placeholder="Enter Secret Passcode" 
                  value={adminPin} 
                  onChange={(e) => setAdminPin(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '11px 14px', marginBottom: '16px', boxSizing: 'border-box', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px' }} 
                />
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800' }}>Access Admin Panel</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {isCartOpen && currentUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'flex-end', zIndex: 1000 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '400px', height: '100%', padding: '28px', boxSizing: 'border-box', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
                <h2 style={{ margin: 0, fontSize: '19px', fontWeight: '900' }}>Your Shopping Bag ({cart.length})</h2>
                <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✖</button>
              </div>

              {cart.length === 0 ? (
                <p style={{ color: '#64748b', marginTop: '40px', textAlign: 'center' }}>Your bag is currently empty.</p>
              ) : (
                <div style={{ marginTop: '18px' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '14px' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Size: <b>{item.selectedSize}</b></div>
                        <div style={{ color: '#2563eb', fontWeight: '900', fontSize: '15px' }}>₹{item.price}</div>
                      </div>
                      <button onClick={() => removeFromCart(idx)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '11px', fontWeight: '800' }}>Remove</button>
                    </div>
                  ))}

                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px dashed #cbd5e1', marginTop: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>HAVE A COUPON CODE? (Try: STYLE200)</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input 
                        type="text" 
                        placeholder="Coupon code" 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value)} 
                        disabled={appliedCoupon !== ''}
                        style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', textTransform: 'uppercase' }} 
                      />
                      {appliedCoupon ? (
                        <button onClick={removeCoupon} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '0 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Remove</button>
                      ) : (
                        <button onClick={applyCoupon} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '0 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Apply</button>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', fontSize: '13px', lineHeight: '1.8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                      <span>Subtotal:</span>
                      <span>₹{rawTotalPrice}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 'bold' }}>
                        <span>Discount ({appliedCoupon}):</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '900', color: '#0f172a', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                      <span>Total Payable:</span>
                      <span style={{ color: '#2563eb' }}>₹{finalPayablePrice}</span>
                    </div>
                  </div>

                  <form onSubmit={initiatePaymentGateway} style={{ marginTop: '18px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                    <div style={{ fontSize: '12px', marginBottom: '8px', color: '#475569' }}>
                      Customer: <b>{currentUser.name}</b> ({currentUser.phone})
                    </div>
                    <textarea placeholder="Delivery Address with Pincode *" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} style={{ width: '100%', padding: '10px 12px', marginBottom: '12px', boxSizing: 'border-box', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px' }} rows="2" required />
                    <button type="submit" className="shimmer-btn" style={{ width: '100%', padding: '12px', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '14px', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
                      Proceed to Pay ₹{finalPayablePrice} ⚡
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RAZORPAY-STYLE MULTI-PAYMENT GATEWAY MODAL (WITH ON-CLICK QR & INSTANT ORDER) */}
      {showPaymentGateway && orderSummary && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 }}>
          <div style={{ background: '#fff', width: '92%', maxWidth: '620px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <div style={{ background: '#09090b', color: '#fff', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '800', letterSpacing: '1px' }}>SECURE CHECKOUT</div>
                <div style={{ fontSize: '18px', fontWeight: '900' }}>My Style Hub Gateway</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#a1a1aa' }}>Total Payable</div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#22c55e' }}>₹{orderSummary.totalAmount}</div>
              </div>
            </div>

            {/* Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '190px 1fr', minHeight: '360px' }}>
              
              {/* Tabs */}
              <div style={{ background: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  onClick={() => setPaymentTab('upi')} 
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: 'none', background: paymentTab === 'upi' ? '#2563eb' : '#fff', color: paymentTab === 'upi' ? '#fff' : '#334155', fontWeight: '800', fontSize: '13px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  📱 UPI / QR Code
                </button>
                <button 
                  onClick={() => setPaymentTab('card')} 
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: 'none', background: paymentTab === 'card' ? '#2563eb' : '#fff', color: paymentTab === 'card' ? '#fff' : '#334155', fontWeight: '800', fontSize: '13px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  💳 Debit / Credit Card
                </button>
                <button 
                  onClick={() => setPaymentTab('netbanking')} 
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: 'none', background: paymentTab === 'netbanking' ? '#2563eb' : '#fff', color: paymentTab === 'netbanking' ? '#fff' : '#334155', fontWeight: '800', fontSize: '13px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  🏦 Net Banking
                </button>
              </div>

              {/* Screens */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                
                {/* 1. UPI TAB (ON-CLICK QR & INSTANT ORDER) */}
                {paymentTab === 'upi' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>Pay directly to {ACCOUNT_HOLDER}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>UPI ID: <b>{UPI_ID}</b></div>

                    {!showQrCode ? (
                      <button 
                        onClick={() => setShowQrCode(true)}
                        style={{ background: '#f1f5f9', border: '1.5px solid #2563eb', color: '#2563eb', padding: '12px 20px', borderRadius: '12px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', margin: '15px 0' }}
                      >
                        📷 Show QR Code to Scan
                      </button>
                    ) : (
                      <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', padding: '10px', borderRadius: '16px', display: 'inline-block', marginBottom: '12px' }}>
                        <img src={qrCodeUrl} alt="UPI QR Code" style={{ width: '150px', height: '150px', display: 'block', margin: '0 auto' }} />
                        <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>Scan with GPay / PhonePe / Paytm</div>
                      </div>
                    )}

                    <button 
                      onClick={() => finalizeOrder('UPI Verified')} 
                      disabled={isProcessingPay}
                      style={{ width: '100%', marginTop: '10px', padding: '12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '14px', boxShadow: '0 4px 12px rgba(22,163,74,0.3)' }}
                    >
                      {isProcessingPay ? 'Processing Payment...' : `Pay ₹${orderSummary.totalAmount} & Confirm Order ✓`}
                    </button>
                  </div>
                )}

                {/* 2. CARD TAB */}
                {paymentTab === 'card' && (
                  <form onSubmit={handleCardPayment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>Enter Debit / Credit Card</div>
                    
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>Card Number</label>
                      <input type="text" placeholder="1234 5678 9101 1121" maxLength="16" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))} required style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box', marginTop: '4px' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>Expiry (MM/YY)</label>
                        <input type="text" placeholder="12/28" maxLength="5" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} required style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box', marginTop: '4px' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>CVV</label>
                        <input type="password" placeholder="•••" maxLength="3" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))} required style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box', marginTop: '4px' }} />
                      </div>
                    </div>

                    <button type="submit" disabled={isProcessingPay} style={{ width: '100%', marginTop: '10px', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '14px' }}>
                      {isProcessingPay ? 'Processing Secure Payment...' : `Pay ₹${orderSummary.totalAmount} & Book Order`}
                    </button>
                  </form>
                )}

                {/* 3. NET BANKING TAB */}
                {paymentTab === 'netbanking' && (
                  <form onSubmit={handleNetBankingPayment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>Select Net Banking Bank</div>
                    <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #2563eb', fontWeight: '700' }}>
                      <option value="UCO Bank">UCO Bank</option>
                      <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Punjab National Bank (PNB)">Punjab National Bank (PNB)</option>
                    </select>

                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
                      You will be authenticated through {selectedBank} secure corporate banking portal.
                    </div>

                    <button type="submit" disabled={isProcessingPay} style={{ width: '100%', marginTop: '10px', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '14px' }}>
                      {isProcessingPay ? `Connecting to ${selectedBank}...` : `Pay ₹${orderSummary.totalAmount} & Confirm Order`}
                    </button>
                  </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <button onClick={() => setShowPaymentGateway(false)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>Cancel Payment</button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;