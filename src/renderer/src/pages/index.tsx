import Editor from './editor'
import Head from './head'
import styles from './index.module.less'

function AppContent() {
  return (
    <div className={styles.container}>
      <Head />
      <Editor />
    </div>
  )
}
export default AppContent
