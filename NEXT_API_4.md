
```jsx

// lib
const useWindowButton = (increment) => {
  window.addEventListener('click', increment);
  useUnmount(() => {
    window.removeEventListener('click', increment)
  })
}

const useCounter = (name = 'sub', initialValue = 0) => {
  const state = useState(name, {
    counter: initialValue;
  })
  const incrementAction = () => (state) => ({ counter: state.counter + 1 })
  return useAction(`${name}Increment`, incrementAction)
}
// file

const init = props => {
  useState({
    counter: 0
  })
  const incrementAction = () => (state) => ({ counter: state.counter + 1 })
  const increment = useAction('increment', incrementAction)
  useWindowButton(increment)
  
  const incrementSubCounter = useSubCounter('sub', 10)
  useWindowButton(incrementSubCounter)
}

const Component = actions => (props, state) => (
  <div
    ref="container"
  >
    coucou
    <span>{props.name}:{state.counter}</span>
    <span>{state.sub.counter}</span>
    <div onClick={actions.increment}>increment</div>
    <div onClick={actions.subIncrement}>increment sub</div>
  </div>
)

vif(init)(Component)