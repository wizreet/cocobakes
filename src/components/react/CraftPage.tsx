import { useMemo, useState } from 'react';
import { cx } from 'class-variance-authority';
import BrownieBuilder from './BrownieBuilder';
import Icon from './Icon';
import { formatPrice } from '../../data/brownie-builder';

const WHATSAPP_BASE = 'https://wa.me/9779849805290?text=';

type CraftTab = 'brownies' | 'cakes';

type CakeType = {
  id: string;
  label: string;
  hint: string;
  basePrice1lb: number;
};

const cakeTypes: CakeType[] = [
  { id: 'chocolate', label: 'Chocolate Cake', hint: 'Rich chocolate sponge + frosting', basePrice1lb: 1200 },
  { id: 'vanilla', label: 'Vanilla Cake', hint: 'Classic vanilla, soft and light', basePrice1lb: 1100 },
  { id: 'red-velvet', label: 'Red Velvet', hint: 'Velvety red with cream cheese', basePrice1lb: 1400 },
  { id: 'butterscotch', label: 'Butterscotch', hint: 'Caramel/butterscotch flavor', basePrice1lb: 1300 },
  { id: 'black-forest', label: 'Black Forest', hint: 'Chocolate + cherry style', basePrice1lb: 1350 },
];

type PoundSize = 1 | 2 | 3;

type Accessory = {
  id: string;
  label: string;
  price: number;
};

const poundOptions: Array<{ value: PoundSize; label: string }> = [
  { value: 1, label: '1 Pound' },
  { value: 2, label: '2 Pound' },
  { value: 3, label: '3 Pound' },
];

const accessories: Accessory[] = [
  { id: 'candles', label: 'Candles', price: 50 },
  { id: 'party-hat', label: 'Party Hat', price: 80 },
  { id: 'cake-topper', label: 'Cake Topper', price: 150 },
  { id: 'message-card', label: 'Message Card', price: 40 },
  { id: 'gift-wrap', label: 'Gift Wrap/Bag', price: 100 },
];

function buildCakeMessage(args: {
  selected: CakeType;
  pounds: PoundSize;
  selectedAccessories: Accessory[];
  total: number;
}) {
  const accessoriesText =
    args.selectedAccessories.length > 0
      ? args.selectedAccessories.map((a) => `${a.label} (+${formatPrice(a.price)})`).join(', ')
      : 'None';

  return encodeURIComponent(
    `Hi! I want to order a ${args.selected.label} from CocoBakes.\n\n` +
      `Order details:\n` +
      `- Size: ${args.pounds} pound\n` +
      `- Accessories: ${accessoriesText}\n` +
      `- Estimated total: ${formatPrice(args.total)}\n\n` +
      `Please help me customize it:\n` +
      `- Shape (round/heart/square):\n` +
      `- Message on cake (optional):\n` +
      `- Date needed:\n` +
      `- Delivery/Pickup:`
  );
}

