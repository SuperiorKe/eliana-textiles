import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from '../App';
import { PRODUCTS } from '../data/products';
import type { Product } from '../types';

// ─── helpers ────────────────────────────────────────────────────────────────

function mockFetch(products: Product[] = PRODUCTS) {
  return vi.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(products),
  } as Response);
}

/** Returns aria-labels of all rendered product cards in DOM order. */
async function getProductNames() {
  await waitFor(() =>
    expect(screen.getAllByRole('button', { name: /view details for/i }).length).toBeGreaterThan(0)
  );
  return screen
    .getAllByRole('button', { name: /view details for/i })
    .map((el) => el.getAttribute('aria-label')!.replace('View details for ', ''));
}

// ─── setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

// ─── fetch / loading ─────────────────────────────────────────────────────────

describe('product fetch', () => {
  it('shows a loading spinner before products arrive', () => {
    // Never resolves during this test
    vi.spyOn(global, 'fetch').mockReturnValue(new Promise(() => {}));
    render(<App />);
    expect(screen.getByText(/curating collection/i)).toBeInTheDocument();
  });

  it('renders all products after a successful fetch', async () => {
    mockFetch();
    render(<App />);
    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: /view details for/i })).toHaveLength(PRODUCTS.length)
    );
  });

  it('shows ErrorState when the API returns a non-ok status', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      text: () => Promise.resolve(JSON.stringify({ error: 'Service unavailable' })),
    } as Response);
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText('Service unavailable')).toBeInTheDocument()
    );
  });

  it('shows a generic error message on a network failure', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Failed to fetch'));
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument()
    );
  });

  it('retries the fetch when the retry button is clicked', async () => {
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(PRODUCTS),
      } as Response);

    render(<App />);
    await waitFor(() => screen.getByRole('button', { name: /retry/i }));
    await userEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: /view details for/i })).toHaveLength(PRODUCTS.length)
    );
  });
});

// ─── category filtering ───────────────────────────────────────────────────────

describe('category filtering', () => {
  it('shows all products when "All" is selected (default)', async () => {
    mockFetch();
    render(<App />);
    const names = await getProductNames();
    expect(names).toHaveLength(PRODUCTS.length);
  });

  it('shows only Duvets when the Duvets filter is clicked', async () => {
    mockFetch();
    render(<App />);
    await getProductNames(); // wait for load
    await userEvent.click(screen.getByRole('button', { name: 'Duvets' }));
    const names = await getProductNames();
    const expected = PRODUCTS.filter((p) => p.category === 'Duvets').map((p) => p.name);
    expect(names.sort()).toEqual(expected.sort());
  });

  it('shows only Mattresses when the Mattresses filter is clicked', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();
    await userEvent.click(screen.getByRole('button', { name: 'Mattresses' }));
    const names = await getProductNames();
    const expected = PRODUCTS.filter((p) => p.category === 'Mattresses').map((p) => p.name);
    expect(names.sort()).toEqual(expected.sort());
  });

  it('Accessories catch-all includes products with non-standard categories', async () => {
    const extraProduct: Product = {
      id: 'x1',
      name: 'Bespoke Throw',
      category: 'Accessories', // not in the three named categories
      price: 800,
      description: '',
      image: '',
      reviews: [],
    };
    mockFetch([...PRODUCTS, extraProduct]);
    render(<App />);
    await getProductNames();
    await userEvent.click(screen.getByRole('button', { name: 'Accessories' }));
    const names = await getProductNames();
    // Standard "Accessories" products + our extra one
    expect(names).toContain('Bespoke Throw');
    // Named-category products must not appear
    expect(names).not.toContain('Premium Luxury Duvet Set');
    expect(names).not.toContain('Cloud-Comfort Orthopedic Mattress');
  });
});

// ─── search ───────────────────────────────────────────────────────────────────

describe('search', () => {
  async function openSearch() {
    await userEvent.click(screen.getByLabelText(/open search/i));
  }

  it('filters products by name substring', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();

    await openSearch();
    await userEvent.type(screen.getByLabelText(/search collections/i), 'duvet');
    const names = await getProductNames();
    expect(names.every((n) => n.toLowerCase().includes('duvet'))).toBe(true);
  });

  it('shows the empty-results message when no products match', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();

    await openSearch();
    await userEvent.type(screen.getByLabelText(/search collections/i), 'zzznomatch');
    await waitFor(() =>
      expect(screen.getByText(/no textiles matching/i)).toBeInTheDocument()
    );
  });

  it('restores all products when the clear search button is clicked', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();

    await openSearch();
    await userEvent.type(screen.getByLabelText(/search collections/i), 'zzznomatch');
    await waitFor(() => screen.getByText(/no textiles matching/i));
    await userEvent.click(screen.getByRole('button', { name: /clear search/i }));
    const names = await getProductNames();
    expect(names).toHaveLength(PRODUCTS.length);
  });

  it('ranks exact name matches above substring matches', async () => {
    // "Silky Smooth Cotton Set" exactly contains "silky smooth cotton set"
    // but "Cloud-Comfort Orthopedic Mattress" does not contain it at all.
    // After searching "cotton", only Cotton Set should appear.
    mockFetch();
    render(<App />);
    await getProductNames();

    await openSearch();
    await userEvent.type(screen.getByLabelText(/search collections/i), 'cotton');
    const names = await getProductNames();
    expect(names).toContain('Silky Smooth Cotton Set');
    expect(names).not.toContain('Cloud-Comfort Orthopedic Mattress');
  });
});

