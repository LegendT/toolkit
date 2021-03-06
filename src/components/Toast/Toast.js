/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import invariant from '../../utility/invariant';
import MODULE from './module';
import GATEWAY_CONTEXT_TYPES from '../Gateway/contextTypes';
import { contextKey } from '../Gateway/module';

export default class Toast extends Component {
  static module = MODULE;

  static contextTypes = GATEWAY_CONTEXT_TYPES;

  static defaultProps = {
    dismissable: false,
    duration: 5000,
  };

  static propTypes = {
    children: PropTypes.node,
    dismissable: PropTypes.bool,
    duration: PropTypes.number,
    gateName: PropTypes.string.isRequired,
  };

  constructor(props, context) {
    super();

    invariant(typeof context[contextKey] !== 'undefined',
      'A `Toast` must be instantiated within a `Gateway`.');
  }

  componentDidMount() {
    const { duration } = this.props;

    if (duration > 0) {
      setTimeout(this.hideToast, duration);
    }
  }

  @bind
  handleOnClick(e) {
    e.preventDefault();

    if (this.props.dismissable) {
      this.hideToast();
    }
  }

  @bind
  hideToast() {
    this.getContext(null, contextKey).warpOut(this.props.gateName, this.getInternalElement());
  }

  render() {
    const { children, dismissable } = this.props;

    return (
      <a
        href=""
        role="note"
        className={this.formatClass({
          'is-dismissable': dismissable,
        })}
        onClick={this.handleOnClick}
      >
        {children}
      </a>
    );
  }
}
