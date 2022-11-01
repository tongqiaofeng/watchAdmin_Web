import { defineStore } from 'pinia';
import  _sessionStorage from '@/utils/sessionStorage';

export const useUserStore = defineStore('userStore', {
  state: () => {
    return {
      token: _sessionStorage.get('token') || '',
      adminInfo: _sessionStorage.get('admin_info') || {}
    }
  },
  getters: {},
  actions: {
    setToken(token) {
      this.token = token;
      _sessionStorage.set('token', token);
    },
    setAdminInfo(data) {
      this.adminInfo = data;
      _sessionStorage.set('admin_info', data);
    },
    loginout() {
      this.adminInfo = {};
      this.token = '';
      _sessionStorage.remove('admin_info');
      _sessionStorage.remove('token');
    }
  }
})