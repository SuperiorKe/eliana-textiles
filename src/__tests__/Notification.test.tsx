import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Notification from '../components/Notification';

describe('Notification', () => {
  it('renders message when show is true', () => {
    render(<Notification show={true} message="Added to Bag" />);
    expect(screen.getByText('Added to Bag')).toBeInTheDocument();
  });

  it('renders nothing when show is false', () => {
    render(<Notification show={false} message="Added to Bag" />);
    expect(screen.queryByText('Added to Bag')).not.toBeInTheDocument();
  });
});
