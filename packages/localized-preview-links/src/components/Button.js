// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import classNames from 'classnames';

export default ({ children, primary, secondary, loading, block, ...props }) => (
  <button
    class={classNames({
      'cf-btn-primary': primary,
      'cf-btn-secondary': secondary,
      'cf-is-loading': loading,
      'cf-block': block
    })}
    {...props}
  >
    {children}
  </button>
);
