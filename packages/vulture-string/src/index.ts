import { createRender, createRenderStream, JSXElementAsync } from 'vulture'
import * as renderer from './renderer'

export { renderer }

export const render = createRender(renderer)
export const renderStream = createRenderStream(renderer)
