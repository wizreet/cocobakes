import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { cx } from 'class-variance-authority';
import {
  bases,
  toppings,
  extras,
  quantityOptions,
  formatPrice,
  type BuilderOption,
} from '../../data/brownie-builder';

interface SelectionState {
  base: BuilderOption | null;
  toppings: BuilderOption[];
  extras: BuilderOption[];
  quantity: number;
}

export function BrownieBuilder() {
  const [selections, setSelections] = useState<SelectionState>({
    base: null,
    toppings: [],
    extras: [],
    quantity: 4,
  });
  const [activeTab, setActiveTab] = useState<'base' | 'toppings' | 'extras'>('base');

  const isOrderValid = selections.base !== null;

  const focusBaseStep = () => {
    setActiveTab('base');
  };

  // Calculate total price
  const { unitPrice, totalPrice, discount, finalPrice } = useMemo(() => {
    let unit = 0;
    if (selections.base) unit += selections.base.price;
    unit += selections.toppings.reduce((sum, t) => sum + t.price, 0);
    unit += selections.extras.reduce((sum, e) => sum + e.price, 0);

    const total = unit * selections.quantity;
    const preset = quantityOptions.presets.find(p => p.quantity === selections.quantity);
    const discountPercent = preset?.discount || 0;
    const discountAmount = (total * discountPercent) / 100;
    const final = total - discountAmount;

    return {
      unitPrice: unit,
      totalPrice: total,
      discount: discountPercent,
      finalPrice: final,
    };
  }, [selections]);

  // Handle base selection
  const handleBaseSelect = (option: BuilderOption) => {
    setSelections(prev => ({ ...prev, base: option }));
  };

  // Handle multi-select (toppings/extras)
  const handleMultiSelect = (
    category: 'toppings' | 'extras',
    option: BuilderOption,
    maxSelections: number
  ) => {
    setSelections(prev => {
      const current = prev[category];
      const isSelected = current.some(item => item.id === option.id);

      if (isSelected) {
        return { ...prev, [category]: current.filter(item => item.id !== option.id) };
      } else if (current.length < maxSelections) {
        return { ...prev, [category]: [...current, option] };
      }
      return prev;
    });
  };

  // Handle quantity change
  const handleQuantityChange = (qty: number) => {
    const clampedQty = Math.max(quantityOptions.min, Math.min(quantityOptions.max, qty));
    setSelections(prev => ({ ...prev, quantity: clampedQty }));
  };

  // Generate order message
  const generateOrderMessage = () => {
    if (!selections.base) return '';
    
    let message = `Hi! I would like to order from CocoBakes 🍫\n\n`;
    message += `I'd like ${selections.quantity} piece${selections.quantity > 1 ? 's' : ''} of ${selections.base.name}`;
    
    if (selections.toppings.length > 0) {
      message += ` with ${selections.toppings.map(t => t.name).join(', ')} as toppings`;
    }
    
    if (selections.extras.length > 0) {
      message += `, and ${selections.extras.map(e => e.name).join(', ')} as add-ons`;
    }
    
    message += `.\n\n`;
    message += `Order Summary:\n`;
    message += `- Base: ${selections.base.name}\n`;
    if (selections.toppings.length > 0) {
      message += `- Toppings: ${selections.toppings.map(t => t.name).join(', ')}\n`;
    }
    if (selections.extras.length > 0) {
      message += `- Add-ons: ${selections.extras.map(e => e.name).join(', ')}\n`;
    }
    message += `- Quantity: ${selections.quantity} pieces\n`;
    message += `- Price per piece: ${formatPrice(unitPrice)}\n`;
    
    if (discount > 0) {
      message += `- Discount: ${discount}% off\n`;
    }
    
    message += `- Total: ${formatPrice(finalPrice)}\n`;
    message += `\nDelivery to Lalitpur, Nepal.\n\nThank you! 😊`;
    
    return message;
  };

  // Order handlers
  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(generateOrderMessage());
    window.open(`https://wa.me/9779849805290?text=${message}`, '_blank');
  };

  const handleInstagramOrder = () => {
    // Copy message to clipboard and open Instagram
    const message = generateOrderMessage();
    navigator.clipboard.writeText(message);
    alert('Order details copied to clipboard! Paste it in Instagram DM.');
    window.open('https://ig.me/m/cocobakes.np', '_blank');
  };

  const tabs = [
    { id: 'base' as const, label: 'Base', icon: 'heroicons:cake-solid' },
    { id: 'toppings' as const, label: 'Toppings', icon: 'heroicons:sparkles-solid' },
    { id: 'extras' as const, label: 'Extras', icon: 'heroicons:gift-solid' },
  ];

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Builder Panel */}
      <div className="flex-1 rounded-xl bg-surface p-4 shadow-lg lg:p-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-2 rounded-lg bg-bg p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cx(
                'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 font-primary text-body-sm font-medium transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-fill-brand text-on-bg-fill-brand shadow-md scale-[1.02]'
                  : 'text-secondary hover:text hover:bg-fill-brand/10 hover:scale-[1.01]'
              )}
            >
              <Icon icon={tab.icon} className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Base Selection */}
        {activeTab === 'base' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-primary text-heading-lg font-bold">{bases.name}</h3>
              <p className="text-body-sm text-secondary">{bases.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {bases.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleBaseSelect(option)}
                  className={cx(
                    'flex flex-col gap-1 rounded-lg border-2 p-4 text-left transition-all duration-200 hover:shadow-md',
                    selections.base?.id === option.id
                      ? 'border-fill-brand bg-fill-brand/15 scale-[1.02] shadow-md'
                      : 'border-secondary/20 hover:border-fill-brand hover:bg-fill-brand/5 hover:scale-[1.01]'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-primary font-semibold">{option.name}</span>
                    {selections.base?.id === option.id && (
                      <Icon icon="heroicons:check-circle-solid" className="h-5 w-5 text-fill-brand" />
                    )}
                  </div>
                  <p className="text-body-xs text-secondary">{option.description}</p>
                  <span className="mt-1 font-secondary text-body-sm font-semibold text-brand">
                    {formatPrice(option.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Toppings Selection */}
        {activeTab === 'toppings' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-primary text-heading-lg font-bold">{toppings.name}</h3>
                <span className="rounded-full bg-fill-brand/20 px-2 py-0.5 text-body-xs font-medium text-brand">
                  {selections.toppings.length}/{toppings.maxSelections}
                </span>
              </div>
              <p className="text-body-sm text-secondary">{toppings.description}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {toppings.options.map(option => {
                const isSelected = selections.toppings.some(t => t.id === option.id);
                const isDisabled = !isSelected && selections.toppings.length >= toppings.maxSelections;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleMultiSelect('toppings', option, toppings.maxSelections)}
                    disabled={isDisabled}
                    className={cx(
                      'flex items-center justify-between rounded-lg border-2 px-4 py-3 transition-all duration-200',
                      isSelected
                        ? 'border-fill-brand bg-fill-brand/15 scale-[1.02] shadow-md'
                        : isDisabled
                        ? 'cursor-not-allowed border-secondary/10 opacity-50'
                        : 'border-secondary/20 hover:border-fill-brand hover:bg-fill-brand/5 hover:shadow-sm hover:scale-[1.01]'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cx(
                          'flex h-5 w-5 items-center justify-center rounded border-2 transition-all',
                          isSelected ? 'border-fill-brand bg-fill-brand' : 'border-secondary/40'
                        )}
                      >
                        {isSelected && <Icon icon="heroicons:check-solid" className="h-3 w-3 text-on-bg-fill-brand" />}
                      </div>
                      <span className="font-secondary text-body-sm">{option.name}</span>
                    </div>
                    <span className="text-body-xs font-medium text-brand">+{formatPrice(option.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Extras Selection */}
        {activeTab === 'extras' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-primary text-heading-lg font-bold">{extras.name}</h3>
                <span className="rounded-full bg-fill-brand/20 px-2 py-0.5 text-body-xs font-medium text-brand">
                  {selections.extras.length}/{extras.maxSelections}
                </span>
              </div>
              <p className="text-body-sm text-secondary">{extras.description}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {extras.options.map(option => {
                const isSelected = selections.extras.some(e => e.id === option.id);
                const isDisabled = !isSelected && selections.extras.length >= extras.maxSelections;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleMultiSelect('extras', option, extras.maxSelections)}
                    disabled={isDisabled}
                    className={cx(
                      'flex items-center justify-between rounded-lg border-2 px-4 py-3 transition-all duration-200',
                      isSelected
                        ? 'border-fill-brand bg-fill-brand/15 scale-[1.02] shadow-md'
                        : isDisabled
                        ? 'cursor-not-allowed border-secondary/10 opacity-50'
                        : 'border-secondary/20 hover:border-fill-brand hover:bg-fill-brand/5 hover:shadow-sm hover:scale-[1.01]'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cx(
                          'flex h-5 w-5 items-center justify-center rounded border-2 transition-all',
                          isSelected ? 'border-fill-brand bg-fill-brand' : 'border-secondary/40'
                        )}
                      >
                        {isSelected && <Icon icon="heroicons:check-solid" className="h-3 w-3 text-on-bg-fill-brand" />}
                      </div>
                      <span className="font-secondary text-body-sm">{option.name}</span>
                    </div>
                    <span className="text-body-xs font-medium text-brand">+{formatPrice(option.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Order Summary Panel */}
      <div className="w-full lg:w-80">
        <div className="sticky top-28 rounded-xl bg-fill-brand p-4 text-on-bg-fill-brand shadow-lg lg:p-6">
          <h3 className="mb-4 font-primary text-heading-xl font-bold">Your Creation</h3>

          {/* Summary */}
          <div className="mb-4 space-y-2 border-b border-brand pb-4">
            {selections.base ? (
              <>
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-bg-fill-brand-secondary">Base:</span>
                  <span className="font-medium">{selections.base.name}</span>
                </div>
                {selections.toppings.length > 0 && (
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-bg-fill-brand-secondary">Toppings:</span>
                    <span className="text-right font-medium">
                      {selections.toppings.map(t => t.name).join(', ')}
                    </span>
                  </div>
                )}
                {selections.extras.length > 0 && (
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-bg-fill-brand-secondary">Add-ons:</span>
                    <span className="text-right font-medium">
                      {selections.extras.map(e => e.name).join(', ')}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-body-sm text-on-bg-fill-brand-secondary">
                Select a base to start crafting!
              </p>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-4 space-y-3">
            <label className="text-body-sm font-medium">Quantity</label>
            <div className="flex flex-wrap gap-2">
              {quantityOptions.presets.map(preset => (
                <button
                  key={preset.quantity}
                  onClick={() => handleQuantityChange(preset.quantity)}
                  className={cx(
                    'rounded-lg px-3 py-2 text-body-xs font-medium transition-all duration-200',
                    selections.quantity === preset.quantity
                      ? 'bg-fill text-on-bg-fill-brand scale-[1.05] shadow-md'
                      : 'bg-fill-brand-hover text-on-bg-fill-brand hover:bg-fill hover:scale-[1.02]'
                  )}
                >
                  {preset.label}
                  {preset.discount > 0 && (
                    <span className="ml-1 text-green-300">-{preset.discount}%</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(selections.quantity - 1)}
                disabled={selections.quantity <= quantityOptions.min}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-fill-brand-hover transition-all hover:bg-fill disabled:opacity-50"
              >
                <Icon icon="heroicons:minus-solid" className="h-4 w-4" />
              </button>
              <input
                type="number"
                value={selections.quantity}
                onChange={e => handleQuantityChange(parseInt(e.target.value) || 1)}
                min={quantityOptions.min}
                max={quantityOptions.max}
                className="w-16 rounded-lg bg-fill-brand-hover px-3 py-1 text-center font-medium text-on-bg-fill-brand"
              />
              <button
                onClick={() => handleQuantityChange(selections.quantity + 1)}
                disabled={selections.quantity >= quantityOptions.max}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-fill-brand-hover transition-all hover:bg-fill disabled:opacity-50"
              >
                <Icon icon="heroicons:plus-solid" className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mb-4 space-y-2 border-b border-brand pb-4">
            <div className="flex justify-between text-body-sm">
              <span className="text-on-bg-fill-brand-secondary">Price per piece:</span>
              <span>{formatPrice(unitPrice)}</span>
            </div>
            <div className="flex justify-between text-body-sm">
              <span className="text-on-bg-fill-brand-secondary">Subtotal ({selections.quantity}x):</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-body-sm text-green-300">
                <span>Discount ({discount}%):</span>
                <span>-{formatPrice(totalPrice - finalPrice)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 font-primary text-heading-lg font-bold">
              <span>Total:</span>
              <span>{formatPrice(finalPrice)}</span>
            </div>
          </div>

          {/* Order Buttons */}
          <div className="space-y-3">
            {!isOrderValid && (
              <div className="rounded-lg bg-fill/15 px-4 py-3 text-center text-body-sm text-on-bg-fill-brand-secondary">
                Please select a base first to order.
              </div>
            )}
            <button
              onClick={() => (isOrderValid ? handleWhatsAppOrder() : focusBaseStep())}
              aria-disabled={!isOrderValid}
              className={cx(
                'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-primary font-semibold transition-all duration-200 active:scale-[0.98]',
                isOrderValid
                  ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:scale-[1.02] hover:ring-2 hover:ring-fill'
                  : 'bg-fill text-on-bg-fill hover:bg-fill/90 hover:shadow-of-bg-fill hover:scale-[1.02] hover:ring-2 hover:ring-fill'
              )}
            >
              <Icon icon="mdi:whatsapp" className="h-5 w-5" />
              {isOrderValid ? 'Order on WhatsApp' : 'Select a base to order'}
            </button>
            <button
              onClick={() => (isOrderValid ? handleInstagramOrder() : focusBaseStep())}
              aria-disabled={!isOrderValid}
              className={cx(
                'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-primary font-semibold transition-all duration-200 active:scale-[0.98]',
                isOrderValid
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:scale-[1.02] hover:ring-2 hover:ring-fill'
                  : 'bg-fill text-on-bg-fill hover:bg-fill/90 hover:shadow-of-bg-fill hover:scale-[1.02] hover:ring-2 hover:ring-fill'
              )}
            >
              <Icon icon="mdi:instagram" className="h-5 w-5" />
              {isOrderValid ? 'DM on Instagram' : 'Select a base to DM'}
            </button>
            <div className="pt-2 text-center">
              <p className="text-body-sm text-on-bg-fill-brand-secondary">
                or call on{' '}
                <a 
                  href="tel:+9779849805290" 
                  className="font-semibold text-on-bg-fill-brand underline hover:no-underline"
                >
                  9849805290
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrownieBuilder;
