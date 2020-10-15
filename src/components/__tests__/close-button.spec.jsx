import React from 'react'
import { create } from 'react-test-renderer';

import CloseButton from 'components/close-button'

const createWrapper = () => create(<CloseButton />)

describe('CloseButton', () => {
  test('matches snapshot', () => {
    expect(createWrapper()).toMatchSnapshot()
  })
})