import { useState, useMemo, useCallback, memo } from 'react';
import { Icon } from '@iconify/react';
import { cx } from 'class-variance-authority';
import {
  bases,
  toppings,
  extras,
  quantityOptions,
  type BuilderOption,
} from '../../data/brownie-builder';
import {
  formatPrice,
  generateOrderMessage,
  buildWhatsAppUrl,
  copyToClipboard,
} from '@/utils';
import { SOCIAL_URLS, ICONS } from '@/constants';

interface SelectionState {
  base: BuilderOption | null;
  toppings: BuilderOption[];
  extras: BuilderOption[];
  quantity: number;
}

interface OptionButtonProps {
  readonly option: BuilderOption;
  readonly isSelected: boolean;
  readonly onSelect: (option: BuilderOption) => void;
}

interface MultiSelectButtonProps {
  readonly option: BuilderOption;
  readonly isSelected: boolean;
  readonly isDisabled: boolean;
  readonly onSelect: () => void;
}

interface TabButtonProps {
  readonly id: 'base' | 'toppings' | 'extras';
  readonly label: string;
  readonly icon: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

interface QuantityButtonProps {
  readonly label: string;
  readonly discount: number;
  readonly isSelected: boolean;
  readonly onClick: () => void;
}

// Memoized sub-components for better performance
const TabButton = memo(function TabButton({
  label,
  icon,
  isActive,
  onClick,
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'font-medium flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 font-primary text-body-sm transition-all duration-200',
        isActive
          ? 'shadow-md scale-[1.02] bg-fill-brand text-on-bg-fill-brand'
          : 'text-secondary hover:scale-[1.01] hover:bg-fill-brand/10 hover:text',
      )}
    >
      <Icon icon={icon} className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
});
TabButton.displayName = 'TabButton';

const OptionButton = memo(function OptionButton({
  option,
  isSelected,
  onSelect,
}: OptionButtonProps) {
  const handleClick = useCallback(() => {
    onSelect(option);
  }, [option, onSelect]);

  return (
    <button
      onClick={handleClick}
      className={cx(
        'hover:shadow-md flex flex-col gap-1 rounded-lg border-2 p-4 text-left transition-all duration-200',
        isSelected
          ? 'border-fill-brand shadow-md scale-[1.02] bg-fill-brand/15'
          : 'hover:border-fill-brand border-secondary/20 hover:scale-[1.01] hover:bg-fill-brand/5',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold font-primary">{option.name}</span>
        {isSelected && (
          <Icon
            icon="heroicons:check-circle-solid"
            className="text-fill-brand h-5 w-5"
            aria-hidden="true"
          />
        )}
      </div>
      <p className="text-body-xs text-secondary">{option.description}</p>
      <span className="font-semibold mt-1 font-secondary text-body-sm text-brand">
        {formatPrice(option.price)}
      </span>
    </button>
  );
});
OptionButton.displayName = 'OptionButton';

const MultiSelectButton = memo(function MultiSelectButton({
  option,
  isSelected,
  isDisabled,
  onSelect,
}: MultiSelectButtonProps) {
  return (
    <button
      onClick={onSelect}
      disabled={isDisabled}
      className={cx(
        'flex items-center justify-between rounded-lg border-2 px-4 py-3 transition-all duration-200',
        isSelected
          ? 'border-fill-brand shadow-md scale-[1.02] bg-fill-brand/15'
          : isDisabled
            ? 'cursor-not-allowed border-secondary/10 opacity-50'
            : 'hover:border-fill-brand hover:shadow-sm border-secondary/20 hover:scale-[1.01] hover:bg-fill-brand/5',
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cx(
            'flex h-5 w-5 items-center justify-center rounded border-2 transition-all',
            isSelected
              ? 'border-fill-brand bg-fill-brand'
              : 'border-secondary/40',
          )}
          aria-hidden="true"
        >
          {isSelected && (
            <Icon
              icon="heroicons:check-solid"
              className="h-3 w-3 text-on-bg-fill-brand"
            />
          )}
        </div>
        <span className="font-secondary text-body-sm">{option.name}</span>
      </div>
      <span className="font-medium text-body-xs text-brand">
        +{formatPrice(option.price)}
      </span>
    </button>
  );
});
MultiSelectButton.displayName = 'MultiSelectButton';

const QuantityPresetButton = memo(function QuantityPresetButton({
  label,
  discount,
  isSelected,
  onClick,
}: QuantityButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'font-medium rounded-lg px-3 py-2 text-body-xs transition-all duration-200',
        isSelected
          ? 'shadow-md scale-[1.05] bg-fill text-on-bg-fill-brand'
          : 'bg-fill-brand-hover text-on-bg-fill-brand hover:scale-[1.02] hover:bg-fill',
      )}
    >
      {label}
      {discount > 0 && (
        <span className="text-green-300 ml-1">-{discount}%</span>
      )}
    </button>
  );
});
QuantityPresetButton.displayName = 'QuantityPresetButton';

