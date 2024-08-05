const storage = [
  {
    resource_id: 1,
    title: 'Document #1',
    text: 'Never Forget that no military leader ever became great without audacity.',
    author: 'Carl von Clausewitz'
  },
  {
    resource_id: 2,
    title: 'Document #2',
    text: 'Courage, above all things, is the first quality of a warrior.',
    author: 'Carl von Clausewitz'
  },
  {
    resource_id: 3,
    title: 'Document #3',
    text: 'You cannot escape the responsibility of tomorrow by evading it today.',
    author: 'Abraham Lincoln'
  },
  {
    resource_id: 4,
    title: 'Document #4',
    text: 'Give me six hours to chop down a tree and I will spend the first four sharpening the axe.',
    author: 'Abraham Lincoln'
  },
  {
    resource_id: 5,
    title: 'Document #5',
    text: 'The supreme art of war is to subdue the enemy without fighting.',
    author: 'Sun Tzu'
  },
  {
    resource_id: 6,
    title: 'Document #6',
    text: 'Invincibility lies in defense; The possibility of victory in the attack.',
    author: 'Sun Tzu'
  },
  {
    resource_id: 7,
    title: 'Document #7',
    text: "Freedom is never more than one generation away from extinction. We didn't pass it to our children in the bloodstream. It must be fought for, protected, and handed on to them to do the same.",
    author: 'Ronald Reagan'
  },
  {
    resource_id: 8,
    title: 'Document #8',
    text: 'Peace is not the absence of conflict. It is the ability to handle conflict by peaceful means.',
    author: 'Ronald Reagan'
  }
]

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

class Resource {

  constructor () {
    this.store = storage
  }

  get nextId () {
    return Math.max(...this.store.map(x => x.resource_id)) + 1
  }

  list (query) {
    // TODO: deal with queries
    const payload = {
      status: 200,
      message: `Listed all resources`,
      data: this.store
    }
    return payload
  }

  getById ({ resource_id }) {
    const resource = this.store.find(x => x.resource_id == resource_id)
    const payload = {
      status: resource ? 200 : 404,
      message: resource ? `Fetched resource with id ${resource_id}` : `Resource with id ${resource_id} not found.`,
      data: resource
    }
    return payload
  }

  create ({ text, author }) {
    const resource_id = this.nextId
    console.log(resource_id)
    const resource = {
      resource_id,
      title: `Document #${resource_id}`,
      text,
      author
    }
    this.store.push(resource)
    const payload = {
      status: 201,
      message: `Created resource with id ${resource_id}`,
      data: resource
    }
    return payload
  }

  update ({ resource_id }, { text, author }) {
    const index = this.store.findIndex(x => x.resource_id == resource_id)
    const resource = {
      resource_id,
      title: `Document #${resource_id}`,
      text,
      author
    }
    this.store.splice(index, 1, resource)
    const payload = {
      status: 200,
      message: `Updated resource with id ${resource_id}`,
      data: resource
    }
    return payload
  }

  remove ({ resource_id }) {
    const index = this.store.findIndex(x => x.resource_id == resource_id)
    this.store.splice(index, 1)
    const payload = {
      status: 200,
      message: `Deleted resource with id ${resource_id}`,
      data: []
    }
    return payload
  }

}

module.exports = Resource
