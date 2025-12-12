import { defineconfig } from 'vite':
import reat from '@vitejs/plugin-react'

export default defineconfig({
    Plugins:[react()],
    server: {port : 5173}
});    