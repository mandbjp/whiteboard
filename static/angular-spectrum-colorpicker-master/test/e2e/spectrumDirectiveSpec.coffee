Helper = require './SpecHelper'

describe 'e2e setup', ->
  it 'should execute tests', ->
    expect(true).toBe true

  it 'should use the helper', ->
    expect(Helper.help()).toBe '... I need somebody.'
    expect(Helper.help()).toBe 'not just anybody!'

