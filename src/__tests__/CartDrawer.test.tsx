import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CartDrawer from '../components/CartDrawer';
import type { CartItem, Product } from '../types';

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'p1',
  name: 'Test Duvet',
  category: 'Duvets',
  price: 5000,
  description: 'A fine duvet',
  image: 'https://example.com/img.jpg',
  reviews: [],
  ...overrides,
});

const makeCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 'p1',
  name: 'Test Duvet',
  category: 'Duvets',
  price: 5000,
  description: 'A fine duvet',
  image: 'https://example.com/img.jpg',
  quantity: 1,
  ...overrides,
});

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  items: [],
  allProducts: [],
  onUpdateQuantity: vi.fn(),
  onRemove: vi.fn(),
  onAddToCart: vi.fn(),
};

describe('CartDrawer', () => {
  describe('empty state', () => {
    it('shows empty bag message when no items', () => {
      render(<CartDrawer {...defaultProps} />);
      expect(screen.getByText(/your bag is currently empty/i)).toBeInTheDocument();
    });

    it('Order via WhatsApp link is disabled when cart is empty', () => {
      render(<CartDrawer {...defaultProps} />);
      // <a> without href loses the "link" role — find by text content instead
      const link = screen.getByText(/order via whatsapp/i);
      expect(link).toHaveClass('pointer-events-none');
      expect(link).not.toHaveAttribute('href');
    });
  });

  describe('with items', () => {
    it('renders each cart item name', () => {
      const items = [
        makeCartItem({ id: 'p1', name: 'Luxury Duvet', price: 5000, quantity: 1 }),
        makeCartItem({ id: 'p2', name: 'Silk Sheets', price: 3000, quantity: 2 }),
      ];
      render(<CartDrawer {...defaultProps} items={items} />);
      expect(screen.getByText('Luxury Duvet')).toBeInTheDocument();
      expect(screen.getByText('Silk Sheets')).toBeInTheDocument();
    });

    it('calculates subtotal correctly (price × quantity, summed)', () => {
      const items = [
        makeCartItem({ id: 'p1', price: 5000, quantity: 2 }),
        makeCartItem({ id: 'p2', name: 'Sheets', price: 3000, quantity: 1 }),
      ];
      render(<CartDrawer {...defaultProps} items={items} />);
      // 5000*2 + 3000*1 = 13000
      expect(screen.getByText(/ksh 13,000/i)).toBeInTheDocument();
    });

    it('Order via WhatsApp link contains product name and total', () => {
      const items = [makeCartItem({ name: 'Test Duvet', price: 5000, quantity: 1 })];
      render(<CartDrawer {...defaultProps} items={items} />);
      const link = screen.getByRole('link', { name: /order via whatsapp/i });
      const href = link.getAttribute('href') ?? '';
      // The URL is assembled via template literals — spaces and commas are NOT encoded
      expect(href).toContain('wa.me/254715035359');
      expect(href).toContain('Test Duvet');
      expect(href).toContain('5,000');
    });

    it('shows quantity for each item', () => {
      const items = [makeCartItem({ quantity: 3 })];
      render(<CartDrawer {...defaultProps} items={items} />);
      expect(screen.getByLabelText('Quantity')).toHaveTextContent('3');
    });
  });

  describe('interactions', () => {
    it('calls onUpdateQuantity with +1 when + button clicked', async () => {
      const onUpdateQuantity = vi.fn();
      const items = [makeCartItem({ id: 'p1', name: 'Test Duvet' })];
      render(<CartDrawer {...defaultProps} items={items} onUpdateQuantity={onUpdateQuantity} />);
      await userEvent.click(screen.getByLabelText(/increase quantity for test duvet/i));
      expect(onUpdateQuantity).toHaveBeenCalledWith('p1', 1);
    });

    it('calls onUpdateQuantity with -1 when − button clicked', async () => {
      const onUpdateQuantity = vi.fn();
      const items = [makeCartItem({ id: 'p1', name: 'Test Duvet' })];
      render(<CartDrawer {...defaultProps} items={items} onUpdateQuantity={onUpdateQuantity} />);
      await userEvent.click(screen.getByLabelText(/decrease quantity for test duvet/i));
      expect(onUpdateQuantity).toHaveBeenCalledWith('p1', -1);
    });

    it('calls onRemove when trash icon clicked', async () => {
      const onRemove = vi.fn();
      const items = [makeCartItem({ id: 'p1', name: 'Test Duvet' })];
      render(<CartDrawer {...defaultProps} items={items} onRemove={onRemove} />);
      await userEvent.click(screen.getByLabelText(/remove test duvet/i));
      expect(onRemove).toHaveBeenCalledWith('p1');
    });

    it('calls onClose when X button clicked', async () => {
      const onClose = vi.fn();
      render(<CartDrawer {...defaultProps} onClose={onClose} />);
      await userEvent.click(screen.getByLabelText(/close bag/i));
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe('upsell', () => {
    it('shows products not already in the cart', () => {
      const p1 = makeProduct({ id: 'p1', name: 'Cart Product' });
      const p2 = makeProduct({ id: 'p2', name: 'Upsell Product' });
      const items = [makeCartItem({ id: 'p1', name: 'Cart Product' })];
      render(<CartDrawer {...defaultProps} items={items} allProducts={[p1, p2]} />);
      expect(screen.getByText('Upsell Product')).toBeInTheDocument();
      // p1 is in cart — should not appear in upsell
      const productNames = screen.getAllByText('Cart Product');
      // One occurrence (in the cart item row), NOT two
      expect(productNames).toHaveLength(1);
    });

    it('shows at most 3 upsell products', () => {
      const allProducts = Array.from({ length: 6 }, (_, i) =>
        makeProduct({ id: `up${i}`, name: `Up ${i}` })
      );
      render(<CartDrawer {...defaultProps} allProducts={allProducts} />);
      const plusButtons = screen.getAllByRole('button', { name: '' }).filter(
        (b) => b.querySelector('svg') !== null
      );
      // Can't easily count by name here, so verify via upsell heading presence + max 3 items
      const heading = screen.getByText(/complete your collection/i);
      expect(heading).toBeInTheDocument();
      // 6 products, 0 in cart → slice(0,3) → 3 upsell entries
      expect(screen.getAllByText(/Up \d/).length).toBe(3);
    });
  });
});
