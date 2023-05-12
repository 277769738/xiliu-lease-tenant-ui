import defaultSettings from '@/settings'

const title = defaultSettings.title || '服务系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
