import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NewVehicleForm from '../NewVehicleForm';

describe('NewVehicleForm', () => {
  it('renders form and submit button', () => {
    render(<NewVehicleForm onClose={() => {}} onSubmit={() => {}} />);
    expect(screen.getByText('Nuevo Ingreso')).toBeTruthy();
    expect(screen.getByText(/REGISTRAR INGRESO/i)).toBeTruthy();
  });
});
