import { foo } from './nested/directory/b'

export const x = 1

export function bar() {
    return foo() + foo()
}
