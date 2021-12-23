import Login from '@/views/auth-views/Login.vue'
import Signup from '@/views/auth-views/Signup.vue'
import SignupEmail from '@/views/auth-views/SignupEmail.vue'
import LoginEmail from '@/views/auth-views/LoginEmail.vue'
import Terms from '@/views/auth-views/Terms.vue'
import VerifyEmail from '@/views/auth-views/VerifyEmail.vue'
import { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'auth',
    redirect: '/auth/login'
  },
  {
    path: '/auth/signup',
    name: 'auth-signup',
    component: Signup
  },
  {
    path: '/auth/signup/email',
    name: 'auth-signup-email',
    component: SignupEmail
  },
  {
    path: '/auth/login/email',
    name: 'auth-login-email',
    component: LoginEmail
  },
  {
    path: '/auth/login',
    name: 'auth-login',
    component: Login
  },
  {
    path: '/auth/terms',
    name: 'auth-terms',
    component: Terms
  },
  {
    path: '/auth/verify/email',
    name: 'auth-verify-email',
    component: VerifyEmail
  }
]
