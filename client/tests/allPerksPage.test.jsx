import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';

import AllPerks from '../src/pages/AllPerks.jsx';
import { renderWithRouter } from './utils/renderWithRouter.js';

describe('AllPerks page (Directory)', () => {
  test('lists public perks and responds to name filtering', async () => {
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // ✅ Wait until perks data is loaded (handle async loadAllPerks)
    await waitFor(async () => {
      // Try waiting until the "Loading..." message disappears
      expect(screen.queryByText(/loading perks/i)).not.toBeInTheDocument();
    }, { timeout: 8000 });

    // ✅ Now confirm that the seeded perk appears (case-insensitive search)
    await waitFor(() => {
      expect(
        screen.getByText((content, node) =>
          content.toLowerCase().includes(seededPerk.title.toLowerCase())
        )
      ).toBeInTheDocument();
    });

    // Type the perk title in the search field
    const nameFilter = screen.getByPlaceholderText('Enter perk name...');
    fireEvent.change(nameFilter, { target: { value: seededPerk.title } });

    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    });

    // Verify the “Showing ...” text updates correctly
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });

  test('lists public perks and responds to merchant filtering', async () => {
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait until loading finishes
    await waitFor(async () => {
      expect(screen.queryByText(/loading perks/i)).not.toBeInTheDocument();
    }, { timeout: 8000 });

    // Confirm seeded perk is visible in the initial list
    await waitFor(() => {
      expect(
        screen.getByText((content, node) =>
          content.toLowerCase().includes(seededPerk.title.toLowerCase())
        )
      ).toBeInTheDocument();
    });

    // ✅ Find the merchant dropdown (uses “Filter by Merchant” label)
    const merchantDropdown = screen.getByRole('combobox');


    // Change to seeded merchant
    fireEvent.change(merchantDropdown, { target: { value: seededPerk.merchant } });

    // Wait for filtered results
    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    });

    // Verify summary text updates correctly
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });
});
