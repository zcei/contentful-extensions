// eslint-disable-next-line no-unused-vars
import { h, Component } from 'preact';
import { isEmpty, reject, includes, concat } from 'lodash';

import { CARD_SCHEMES, LABELS } from '../constants';

import CardSchemeSelector from './CardSchemeSelector';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      values: props.field.getValue()
    };
  }

  componentDidMount() {
    // Callback for changes of the field value.
    this.detachValueChangeHandler = this.props.field.onValueChanged(
      this.handleValueChange
    );
  }

  componentWillUnmount() {
    this.detachValueChangeHandler();
  }

  /**
   * Handler for external field value changes (e.g. when multiple authors are
   * working on the same entry).
   */
  handleValueChange = (values = []) => {
    this.setState({ values });
  };

  /**
   * Handler for changes of the input value
   */
  handleClick = event => {
    const { value } = event.target;
    const currentValues = this.state.values
    const newValues = includes(currentValues, value) ?
      reject(currentValues, v => v === value) :
      concat(currentValues, value);
    this.setState({ values: newValues });

    if (isEmpty(newValues)) {
      this.props.field.removeValue();
    } else {
      this.props.field.setValue(newValues);
    }
  };

  // eslint-disable-next-line class-methods-use-this
  render(props, { values }) {
    return (
      <ul>
        {CARD_SCHEMES.map(id => (
          <CardSchemeSelector
            key={id}
            id={id}
            onClick={this.handleClick}
            checked={includes(values, id)}
            value={id}
            label={LABELS[id]}
          />
        ))}
      </ul>
    );
  }
}
