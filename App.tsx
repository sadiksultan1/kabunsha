import React, { useState, useEffect } from 'react';
import { ViewState, Product, CartItem, User, Order } from './types';
import { MOCK_PRODUCTS, SITE_INFO } from './constants';
import ProductCard from './components/ProductCard';
import Button from './components/Button';
import AiStylist from './components/AiStylist';
import { mockSignIn, mockSignOut, mockSaveOrder } from './services/mockFirebase';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  
  // Auth State (Mock Login Fields)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Cart Management
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Auth Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const u = await mockSignIn(email, password);
    setUser(u);
    setAuthLoading(false);
    setView(ViewState.HOME);
  };

  const handleLogout = async () => {
    await mockSignOut();
    setUser(null);
    setView(ViewState.HOME);
  };

  const handleCheckout = async (method: 'paypal' | 'cod') => {
    if (!user) {
      alert("Please sign in to complete your order.");
      setView(ViewState.LOGIN);
      return;
    }

    const order: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items: cart,
      total: cartTotal,
      status: method === 'cod' ? 'cash_pending' : 'paid',
      method,
      date: new Date()
    };

    const success = await mockSaveOrder(order);
    if (success) {
      alert(method === 'cod' ? "Order placed! Please pay cash on delivery." : "Payment successful! Order processed.");
      setCart([]);
      setView(ViewState.HOME);
    }
  };

  // --- Views ---

  const renderNavbar = () => (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(ViewState.HOME)}>
           {/* Logo Placeholder */}
           <div className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center text-white font-bold font-display">K</div>
           <h1 className="font-display font-bold text-xl text-brand-dark tracking-tight leading-none hidden sm:block">
             KEBUU <span className="text-brand-blue">KIDS</span>
           </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={() => setView(ViewState.HOME)} className={`text-sm font-medium ${view === ViewState.HOME ? 'text-brand-blue' : 'text-gray-600'}`}>Home</button>
          <button onClick={() => setView(ViewState.SHOP)} className={`text-sm font-medium ${view === ViewState.SHOP ? 'text-brand-blue' : 'text-gray-600'}`}>Shop</button>
          <button onClick={() => setView(ViewState.ABOUT)} className={`text-sm font-medium ${view === ViewState.ABOUT ? 'text-brand-blue' : 'text-gray-600'}`}>About</button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer" onClick={() => setView(ViewState.CART)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-pink text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </div>
          
          {user ? (
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center text-xs">
                  {user.email[0].toUpperCase()}
                </div>
                <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-500">Sign Out</button>
             </div>
          ) : (
            <Button variant="primary" className="text-xs px-4 py-1.5" onClick={() => setView(ViewState.LOGIN)}>Sign In</Button>
          )}
        </div>
      </div>
    </nav>
  );

  const renderHome = () => (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative h-[500px] w-full bg-brand-blue overflow-hidden flex items-center justify-center">
        <img src="https://picsum.photos/seed/kebuuhero/1920/1080" alt="Happy Kids" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 to-transparent"></div>
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1 bg-brand-yellow text-brand-dark rounded-full text-sm font-bold mb-4 shadow-sm">New Collection 2025</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 drop-shadow-md">
            Discover joyful styles for every little adventure.
          </h2>
          <p className="text-white text-lg mb-8 font-light">High-quality kidswear, shoes, and accessories. Secure checkout & fast shipping.</p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary" onClick={() => setView(ViewState.SHOP)}>Shop Now</Button>
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-brand-blue" onClick={() => setView(ViewState.ABOUT)}>Learn More</Button>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { title: "Curated Collections", desc: "For newborns to age 10.", icon: "✨" },
               { title: "Secure Checkout", desc: "PayPal + Cash on Delivery.", icon: "🔒" },
               { title: "Fast Delivery", desc: "Shipping across Ethiopia & Egypt.", icon: "🚚" }
             ].map((s, i) => (
               <div key={i} className="bg-gray-50 p-6 rounded-2xl text-center hover:shadow-md transition-shadow">
                 <div className="text-4xl mb-4">{s.icon}</div>
                 <h3 className="font-display font-bold text-xl mb-2">{s.title}</h3>
                 <p className="text-gray-600">{s.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Featured Products Preview */}
      <div className="py-16 bg-brand-yellow/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-3xl font-display font-bold text-brand-dark">Featured Favorites</h3>
              <p className="text-gray-500">Most loved by parents and kids.</p>
            </div>
            <button onClick={() => setView(ViewState.SHOP)} className="text-brand-blue font-bold hover:underline">View All &rarr;</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Video Section */}
      <div className="relative h-[300px] w-full bg-black flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 opacity-50 bg-[url('https://picsum.photos/seed/videoframe/1200/600')] bg-cover bg-center"></div>
         <div className="relative z-10 text-center text-white">
           <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mb-4 mx-auto cursor-pointer hover:scale-110 transition-transform">
             <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
           </div>
           <h3 className="font-display font-bold text-2xl">See Kebuu Kids in Motion</h3>
         </div>
      </div>
    </div>
  );

  const renderShop = () => (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h2 className="text-3xl font-display font-bold text-brand-dark mb-6">Shop Collection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PRODUCTS.map(p => (
          <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
        ))}
      </div>
    </div>
  );

  const renderCart = () => (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
      <h2 className="text-3xl font-display font-bold text-brand-dark mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Button onClick={() => setView(ViewState.SHOP)}>Start Shopping</Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <ul className="divide-y divide-gray-100 mb-6">
            {cart.map(item => (
              <li key={item.id} className="py-4 flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-grow">
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.price} {item.currency}</p>
                </div>
                <div className="flex items-center gap-3">
                   <span className="font-bold">x{item.quantity}</span>
                   <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                     </svg>
                   </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center text-xl font-bold mb-6 pt-4 border-t border-gray-100">
            <span>Total</span>
            <span>{cartTotal} ETB</span>
          </div>
          
          <div className="space-y-3">
             <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
               <h4 className="font-bold text-sm mb-2 text-gray-500 uppercase">Secure Checkout</h4>
               
               {/* PayPal Simulation */}
               <button 
                 onClick={() => handleCheckout('paypal')}
                 className="w-full mb-3 bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
               >
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.067 8.478c.492.315.844.825 1.056 1.53.515 1.706.183 3.655-1.002 5.842-.236.435-.494.856-.77 1.258-.577.842-1.196 1.487-1.854 1.933-1.026.696-2.22 1.05-3.58 1.05-.66 0-1.31-.05-1.95-.15-.55-.08-1.02.26-1.17.8l-.5 1.83c-.15.55-.65.93-1.22.93h-2.3c-.76 0-1.33-.7-1.14-1.43l.08-.32 2.66-9.98c.17-.65.76-1.1 1.44-1.1h3.9c1.9 0 3.65.65 4.98 1.98.53.53.99 1.13 1.37 1.8z"/></svg>
                 Pay with PayPal
               </button>

               <div className="text-center text-xs text-gray-400 mb-3">- OR -</div>

               {/* COD */}
               <button 
                 onClick={() => handleCheckout('cod')}
                 className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition-colors"
               >
                 Cash on Delivery
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAbout = () => (
    <div className="container mx-auto px-4 py-16 max-w-3xl text-center animate-fade-in">
       <h1 className="text-4xl font-display font-bold text-brand-dark mb-6">About Us</h1>
       <div className="w-24 h-1 bg-brand-yellow mx-auto mb-8 rounded-full"></div>
       <p className="text-lg text-gray-600 leading-relaxed mb-8">
         KEBUU KIDS FASHION STORY is a family-focused clothing brand dedicated to creating cheerful, durable, and comfortable outfits for children. We believe playtime requires clothing that lasts — bright colors, soft fabrics, and thoughtful design. We proudly shop local collections and ship across Ethiopia and Egypt.
       </p>
       <div className="bg-brand-blue/10 p-8 rounded-3xl">
         <h3 className="font-bold text-xl mb-4">Contact Us</h3>
         <p className="mb-2">Questions or custom orders?</p>
         <p className="font-bold text-brand-blue text-xl mb-2">{SITE_INFO.phone}</p>
         <p className="text-gray-600">{SITE_INFO.email}</p>
         <div className="flex justify-center gap-4 mt-4">
           <span className="cursor-pointer hover:text-brand-pink">Instagram</span>
           <span className="text-gray-300">|</span>
           <span className="cursor-pointer hover:text-brand-pink">Telegram</span>
         </div>
       </div>
    </div>
  );

  const renderLogin = () => (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh] animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border-t-4 border-brand-pink">
        <h2 className="text-2xl font-display font-bold text-center mb-6">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parent@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full mt-4" isLoading={authLoading}>
            Sign In
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          New here? <span className="text-brand-pink font-bold cursor-pointer">Create Account</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      {renderNavbar()}

      <main className="flex-grow">
        {view === ViewState.HOME && renderHome()}
        {view === ViewState.SHOP && renderShop()}
        {view === ViewState.CART && renderCart()}
        {view === ViewState.ABOUT && renderAbout()}
        {view === ViewState.LOGIN && renderLogin()}
      </main>

      <footer className="bg-brand-dark text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 text-white font-display font-bold">KEBUU KIDS FASHION STORY</p>
          <p className="text-sm">© 2025 — Proudly serving families in Ethiopia & Egypt.</p>
        </div>
      </footer>

      <AiStylist />
    </div>
  );
};

export default App;