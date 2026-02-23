import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MultiSelect } from './MultiSelect';

describe('MultiSelect', () => {
  it('uses single mode and returns only one selected value', () => {
    const onChange = vi.fn();

    render(
      <MultiSelect
        options={[
          { id: 1, name: 'Option 1' },
          { id: 2, name: 'Option 2' },
        ]}
        selected={[]}
        onChange={onChange}
        placeholder="Pick one"
        mode="single"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Pick one' }));

    const optionInput = screen.getByLabelText('Option 2');
    expect(optionInput).toHaveAttribute('type', 'radio');

    fireEvent.click(optionInput);
    expect(onChange).toHaveBeenCalledWith([2]);
  });

  it('uses selectedCountLabel for multiple selections', () => {
    render(
      <MultiSelect
        options={[
          { id: 1, name: 'Option 1' },
          { id: 2, name: 'Option 2' },
          { id: 3, name: 'Option 3' },
        ]}
        selected={[1, 2, 3]}
        onChange={vi.fn()}
        selectedCountLabel={(count) => `${count} chosen`}
      />
    );

    expect(screen.getByText('3 chosen')).toBeInTheDocument();
  });
});
