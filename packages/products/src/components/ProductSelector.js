// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function ProductSelector({
  id,
  src,
  label,
  promotionPrice,
  ...props
}) {
  return (
    <li class="pr-wrapper">
      <input type="checkbox" class="pr-checkbox" id={id} {...props} />
      <label class="pr-label" for={id}>
        {promotionPrice && (
          <span class="pr-promo">Promo: {promotionPrice}</span>
        )}
        <img src={src} alt={label} class="pr-img" />
        <span class="pr-hint cf-form-hint">{label}</span>
      </label>
    </li>
  );
}