// ─── sorting ─────────────────────────────────────────────────────────────────

describe('sorting', () => {
  it('sorts by price low-to-high', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();
    await userEvent.selectOptions(screen.getByRole('combobox'), 'price-low');
    const names = await getProductNames();
    const sorted = [...PRODUCTS].sort((a, b) => a.price - b.price).map((p) => p.name);
    expect(names).toEqual(sorted);
  });

  it('sorts by price high-to-low', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();
    await userEvent.selectOptions(screen.getByRole('combobox'), 'price-high');
    const names = await getProductNames();
    const sorted = [...PRODUCTS].sort((a, b) => b.price - a.price).map((p) => p.name);
    expect(names).toEqual(sorted);
  });

  it('sorts by name A-Z', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();
    await userEvent.selectOptions(screen.getByRole('combobox'), 'name-az');
    const names = await getProductNames();
    const sorted = [...PRODUCTS].sort((a, b) => a.name.localeCompare(b.name)).map((p) => p.name);
    expect(names).toEqual(sorted);
  });
});

// ─── cart ─────────────────────────────────────────────────────────────────────

describe('cart', () => {
  it('cart count starts at zero', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();
    expect(screen.getByLabelText(/shopping bag, 0 items/i)).toBeInTheDocument();
  });

  it('increments the cart count when a product is added', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();
    const firstProduct = PRODUCTS[0];
    await userEvent.click(screen.getByLabelText(`Add ${firstProduct.name} to bag`));
    expect(screen.getByLabelText(/shopping bag, 1 items/i)).toBeInTheDocument();
  });

  it('increments quantity (not count) when the same product is added twice', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();
    const firstProduct = PRODUCTS[0];
    await userEvent.click(screen.getByLabelText(`Add ${firstProduct.name} to bag`));
    await userEvent.click(screen.getByLabelText(`Add ${firstProduct.name} to bag`));
    // Count is 2 (total quantity), not 2 unique items
    expect(screen.getByLabelText(/shopping bag, 2 items/i)).toBeInTheDocument();
  });

  it('shows an "Added to Bag" notification after adding a product', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();
    await userEvent.click(screen.getByLabelText(`Add ${PRODUCTS[0].name} to bag`));
    expect(screen.getByText(/added to bag/i)).toBeInTheDocument();
  });
});

// ─── comparison ───────────────────────────────────────────────────────────────

describe('comparison', () => {
  it('comparison bar is hidden when no products are added', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();
    expect(screen.queryByText(/items to compare/i)).not.toBeInTheDocument();
  });

  it('comparison bar appears when a product is added', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();
    await userEvent.click(screen.getByLabelText(`Add ${PRODUCTS[0].name} to comparison`));
    await waitFor(() =>
      expect(screen.getByText(/1 item to compare/i)).toBeInTheDocument()
    );
  });

  it('silently caps the comparison list at 4 items', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();

    // Add 5 products — the 5th should be ignored
    for (const product of PRODUCTS.slice(0, 5)) {
      await userEvent.click(screen.getByLabelText(`Add ${product.name} to comparison`));
    }
    await waitFor(() =>
      expect(screen.getByText(/4 items to compare/i)).toBeInTheDocument()
    );
    expect(screen.queryByText(/5 items to compare/i)).not.toBeInTheDocument();
  });
});

// ─── wishlist ─────────────────────────────────────────────────────────────────

describe('wishlist', () => {
  it('wishlist count starts at zero', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();
    expect(screen.getByLabelText(/wishlist, 0 items/i)).toBeInTheDocument();
  });

  it('increments the wishlist count when a product is added', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();
    await userEvent.click(screen.getByLabelText(`Add ${PRODUCTS[0].name} to wishlist`));
    expect(screen.getByLabelText(/wishlist, 1 items/i)).toBeInTheDocument();
  });

  it('removes the product when the same product is toggled again', async () => {
    mockFetch();
    render(<App />);
    await getProductNames();
    await userEvent.click(screen.getByLabelText(`Add ${PRODUCTS[0].name} to wishlist`));
    await waitFor(() => screen.getByLabelText(/wishlist, 1 items/i));
    await userEvent.click(screen.getByLabelText(`Remove ${PRODUCTS[0].name} from wishlist`));
    await waitFor(() =>
      expect(screen.getByLabelText(/wishlist, 0 items/i)).toBeInTheDocument()
    );
  });
});
