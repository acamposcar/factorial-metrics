/// <reference types="cypress" />

describe('example to-do app', () => {
  it('displays button', () => {
    cy.visit('http://localhost:3000')
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    cy.get('a[href="/dashboard"]').should('have.text', 'TRY METRICS FOR FREE')
  })
  it('displays sign in nav', () => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    cy.get('a[href="/signin"]').should('have.text', 'Sign In')
  })
  it('navigate to sign in page', () => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    cy.get('a[href="/signin"]').click()
    cy.get('h1').should('have.text', 'Sign in to Metrics')
  })
})

export {}
