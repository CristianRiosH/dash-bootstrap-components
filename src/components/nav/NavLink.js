import React from 'react';
import PropTypes from 'prop-types';
import {omit} from 'ramda';
import classNames from 'classnames';
import Link from '../../private/Link';

/**
 * Add a link to a `Nav`. Can be used as a child of `NavItem` or of `Nav`
 * directly.
 */
const NavLink = props => {
  const {
    children,
    disabled,
    className,
    active,
    loading_state,
    setProps,
    n_clicks,
    ...otherProps
  } = props;

  const incrementClicks = () => {
    if (!disabled && setProps) {
      setProps({
        n_clicks: n_clicks + 1,
        n_clicks_timestamp: Date.now()
      });
    }
  };

  let classes;
  if (active == null) {
    // need to remove https/http from page links then test if the same
    const linkPage = otherProps.href.replace(/(^\w+:|^)\/\//, '');
    const currentPage = window.location.href.replace(/(^\w+:|^)\/\//, '');
    const isActive = linkPage == currentPage ? true : false;
    console.log(isActive);
    // get string for class style
    const classStyle = {};
    classStyle.active = isActive ? true : false;
    classStyle.disabled = disabled ? true : false;
    classes = classNames(className, 'nav-link', classStyle);
  } else {
    // if user has defined the active class then uses user input instead
    classes = classNames(className, 'nav-link', {active, disabled});
  }

  return (
    <Link
      className={classes}
      disabled={disabled}
      preOnClick={incrementClicks}
      {...omit(['n_clicks_timestamp'], otherProps)}
      data-dash-is-loading={
        (loading_state && loading_state.is_loading) || undefined
      }
    >
      {children}
    </Link>
  );
};

NavLink.defaultProps = {
  active: null,
  disabled: false,
  n_clicks: 0,
  n_clicks_timestamp: -1
};

NavLink.propTypes = {
  /**
   * The ID of this component, used to identify dash components
   * in callbacks. The ID needs to be unique across all of the
   * components in an app.
   */
  id: PropTypes.string,

  /**
   * The children of this component
   */
  children: PropTypes.node,

  /**
   * Defines CSS styles which will override styles previously set.
   */
  style: PropTypes.object,

  /**
   * Often used with CSS to style elements with common properties.
   */
  className: PropTypes.string,

  /**
   * A unique identifier for the component, used to improve
   * performance by React.js while rendering components
   * See https://reactjs.org/docs/lists-and-keys.html for more info
   */
  key: PropTypes.string,

  /**
   * The URL of the linked resource.
   */
  href: PropTypes.string,

  /**
   * Apply 'active' style to this component
   */
  active: PropTypes.bool,

  /**
   * Disable the link
   */
  disabled: PropTypes.bool,

  /**
   * If true, the browser will treat this as an external link,
   * forcing a page refresh at the new location. If false,
   * this just changes the location without triggering a page
   * refresh. Use this if you are observing dcc.Location, for
   * instance. Defaults to true for absolute URLs and false
   * otherwise.
   */
  external_link: PropTypes.bool,

  /**
   * An integer that represents the number of times
   * that this element has been clicked on.
   */
  n_clicks: PropTypes.number,

  /**
   * An integer that represents the time (in ms since 1970)
   * at which n_clicks changed. This can be used to tell
   * which button was changed most recently.
   */
  n_clicks_timestamp: PropTypes.number,

  /**
   * Object that holds the loading state object coming from dash-renderer
   */
  loading_state: PropTypes.shape({
    /**
     * Determines if the component is loading or not
     */
    is_loading: PropTypes.bool,
    /**
     * Holds which property is loading
     */
    prop_name: PropTypes.string,
    /**
     * Holds the name of the component that is loading
     */
    component_name: PropTypes.string
  }),

  /**
   * Target attribute to pass on to the link. Only applies to external links.
   */
  target: PropTypes.string
};

export default NavLink;
