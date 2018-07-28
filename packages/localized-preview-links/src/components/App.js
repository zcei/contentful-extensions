// eslint-disable-next-line no-unused-vars
import { h, Component } from 'preact';

import Button from './Button';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.slugField = props.entry.fields.path || props.entry.fields.slug;

    this.state = {
      isLoading: true,
      links: []
    };
  }

  componentDidMount() {
    this.updateLinks();
  }

  updateLinks = () => {
    this.setState({ isLoading: true });
    Promise.all([this.fetchWebsites(), this.fetchSlugs()]).then(
      ([websites, slugs]) => {
        const links = slugs
          .reduce((allLinks, { locale, slug }) => {
            const website = websites[locale];
            if (!slug || !website) {
              return allLinks;
            }
            const { domain, country } = website;
            const link = `https://${domain}/${slug}/`;
            allLinks.push({ locale, link, country });
            return allLinks;
          }, [])
          .sort((a, b) => a.country.localeCompare(b.country));
        this.setState({ links, isLoading: false });
      }
    );
  };

  fetchWebsites = () => {
    const promises = this.props.entry.fields.websites
      .getValue('en-US')
      .map(({ sys }) => this.props.space.getEntry(sys.id));
    return Promise.all(promises).then(websites =>
      websites.reduce((allWebsites, { fields }) => {
        const { zeta, siteLocale, country } = fields;
        if (!siteLocale || !zeta) {
          return allWebsites;
        }
        allWebsites[siteLocale['en-US']] = {
          domain: zeta['en-US'],
          country: country['en-US']
        };
        return allWebsites;
      }, {})
    );
  };

  fetchSlugs = () =>
    this.props.locales.available
      .map(locale => ({ locale, slug: this.slugField.getValue(locale) }))
      .filter(({ slug }) => slug && !/untitled-entry/.test(slug));

  // eslint-disable-next-line class-methods-use-this
  render(props, { isLoading, links }) {
    const label = isLoading ? 'Loading' : 'Refresh preview links';
    return (
      <div>
        {links.length > 0 && (
          <ul>
            {links.map(({ locale, link, country }) => (
              <li key={locale}>
                <a href={link} target="_blank">
                  {country} ({locale})
                </a>
              </li>
            ))}
          </ul>
        )}
        <Button
          onClick={this.updateLinks}
          loading={isLoading}
          disabled={isLoading}
          secondary
          block
        >
          {label}
        </Button>
      </div>
    );
  }
}