// Tab configuration (static, doesn't need to be recreated)
const TABS = [
  { id: 'base' as const, label: 'Base', icon: ICONS.CAKE },
  { id: 'toppings' as const, label: 'Toppings', icon: ICONS.SPARKLES },
  { id: 'extras' as const, label: 'Extras', icon: ICONS.GIFT },
] as const;

export const BrownieBuilder = memo(function BrownieBuilder() {
  const [selections, setSelections] = useState<SelectionState>({
    base: null,
    toppings: [],
    extras: [],
    quantity: 4,
  });
  const [activeTab, setActiveTab] = useState<'base' | 'toppings' | 'extras'>(
    'base',
  );

  const isOrderValid = selections.base !== null;

  const focusBaseStep = useCallback(() => {
    setActiveTab('base');
  }, []);

  // Calculate total price
  const { unitPrice, totalPrice, discount, finalPrice } = useMemo(() => {
    let unit = 0;
    if (selections.base) unit += selections.base.price;
    unit += selections.toppings.reduce((sum, t) => sum + t.price, 0);
    unit += selections.extras.reduce((sum, e) => sum + e.price, 0);

    const total = unit * selections.quantity;
    const preset = quantityOptions.presets.find(
      (p) => p.quantity === selections.quantity,
    );
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
  const handleBaseSelect = useCallback((option: BuilderOption) => {
    setSelections((prev) => ({ ...prev, base: option }));
  }, []);

  // Handle multi-select (toppings/extras)
  const handleMultiSelect = useCallback(
    (
      category: 'toppings' | 'extras',
      option: BuilderOption,
      maxSelections: number,
    ) => {
      setSelections((prev) => {
        const current = prev[category];
        const isSelected = current.some((item) => item.id === option.id);

        if (isSelected) {
          return {
            ...prev,
            [category]: current.filter((item) => item.id !== option.id),
          };
        } else if (current.length < maxSelections) {
          return { ...prev, [category]: [...current, option] };
        }
        return prev;
      });
    },
    [],
  );

  // Handle quantity change
  const handleQuantityChange = useCallback((qty: number) => {
    const clampedQty = Math.max(
      quantityOptions.min,
      Math.min(quantityOptions.max, qty),
    );
    setSelections((prev) => ({ ...prev, quantity: clampedQty }));
  }, []);

  // Generate order message using utility function
  const createOrderMessage = useCallback(() => {
    if (!selections.base) return '';

    return generateOrderMessage({
      baseName: selections.base.name,
      toppings: selections.toppings.map((t) => t.name),
      extras: selections.extras.map((e) => e.name),
      quantity: selections.quantity,
      unitPrice,
      discount,
      finalPrice,
    });
  }, [selections, unitPrice, discount, finalPrice]);

  // Order handlers
  const handleWhatsAppOrder = useCallback(() => {
    const message = createOrderMessage();
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  }, [createOrderMessage]);

  const handleInstagramOrder = useCallback(async () => {
    const message = createOrderMessage();
    const copied = await copyToClipboard(message);
    if (copied) {
      alert('Order details copied to clipboard! Paste it in Instagram DM.');
    }
    window.open(SOCIAL_URLS.INSTAGRAM_DM, '_blank', 'noopener,noreferrer');
  }, [createOrderMessage]);

  // Memoized tab click handlers
  const handleTabClick = useCallback(
    (tabId: 'base' | 'toppings' | 'extras') => {
      setActiveTab(tabId);
    },
    [],
  );

  // Memoized summary strings
  const toppingsDisplay = useMemo(
    () => selections.toppings.map((t) => t.name).join(', '),
    [selections.toppings],
  );

  const extrasDisplay = useMemo(
    () => selections.extras.map((e) => e.name).join(', '),
    [selections.extras],
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Builder Panel */}
      <div className="shadow-lg flex-1 rounded-xl bg-surface p-4 lg:p-6">
        {/* Tabs */}
        <div className="bg-bg mb-6 flex gap-2 rounded-lg p-1" role="tablist">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
            />
          ))}
        </div>

        {/* Base Selection */}
        {activeTab === 'base' && (
          <div className="space-y-4" role="tabpanel" aria-labelledby="base-tab">
            <div className="space-y-1">
              <h3 className="text-heading-lg font-primary font-bold">
                {bases.name}
              </h3>
              <p className="text-body-sm text-secondary">{bases.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {bases.options.map((option) => (
                <OptionButton
                  key={option.id}
                  option={option}
                  isSelected={selections.base?.id === option.id}
                  onSelect={handleBaseSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Toppings Selection */}
        {activeTab === 'toppings' && (
          <div
            className="space-y-4"
            role="tabpanel"
            aria-labelledby="toppings-tab"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-heading-lg font-primary font-bold">
                  {toppings.name}
                </h3>
                <span className="font-medium rounded-full bg-fill-brand/20 px-2 py-0.5 text-body-xs text-brand">
                  {selections.toppings.length}/{toppings.maxSelections}
                </span>
              </div>
              <p className="text-body-sm text-secondary">
                {toppings.description}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {toppings.options.map((option) => {
                const isSelected = selections.toppings.some(
                  (t) => t.id === option.id,
                );
                const isDisabled =
                  !isSelected &&
                  selections.toppings.length >= toppings.maxSelections;
                return (
                  <MultiSelectButton
                    key={option.id}
                    option={option}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    onSelect={() =>
                      handleMultiSelect(
                        'toppings',
                        option,
                        toppings.maxSelections,
                      )
                    }
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Extras Selection */}
        {activeTab === 'extras' && (
          <div
            className="space-y-4"
            role="tabpanel"
            aria-labelledby="extras-tab"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-heading-lg font-primary font-bold">
                  {extras.name}
                </h3>
                <span className="font-medium rounded-full bg-fill-brand/20 px-2 py-0.5 text-body-xs text-brand">
                  {selections.extras.length}/{extras.maxSelections}
                </span>
              </div>
              <p className="text-body-sm text-secondary">
                {extras.description}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {extras.options.map((option) => {
                const isSelected = selections.extras.some(
                  (e) => e.id === option.id,
                );
                const isDisabled =
                  !isSelected &&
                  selections.extras.length >= extras.maxSelections;
                return (
                  <MultiSelectButton
                    key={option.id}
                    option={option}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    onSelect={() =>
                      handleMultiSelect('extras', option, extras.maxSelections)
                    }
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Order Summary Panel */}
      <div className="w-full lg:w-80">
        <div className="shadow-lg sticky top-28 rounded-xl bg-fill-brand p-4 text-on-bg-fill-brand lg:p-6">
          <h3 className="mb-4 font-primary text-heading-xl font-bold">
            Your Creation
          </h3>

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
                    <span className="text-on-bg-fill-brand-secondary">
                      Toppings:
                    </span>
                    <span className="font-medium text-right">
                      {toppingsDisplay}
                    </span>
                  </div>
                )}
                {selections.extras.length > 0 && (
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-bg-fill-brand-secondary">
                      Add-ons:
                    </span>
                    <span className="font-medium text-right">
                      {extrasDisplay}
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
            <label className="font-medium text-body-sm" id="quantity-label">
              Quantity
            </label>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-labelledby="quantity-label"
            >
              {quantityOptions.presets.map((preset) => (
                <QuantityPresetButton
                  key={preset.quantity}
                  label={preset.label}
                  discount={preset.discount}
                  isSelected={selections.quantity === preset.quantity}
                  onClick={() => handleQuantityChange(preset.quantity)}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(selections.quantity - 1)}
                disabled={selections.quantity <= quantityOptions.min}
                aria-label="Decrease quantity"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-fill-brand-hover transition-all hover:bg-fill disabled:opacity-50"
              >
                <Icon
                  icon="heroicons:minus-solid"
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </button>
              <input
                type="number"
                value={selections.quantity}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
                min={quantityOptions.min}
                max={quantityOptions.max}
                aria-label="Quantity"
                className="font-medium w-16 rounded-lg bg-fill-brand-hover px-3 py-1 text-center text-on-bg-fill-brand"
              />
              <button
                onClick={() => handleQuantityChange(selections.quantity + 1)}
                disabled={selections.quantity >= quantityOptions.max}
                aria-label="Increase quantity"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-fill-brand-hover transition-all hover:bg-fill disabled:opacity-50"
              >
                <Icon
                  icon="heroicons:plus-solid"
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mb-4 space-y-2 border-b border-brand pb-4">
            <div className="flex justify-between text-body-sm">
              <span className="text-on-bg-fill-brand-secondary">
                Price per piece:
              </span>
              <span>{formatPrice(unitPrice)}</span>
            </div>
            <div className="flex justify-between text-body-sm">
              <span className="text-on-bg-fill-brand-secondary">
                Subtotal ({selections.quantity}x):
              </span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            {discount > 0 && (
              <div className="text-green-300 flex justify-between text-body-sm">
                <span>Discount ({discount}%):</span>
                <span>-{formatPrice(totalPrice - finalPrice)}</span>
              </div>
            )}
            <div className="text-heading-lg flex justify-between pt-2 font-primary font-bold">
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
              onClick={() =>
                isOrderValid ? handleWhatsAppOrder() : focusBaseStep()
              }
              aria-disabled={!isOrderValid}
              className={cx(
                'font-semibold flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-primary transition-all duration-200 active:scale-[0.98]',
                isOrderValid
                  ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:scale-[1.02] hover:ring-2 hover:ring-fill'
                  : 'bg-fill text-on-bg-fill hover:scale-[1.02] hover:bg-fill/90 hover:shadow-of-bg-fill hover:ring-2 hover:ring-fill',
              )}
            >
              <Icon icon="mdi:whatsapp" className="h-5 w-5" />
              {isOrderValid ? 'Order on WhatsApp' : 'Select a base to order'}
            </button>
            <button
              onClick={() =>
                isOrderValid ? handleInstagramOrder() : focusBaseStep()
              }
              aria-disabled={!isOrderValid}
              className={cx(
                'font-semibold flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-primary transition-all duration-200 active:scale-[0.98]',
                isOrderValid
                  ? 'from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-lg bg-gradient-to-r hover:scale-[1.02] hover:ring-2 hover:ring-fill'
                  : 'bg-fill text-on-bg-fill hover:scale-[1.02] hover:bg-fill/90 hover:shadow-of-bg-fill hover:ring-2 hover:ring-fill',
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
});

BrownieBuilder.displayName = 'BrownieBuilder';

export default BrownieBuilder;
