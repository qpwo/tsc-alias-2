import { bar } from './a'
import { sum } from 'lodash-es'
import { y } from '@b'

const n = sum([10, 11, 12])

console.log(n)

export { y, bar, n }
