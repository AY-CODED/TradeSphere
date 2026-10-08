
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, 
  ShieldCheck, Truck, Clock, CheckCircle, 
  ArrowRight, Shield, Zap, Laptop, Briefcase, Globe, Flame
} from 'lucide-react';
import heroImage from '../assets/images/img.jpg';
import ProductArt from '../components/ProductArt';
import { customerProducts, formatPrice } from '../data/customerProducts';
import { useCart } from '../hooks/useCart';


const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { addItem } = useCart();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* Hero Section */}
      <section className="relative min-h-[500px] md:h-[550px] bg-transparent flex flex-col items-center justify-center pt-16 pb-12 md:pt-10 overflow-hidden">
        {/* Background image (no overlay) */}
        <div 
          className="absolute inset-0 bg-cover bg-center blur-[2px] scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        
        <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-5xl">
          <div className="bg-orange-500 text-white text-[10px] md:text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full mb-6 flex items-center gap-2 text-center">
            <Flame aria-hidden="true" className="h-3 w-3" /> AFRICA'S LARGEST B2B HUB
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white text-center leading-tight mb-8 md:mb-10">
            Driving African Trade with<br className="hidden md:block"/> Efficiency and Reliability
          </h1>
          
          {/* Responsive Search Input */}
          <form onSubmit={(event) => { event.preventDefault(); navigate(`/marketplace?q=${encodeURIComponent(searchTerm.trim())}`); }} className="w-full max-w-3xl bg-white p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center shadow-xl mb-10 md:mb-12 gap-2 md:gap-0">
            <div className="flex w-full md:w-auto flex-1 items-center px-2 md:px-0">
              <Search className="text-gray-400 md:ml-4 mr-2 h-5 w-5 shrink-0" />
              <input 
                type="text" 
                placeholder="What are you sourcing for today?" 
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full py-3 px-2 text-gray-700 focus:outline-none text-sm md:text-base"
              />
            </div>
            <button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl md:rounded-full transition-colors">
              Search Marketplace
            </button>
          </form>
          
          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 w-full">
            {[
              { name: 'Electronics', category: 'Electronics', icon: Zap },
              { name: 'Workwear', category: 'Workwear', icon: Briefcase },
              { name: 'Home & Office', category: 'Logistics Supplies', icon: Laptop },
              { name: 'Industrial', category: 'Industrial Tools', icon: Zap },
              { name: 'Global Sourcing', category: 'Logistics Supplies', icon: Globe },
            ].map((cat, idx) => (
              <button 
                key={idx} 
                onClick={() => navigate(`/marketplace?category=${encodeURIComponent(cat.category)}`)}
                type="button"
                className="flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-md hover:bg-white/20 transition-all text-xs md:text-sm font-medium"
              >
                <cat.icon className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-gray-100 py-6 md:py-0">
            {[
              { count: '15,000+', label: 'VERIFIED VENDORS', icon: CheckCircle },
              { count: '1.2M+', label: 'SECURE DELIVERIES', icon: Truck },
              { count: '100%', label: 'ESCROW PROTECTION', icon: ShieldCheck },
              { count: '< 2 Hours', label: 'SUPPORT RESPONSE', icon: Clock },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center md:justify-center gap-4 md:py-8 px-4">
                <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                  <stat.icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">{stat.count}</h3>
                  <p className="text-[10px] md:text-[11px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals */}
      <section className="max-w-7xl mx-auto py-16 md:py-20 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-10 gap-4 sm:gap-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Today's Flash Deals</h2>
            <p className="text-sm md:text-base text-gray-500">Limited-time offers from our top-performing global and local vendors.</p>
          </div>
          <button onClick={() => navigate('/marketplace')} className="text-green-600 font-bold text-xs md:text-sm uppercase tracking-wide hover:underline flex items-center gap-1 shrink-0">
            VIEW DEALS <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {customerProducts.slice(0, 4).map((product, idx) => (
            <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow bg-white flex flex-col group">
              <div onClick={() => navigate(`/products/${product.id}`)} className="relative h-48 cursor-pointer overflow-hidden">
                <ProductArt product={product} className="h-full w-full" />
                <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                  {idx === 0 ? 'TOP PICK' : idx === 1 ? 'BEST SELLER' : 'VERIFIED'}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-green-600 text-[10px] font-bold tracking-wider mb-1">{product.category}</p>
                <button type="button" onClick={() => navigate(`/products/${product.id}`)} className="text-left font-bold text-gray-900 mb-4 hover:text-green-700">{product.name}</button>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                  <button onClick={() => addItem(product)} aria-label={`Add ${product.name} to cart`} className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-50 hover:text-green-600 hover:border-green-600 transition-colors">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trade Protection Section */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Graphic Side */}
          <div className="bg-[#fcebb6] rounded-3xl h-[400px] lg:h-[600px] p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-sm order-2 lg:order-1">
             <div className="relative z-10 text-center w-full">
                <div className="w-48 h-56 md:w-64 md:h-72 mx-auto relative flex justify-center">
                    <Shield className="w-full h-full text-slate-700/20 absolute" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-2 md:px-8 md:py-3 w-48 md:w-64 text-center font-bold tracking-widest text-sm md:text-lg shadow-xl z-20">
                      INSURANCE
                    </div>
                </div>
             </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col items-start order-1 lg:order-2">
            <div className="inline-flex items-center border border-green-200 bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-6 tracking-wide">
               <ShieldCheck size={14} className="mr-1.5" /> TRADE PROTECTION
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.1] mb-4 md:mb-6">
              Secure Transactions,<br/>Guaranteed Delivery.
            </h2>
            
            <p className="text-gray-600 text-base md:text-lg mb-8 md:mb-10 max-w-lg leading-relaxed">
              We've built a multi-layered ecosystem to ensure every trade on TradeSphere is backed by trust. From escrow payments to verified logistics partners.
            </p>

            <div className="space-y-4 w-full max-w-lg mb-8 md:mb-10">
              {[
                { title: 'Escrow Payment System', desc: 'Your funds are only released to vendors once you confirm receipt of goods.' },
                { title: 'Verified Vendor Network', desc: 'Every seller goes through a rigorous KYC process and operational audit.' },
                { title: 'Seamless Logistics Integration', desc: 'Track your cargo in real-time through our integrated courier network.' },
              ].map((feature, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 flex items-start gap-4 shadow-sm">
                  <div className="mt-0.5 text-green-600 shrink-0">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm md:text-base">{feature.title}</h4>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-lg flex items-center justify-center gap-2 transition-colors">
              Learn About Protection <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto bg-green-700 rounded-3xl p-8 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
          <div className="max-w-2xl text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
              Ready to scale your<br className="hidden sm:block"/> industrial sourcing or supply?
            </h2>
            <p className="text-green-100 text-sm md:text-lg">
              Join thousands of African businesses streamlining their trade operations with the TradeSphere ecosystem.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <button onClick={() => navigate('/marketplace')} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg transition-colors whitespace-nowrap text-sm md:text-base">
              Explore Marketplace
            </button>
            <a href="mailto:sales@tradesphere.africa" className="w-full sm:w-auto bg-transparent border border-white hover:bg-white/10 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg transition-colors whitespace-nowrap text-sm md:text-base text-center">
              Talk to Sales
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;