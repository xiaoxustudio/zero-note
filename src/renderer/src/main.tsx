import ReactDOM from 'react-dom/client'
import App from './pages'
import '@renderer/assets/styles/index.css'
import { ConfigProvider } from 'antd'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider
    theme={{
      components: {
        Tree: {
          indentSize: 15
        }
      }
    }}
  >
    <App />
  </ConfigProvider>
)
