import { describe, it, expect } from 'vitest';
import { generatePalette, OFFICIAL_FOREST_PALETTE } from './paletteGenerator';

describe('paletteGenerator', () => {
  it('genera paleta no vacia desde un hex base', () => {
    const palette = generatePalette('#04202C');
    expect(Object.keys(palette).length).toBeGreaterThan(0);
  });

  it('toda salida es hex valido (formato #RRGGBB)', () => {
    const palette = generatePalette('#FF420E');
    for (const [key, value] of Object.entries(palette)) {
      expect(value, `${key} = ${value}`).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it('acepta hex de 3 chars y de 6 chars', () => {
    const short = generatePalette('#abc');
    const long = generatePalette('#aabbcc');
    expect(Object.keys(short)).toEqual(Object.keys(long));
  });

  it('OFFICIAL_FOREST_PALETTE expone los tokens core de marca', () => {
    expect(OFFICIAL_FOREST_PALETTE).toHaveProperty('color-forest');
    expect(OFFICIAL_FOREST_PALETTE['color-forest']).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it('genera paletas distintas para inputs distintos', () => {
    const a = generatePalette('#04202C');
    const b = generatePalette('#FF420E');
    const aValues = Object.values(a).join();
    const bValues = Object.values(b).join();
    expect(aValues).not.toEqual(bValues);
  });
});
