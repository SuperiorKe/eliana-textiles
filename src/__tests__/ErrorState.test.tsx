import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ErrorState from '../components/ErrorState';

describe('ErrorState', () => {
  it('renders the provided error message', () => {
    render(<ErrorState message="Network timeout" onRetry={vi.fn()} />);
    expect(screen.getByText('Network timeout')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Error" onRetry={onRetry} />);
    await userEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
