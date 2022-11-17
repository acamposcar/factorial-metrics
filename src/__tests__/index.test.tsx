import { render, screen } from '@testing-library/react'
import Home from '../pages/index'
import '@testing-library/jest-dom'
import { expect } from '@jest/globals'

describe('Home', () => {
  it('renders home', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: 'Visualize metrics the easy way'
    })

    expect(heading).toBeTruthy()
  })
})
