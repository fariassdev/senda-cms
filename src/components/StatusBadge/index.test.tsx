import { render, screen } from '@testing-library/react';
import React from 'react';
import { StatusBadge } from '.';

describe('StatusBadge', () => {
  const testCases = [
    {
      status: 'PENDING',
      expectedLabel: 'Pending',
      expectedClasses: ['text-muted-foreground', 'bg-muted'],
    },
    {
      status: 'SCRIPT_GENERATING',
      expectedLabel: 'Generating Script',
      expectedClasses: ['text-info', 'bg-info/10'],
      shouldAnimate: true,
    },
    {
      status: 'AUDIO_GENERATING',
      expectedLabel: 'Generating Audio',
      expectedClasses: ['text-info', 'bg-info/10'],
      shouldAnimate: true,
    },
    {
      status: 'SCRIPT_COMPLETED',
      expectedLabel: 'Script Ready',
      expectedClasses: ['text-warning', 'bg-warning/10'],
    },
    {
      status: 'AUDIO_COMPLETED',
      expectedLabel: 'Completed',
      expectedClasses: ['text-success', 'bg-success/10'],
    },
    {
      status: 'SCRIPT_FAILED',
      expectedLabel: 'Script Failed',
      expectedClasses: ['text-destructive', 'bg-destructive/10'],
    },
    {
      status: 'AUDIO_FAILED',
      expectedLabel: 'Audio Failed',
      expectedClasses: ['text-destructive', 'bg-destructive/10'],
    },
  ];

  testCases.forEach(
    ({ status, expectedLabel, expectedClasses, shouldAnimate }) => {
      it(`renders ${status} status with correct label and styling`, () => {
        render(<StatusBadge status={status} />);

        const badge = screen
          .getByText(expectedLabel)
          .closest('[data-slot="badge"]');
        expect(badge).toBeInTheDocument();

        // Check that the badge has the expected color classes
        expectedClasses.forEach((className) => {
          expect(badge).toHaveClass(className);
        });

        // Check animation for generating states
        if (shouldAnimate) {
          const icon = badge?.querySelector('svg');
          expect(icon).toHaveClass('animate-spin');
        }
      });
    },
  );

  it('renders unknown status with fallback styling', () => {
    render(<StatusBadge status="UNKNOWN_STATUS" />);

    const badge = screen
      .getByText('UNKNOWN_STATUS')
      .closest('[data-slot="badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-muted-foreground', 'bg-muted');
  });

  it('applies custom className', () => {
    render(<StatusBadge status="PENDING" className="custom-class" />);

    const badge = screen.getByText('Pending').closest('[data-slot="badge"]');
    expect(badge).toHaveClass('custom-class');
  });
});
