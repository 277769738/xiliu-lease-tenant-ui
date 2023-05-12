import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

const TenantKey = 'Admin-Tenant'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTenant() {
  return Cookies.get(TenantKey)
}

export function setTenant(tenantid) {
  return Cookies.set(TenantKey, tenantid)
}

export function removeTenant() {
  return Cookies.remove(TenantKey)
}
