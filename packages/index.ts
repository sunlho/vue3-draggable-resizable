import type { App, Plugin } from "vue"

import Vue3DraggableResizable from "./components/Vue3DraggableResizable"
import DraggableContainer from "./components/DraggableContainer"

export { Vue3DraggableResizable, DraggableContainer }

const components = [Vue3DraggableResizable, DraggableContainer]

const install = (app: App): void => {
  components.forEach((component) => {
    app.component(component.name as string, component)
  })
}

const plugin: Plugin = {
  install,
}

export default plugin
