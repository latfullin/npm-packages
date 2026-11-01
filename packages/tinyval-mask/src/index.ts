export {
  createMask,
  mask,
  unmask,
  isComplete,
  isValid,
  toMask,
  defaultTokens,
  type Mask,
  type MaskInput,
  type MaskOptions,
  type MaskResult,
  type Pattern,
  type Token,
} from './core.js';
export { numberMask, type NumberMaskOptions } from './number.js';
export { attach, type AttachedMask, type AttachOptions, type MaskState } from './dom.js';
export * as masks from './presets.js';
export type { CardBrand, DateFormat, PhoneCountry, CountryInfo, PhoneAutoOptions, PhoneAutoMask, PhoneTable } from './presets.js';
