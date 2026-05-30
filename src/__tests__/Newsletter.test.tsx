import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import Newsletter from '../components/Newsletter';

describe('Newsletter', () => {
  it('shows the subscription form initially', () => {
    render(<Newsletter />);
    expect(screen.getByPlaceholderText(/studio@email/i)).toBeInTheDocument();
  });

  it('submitting with a valid email shows the success state', async () => {
    const user = userEvent.setup();
    render(<Newsletter />);
    const input = screen.getByPlaceholderText(/studio@email/i);
    // Type the email then press Enter — focus stays on the input so Enter
    // triggers the form's submit handler.
    await user.type(input, 'test@example.com');
    await user.keyboard('{Enter}');
    // findByText polls until the success state appears (handles async re-renders)
    await screen.findByText(/welcome to the studio/i);
    expect(screen.queryByPlaceholderText(/studio@email/i)).not.toBeInTheDocument();
  });

  it('submitting an empty email does not show success state', () => {
    render(<Newsletter />);
    // handleSubmit guards with `if (!email) return` so submitting without a
    // value leaves the form visible.
    fireEvent.submit(screen.getByPlaceholderText(/studio@email/i).closest('form')!);
    expect(screen.queryByText(/welcome to the studio/i)).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText(/studio@email/i)).toBeInTheDocument();
  });
});
