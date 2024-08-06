const Validator = require('jsonschema').Validator

const { quotation } = require('./../api/controllers/resources').schemas

const examples = [
  {
    "text": "Only two things are infinite, the universe and human stupidity and I'm not sure about the former.",
    "author": "Albert Einstein"
  },
  {
    "text": "Strive not to be a success, but rather to be of value.",
    "author": "Albert Einstein"
  }
]

const badExample = {
  "test": 'not a good property',
  'other': 'another field'
}

main()

function main () {
  const validator = new Validator()
  const goodExample = examples[1]
  const goodValidation = validator.validate(goodExample, quotation)
  console.log(goodValidation.valid)

  const badValidation = validator.validate(badExample, quotation)
  console.log(badValidation.valid)
}