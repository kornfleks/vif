# vif

<p align="center">
  <img
    width="100" src="https://s15.postimg.cc/6ucv6frej/vif_logo_1_3x.png"
    alt="Vue logo"
  >
</p>

Vif is a Javascript library for building user interface.

- **Functionnal**: No object oriented programming pattern are needed to use Vif. The provided API do not include `Class` despite React does.
- **Simple**: Vif allow you to write simple code.
#
## Installation

### boilerplate

*The boilerplate is not ready yet. It will provide a pre-configured node project with Webpack and Babel.*

### npm

```
$ npm install --save vif
```
To use vif with jsx you will need to add [babel-plugin-transform-react-jsx](https://www.npmjs.com/package/babel-plugin-transform-react-jsx) to your `.babelrc` file with the following configuration:
```json
{
  "plugins": [
    [
      "transform-react-jsx",
      {
          "pragma": "Vif"
      }
    ]
  ]
}
```

#

## Usage

### Hello world
The render function load the application in the DOM into a provided element.
```js
import Vif from 'vif'

Vif.render(
  <span>Hello World!</span>,
  document.getElementById('app')
)
```
*or*
```js
import Vif from 'vif'

const Hello = props => (
  <span>Hello {props.to}!</span>
)

Vif.render(
  <Hello to="World" />,
  document.getElementById('app')
)
```

### Simple component
A simple component is a function with a single argument (props) that return JSX or a string.

*[more information about JSX](https://reactjs.org/docs/introducing-jsx.html)*
```js
import Vif from 'vif'

const BigText = props => (
  <h1
    style={{
      color: props.color,
      fontSize: `${props.size}rem`
    }}
  >
    {props.children}
  </h1>
)

const App = props => (
  <div
    className="app"
  >
    <BigText
      color="orange"
      size={4}
    >
      Hi!
    </BigText>
  </div>
)
```
#### props
A prop can be of any type, it can even be a function. All tags declared between the opening and closing tags of Component are passed trough props in the property named `children`.
#### JSX obligation
```js
import Vif from 'vif'
```
This import have to be in the scope of every component declaration in order to link JSX with vif.

### Smart component

```js
import Vif, { smart } from 'vif'

const humanizeLightState = isOn =>
  isOn ? 'on' : 'off'

const LightSwitch = actions => (props, state) => (
  <div
    className="LightSwitch"
  >
    <button onClick={actions.turnOn}>
      on
    </div>
    <div onClick={actions.turnOff}>
      off
    </div>
    <div onClick={actions.toggle}>
      toggle
    </div>
    <h1>light is {humanizeLightState(state.isOn)}</h1>
  </div>
)

const state = {
  isOn: false
}

const actions = {
  turnOn: () => ({
    isOn: true
  }),
  turnOff: () => ({
    isOn: false
  }),
  toggle: () => (state) => ({
    isOn: !state.isOn
  })
}

const lifecycle = {
  onUpdate: ({ lastState, nextState }) => {

    console.log(`The light was ${humanizeLightState(lastState.isOn)}.`)
    console.log(`It is now ${humanizeLightState(nextState.isOn)}.`)

  }
}

export default smart({ state, actions, lifecycle })(Counter)
```

#### state

The simplest way to declare state is with an object.
```js
const state = {
  foo: 'bar'
}
```
State can be a function that will be called before component mounting with his initial props.
```js
const state = (props) => ({
  foo: props.bar
})
```

#### actions

An action is a function that can be wrapped in another function.

```js
const actions = {
  setCounterValue: value => ({
    value
  })
}
```

If the action return a function. This returned function will be called with two arguments: props and state.

```js
const actions = {
  incrementCounter: () => (props, state) => ({
    value: state.value + 1
  })
}
```

Action can be asynchronous by returning a Promise.

```js
const actions = {
  setCounterValue: value => new Promise(resolve =>
    setTimeout(() => {
      resolve({ value })
    }, 1000)
  ),
  incrementCounter: () => (props, state) => new Promise(resolve =>
    setTimeout(() => {
      resolve({ value: state.value + 1 })
    }, 1000)
  )
}
```
*The readability of asynchronous action can be improved by using `async` and `await` keyword.*
```js
const delay = duration => new Promise(resolve => setTimeout(resolve, duration))

const actions = {
  setCounterValue: async (value) => {
    await delay(1000)
    return { value }
  },
  incrementCounter: () => async (props, state) => {
    await delay(1000)
    return { value: state.value + 1 }
  }
}
```

#### lifecycle

```js
const lifecycle = {
  onMount: ({ props, state }) => {

  },
  onUpdate: ({ lastState, nextState, lastProps, nextProps }) => {

  },
  onUnmount: ({ props, state }) => {

  }
}
```

## Roadmap
*Code structure is a pre-lerna implementation.*

Vif is still in an early development state. Some of the API are going to be changed and others will be implemented.

- [x] Implement asynchronous actions
- [ ] Add lerna
- [ ] Define proper lifecyle API
- [ ] Implement DOM element references API
- [ ] Create a boilerplate in its own git repository
- [ ] Create a clean documentation
