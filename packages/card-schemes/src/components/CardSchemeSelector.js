// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { toLower } from 'lodash';

export default function CardSchemeSelector({ label, id, ...props }) {
  return (
    <li class="cs-wrapper">
      <input type="checkbox" class="cs-checkbox" id={id} {...props} />
      <label class="cs-label" for={id}>
        <svg class="cs-icon">
          <use xlinkHref={`#icon-${toLower(id)}`} />
        </svg>
        <span class="cs-hint cf-form-hint">{label}</span>
      </label>
    </li>
  );
}
