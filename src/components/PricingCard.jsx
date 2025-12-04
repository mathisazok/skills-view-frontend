
import check from '../assets/Check.svg';
const PricingCard = ({ name, price, period,  features, cta, description , isPopular = false , isFree= false, savings = null, planId = null, onSubscribe = null }) => {
  
  const handleClick = () => {
    if (onSubscribe && planId) {
      onSubscribe(planId);
    }
  };
  
  return (
    <div
      className={`rounded-xl p-5 h-full flex flex-col bg-white max-w-[340px] sm:max-w-90 w-full sm:min-w-64  ${
        isPopular
          ? 'border-4 border-primary'
          : ''
      }`}
    >
      {/* Header */}
      <div className="mb-6 text-[#1A1A1AB2]">
        <div className="flex items-start justify-between mb-3">
          <h3 className={`text-xl font-semibold ${isPopular ? 'text-primary' : isFree ? 'text-[#1A1A1AB2]' : 'text-dark'}`}>
            {name}
          </h3>
          {savings && !isNaN(savings) && (
            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
              Économisez {savings}%
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-dark">{price}€</span>
          <span className='text-[#1A1A1AB2] text-sm'>/{period }</span>
        </div>
        <p className="text-sm mt-4 ">{description}</p>
         <button
         onClick={handleClick}
        className={`w-full min-h-10 px-4 rounded-xl font-semibold transition-all duration-300 text-sm mt-3 cursor-pointer ${
          isPopular
            ? 'bg-primary text-white hover:bg-opacity-90'
            : 'bg-dark text-white hover:bg-opacity-90'
        }`}
      >
        {cta}
      </button>
      </div>
        <div className='border border-dashed border-[#1A1A1A2E] w-full mb-4 '></div>
      {/* Features */}
      <ul className="grow space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <img src={check} alt="check icon" />          
            <span className='text-gray-700'>{feature}</span>

          </li>
        ))}
      </ul>

      {/* CTA Button */}
     
    </div>
  );
};

export default PricingCard;