export function CraftPage() {
  const [activeTab, setActiveTab] = useState<CraftTab>('brownies');
  const [selectedCakeId, setSelectedCakeId] = useState<string>(cakeTypes[0]?.id ?? '');
  const [pounds, setPounds] = useState<PoundSize>(1);
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>([]);

  const selectedCake = useMemo(
    () => cakeTypes.find((c) => c.id === selectedCakeId) ?? cakeTypes[0],
    [selectedCakeId]
  );

  const selectedAccessories = useMemo(() => {
    const set = new Set(selectedAccessoryIds);
    return accessories.filter((a) => set.has(a.id));
  }, [selectedAccessoryIds]);

  const { baseTotal, accessoriesTotal, total } = useMemo(() => {
    const base = (selectedCake?.basePrice1lb ?? 0) * pounds;
    const acc = selectedAccessories.reduce((sum, a) => sum + a.price, 0);
    return {
      baseTotal: base,
      accessoriesTotal: acc,
      total: base + acc,
    };
  }, [pounds, selectedAccessories, selectedCake?.basePrice1lb]);

  const toggleAccessory = (id: string) => {
    setSelectedAccessoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <section className="container py-12 lg:py-16">
      <header className="mb-8 space-y-3">
        <h1 className="font-primary text-heading-4xl font-bold lg:text-heading-5xl">Craft</h1>
        <p className="max-w-3xl font-secondary text-body-xl text-secondary">
          Customize your order. Switch between brownies and cakes — your brownie progress stays
          saved when you come back.
        </p>

        <div className="pt-2">
          <div className="inline-flex flex-wrap gap-2 rounded-xl bg-surface p-2 shadow-of-bg-surface">
            <button
              type="button"
              onClick={() => setActiveTab('brownies')}
              className={cx(
                'rounded-full px-5 py-2 font-primary text-body-sm font-medium transition-all duration-200',
                activeTab === 'brownies'
                  ? 'bg-fill-brand text-on-bg-fill-brand shadow-md'
                  : 'bg-bg text-brand hover:bg-fill-brand/10 hover:shadow-of-bg-fill'
              )}
            >
              Brownies
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cakes')}
              className={cx(
                'rounded-full px-5 py-2 font-primary text-body-sm font-medium transition-all duration-200',
                activeTab === 'cakes'
                  ? 'bg-fill-brand text-on-bg-fill-brand shadow-md'
                  : 'bg-bg text-brand hover:bg-fill-brand/10 hover:shadow-of-bg-fill'
              )}
            >
              Cakes
            </button>
          </div>
        </div>
      </header>

      {/* Keep both mounted so state is not lost */}
      <div className={cx(activeTab === 'brownies' ? '' : 'hidden')}>
        <div className="rounded-xl bg-surface p-4 shadow-of-bg-surface lg:p-6">
          <h2 className="mb-2 font-primary text-heading-3xl font-bold">Craft Brownies</h2>
          <p className="mb-6 max-w-3xl font-secondary text-body-md text-secondary">
            Choose a base, pick toppings and extras, then order.
          </p>
          <BrownieBuilder />
        </div>
      </div>

      <div className={cx(activeTab === 'cakes' ? '' : 'hidden')}>
        <div className="rounded-xl bg-surface p-4 shadow-of-bg-surface lg:p-6">
          <h2 className="mb-2 font-primary text-heading-3xl font-bold">Craft Cakes</h2>
          <p className="mb-6 max-w-3xl font-secondary text-body-md text-secondary">
            Select a cake type, choose the pound/size, add accessories, then message us.
          </p>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="grid gap-3 sm:grid-cols-2">
                {cakeTypes.map((cake) => {
                  const isSelected = cake.id === selectedCakeId;
                  return (
                    <button
                      key={cake.id}
                      type="button"
                      onClick={() => setSelectedCakeId(cake.id)}
                      className={cx(
                        'rounded-xl border-2 bg-bg p-5 text-left transition-all duration-200',
                        isSelected
                          ? 'border-fill-brand bg-fill-brand/10 shadow-of-bg-fill scale-[1.01]'
                          : 'border-secondary/20 hover:border-fill-brand hover:bg-fill-brand/5 hover:shadow-sm'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-primary text-heading-xl font-bold text-brand">{cake.label}</p>
                        <span className="whitespace-nowrap rounded-full bg-fill-brand/20 px-2 py-0.5 text-body-sm font-semibold text-brand">
                          {formatPrice(cake.basePrice1lb)} / lb
                        </span>
                      </div>
                      <p className="mt-2 font-secondary text-body-md text-secondary">{cake.hint}</p>
                    </button>
                  );
                })}

                <div className="sm:col-span-2">
                  <div className="mt-2 rounded-xl bg-bg p-5 shadow-of-bg-surface">
                    <p className="font-primary text-heading-xl font-bold text-brand">Size (Pound)</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {poundOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setPounds(opt.value)}
                          className={cx(
                            'rounded-full px-4 py-2 font-primary text-body-sm font-medium transition-all duration-200',
                            pounds === opt.value
                              ? 'bg-fill-brand text-on-bg-fill-brand shadow-md'
                              : 'bg-surface text-secondary hover:bg-fill-brand/10 hover:text-brand hover:shadow-of-bg-fill'
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    <p className="mt-5 font-primary text-heading-xl font-bold text-brand">Accessories</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {accessories.map((acc) => {
                        const isSelected = selectedAccessoryIds.includes(acc.id);
                        return (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => toggleAccessory(acc.id)}
                            className={cx(
                              'flex items-center justify-between rounded-lg border-2 bg-surface px-4 py-3 text-left transition-all duration-200',
                              isSelected
                                ? 'border-fill-brand bg-fill-brand/10 shadow-of-bg-fill'
                                : 'border-secondary/20 hover:border-fill-brand hover:bg-fill-brand/5'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={cx(
                                  'flex h-5 w-5 items-center justify-center rounded border-2',
                                  isSelected ? 'border-fill-brand bg-fill-brand' : 'border-secondary/40'
                                )}
                              >
                                {isSelected && (
                                  <Icon name="heroicons:check-20-solid" className="h-4 w-4 text-on-bg-fill-brand" />
                                )}
                              </span>
                              <span className="font-secondary text-body-sm text-secondary">{acc.label}</span>
                            </div>
                            <span className="text-body-xs font-semibold text-brand">+{formatPrice(acc.price)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="rounded-xl bg-fill-brand p-5 text-on-bg-fill-brand shadow-of-bg-fill">
              <p className="font-primary text-heading-xl font-bold">Your Cake</p>
              <p className="mt-2 text-body-sm text-on-bg-fill-brand-secondary">
                Selected: <span className="font-semibold">{selectedCake?.label}</span>
              </p>

              <div className="mt-4 space-y-2 border-t border-brand pt-4 text-body-sm">
                <div className="flex justify-between">
                  <span className="text-on-bg-fill-brand-secondary">Size:</span>
                  <span className="font-semibold">{pounds} lb</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-bg-fill-brand-secondary">Cake:</span>
                  <span className="font-semibold">{formatPrice(baseTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-bg-fill-brand-secondary">Accessories:</span>
                  <span className="font-semibold">{formatPrice(accessoriesTotal)}</span>
                </div>
                <div className="flex justify-between pt-2 font-primary text-heading-xl font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <a
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-fill px-4 py-3 font-primary font-semibold text-on-bg-fill transition-all duration-200 hover:bg-fill/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                href={
                  WHATSAPP_BASE +
                  buildCakeMessage({
                    selected: selectedCake,
                    pounds,
                    selectedAccessories,
                    total,
                  })
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="mdi:whatsapp" className="h-5 w-5" />
                Message to customize
              </a>

              <p className="mt-4 text-body-xs text-on-bg-fill-brand-secondary">
                Tip: include pound/size, theme, and date needed.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CraftPage;
