// eslint-disable-next-line no-unused-vars
import { h, Component } from 'preact';
import { isEmpty, reject, includes, concat, mapValues } from 'lodash';

import ProductSelector from './ProductSelector';
import Error from './Error';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      values: props.field.getValue(),
      products: [],
      error: ''
    };
  }

  componentDidMount() {
    // Callback for changes of the field value.
    this.detachValueChangeHandler = this.props.field.onValueChanged(
      this.handleValueChange
    );

    this.updateProducts();
  }

  componentWillUnmount() {
    this.detachValueChangeHandler();
  }

  updateProducts = () => {
    this.fetchProducts()
      .then(products => {
        if (products.length > 0) {
          return this.setState({ products });
        }
        return this.setState({ error: 'No matching products entries found' });
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.error(e);
        const error = e.message ? e.message : 'Failed to fetch products.';
        this.setState({ error });
      });
  };

  fetchProducts = async () => {
    const { locale } = this.props.field;
    const products = await this.props.space.getEntries({
      content_type: 'product',
      include: 2
    });

    const productsWithImages = await Promise.all(
      products.items.map(async ({ fields }) => {
        const { fields: imgFields } = await this.props.space.getAsset(
          fields.image['en-US'].sys.id
        );
        const productWithImage = Object.assign({}, fields, {
          image: imgFields.file
        });

        return mapValues(productWithImage, (value, key) => {
          if (!value) {
            return undefined;
          }

          if (key === 'name') {
            return value['en-US'];
          }

          if (key === 'image') {
            return `${value[locale].url}?w=80&h=80`;
          }

          return value[locale];
        });
      })
    );

    return productsWithImages;
  };

  /**
   * Handler for external field value changes (e.g. when multiple authors are
   * working on the same entry).
   */
  handleValueChange = (values = []) => {
    this.setState({ values, error: '' });
  };

  /**
   * Handler for changes of the input value
   */
  handleClick = event => {
    const { value } = event.target;
    const currentValues = this.state.values;

    const newValues = includes(currentValues, value)
      ? reject(currentValues, v => v === value)
      : concat(currentValues, value);
    this.setState({ values: newValues });

    if (isEmpty(newValues)) {
      this.props.field.removeValue();
    } else {
      this.props.field.setValue(newValues);
    }
  };

  // eslint-disable-next-line class-methods-use-this
  render(props, { values, products, error }) {
    return (
      <div>
        {products.length ? (
          <ul>
            {products.map(
              ({ productId, name, image, price, promotionPrice }) => (
                <ProductSelector
                  key={productId}
                  id={productId}
                  onClick={this.handleClick}
                  checked={includes(values, productId)}
                  value={productId}
                  label={name}
                  src={image}
                  price={price}
                  promotionPrice={promotionPrice}
                />
              )
            )}
          </ul>
        ) : null}
        {error && <Error>{error}</Error>}
      </div>
    );
  }
}
